import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Rate Limiting Store
 * Simple in-memory store for rate limiting
 * In production, use Redis or similar
 */
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

/**
 * Rate Limiter
 * Implements basic rate limiting per IP address
 */
function checkRateLimit(ip: string, maxRequests: number = 100, windowMs: number = 900000): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetAt) {
    // Create new record or reset expired one
    rateLimitStore.set(ip, {
      count: 1,
      resetAt: now + windowMs,
    });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

/**
 * Clean up expired rate limit records
 * Runs periodically to prevent memory leaks
 */
function cleanupRateLimits() {
  const now = Date.now();
  for (const [ip, record] of rateLimitStore.entries()) {
    if (now > record.resetAt) {
      rateLimitStore.delete(ip);
    }
  }
}

// Cleanup every 15 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimits, 900000);
}

/**
 * Protected Routes Configuration
 * Define which routes require authentication
 */
const protectedRoutes = [
  '/api/referral/submissions',
  '/api/admin',
];

const adminRoutes = [
  '/api/admin/dashboard',
  '/api/admin/submission',
  '/api/admin/users-with-submissions',
];

/**
 * Main Middleware Function
 * Handles authentication, authorization, and rate limiting
 */
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const pathname = req.nextUrl.pathname;

  // Get client IP for rate limiting
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';

  // Apply rate limiting to API routes
  if (pathname.startsWith('/api/')) {
    const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100');
    const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000');

    if (!checkRateLimit(ip, maxRequests, windowMs)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }
  }

  // Check if route requires authentication
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

  // If hitting admin APIs with a Bearer token, let the route handler perform auth
  const authHeader = req.headers.get('authorization');
  const hasBearer = authHeader?.toLowerCase().startsWith('bearer ');
  if (pathname.startsWith('/api/admin') && hasBearer) {
    return res;
  }

  if (isProtectedRoute || isAdminRoute) {
    // Create Supabase client
    const supabase = createMiddlewareClient({ req, res });

    // Check authentication
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      // Redirect to login for dashboard pages
      if (!pathname.startsWith('/api/')) {
        const redirectUrl = new URL('/partners/login', req.url);
        redirectUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(redirectUrl);
      }

      // Return 401 for API routes
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    // Check admin authorization for admin routes
    if (isAdminRoute) {
      const { data: partnerUser } = await supabase
        .from('partner_users')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      if (!partnerUser || partnerUser.role !== 'admin') {
        if (!pathname.startsWith('/api/')) {
          return NextResponse.redirect(new URL('/partners/dashboard', req.url));
        }

        return NextResponse.json(
          { error: 'Forbidden. Admin access required.' },
          { status: 403 }
        );
      }
    }
  }

  // Add security headers
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Add CSP header
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net https://www.googletagmanager.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: https:;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://*.supabase.co;
    frame-ancestors 'none';
  `.replace(/\s{2,}/g, ' ').trim();

  res.headers.set('Content-Security-Policy', cspHeader);

  return res;
}

/**
 * Middleware Configuration
 * Define which routes should run through middleware
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - assets folder
     */
    '/((?!_next/static|_next/image|favicon.ico|assets|.*\\..*$).*)',
  ],
};

