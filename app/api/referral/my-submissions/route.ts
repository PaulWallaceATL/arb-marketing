import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET(request: NextRequest) {
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      { submissions: [], warning: 'Supabase not configured (missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY)' },
      { status: 200 }
    );
  }

  if (!supabaseServiceRoleKey) {
    return NextResponse.json(
      { submissions: [], warning: 'Service role key missing on server (SUPABASE_SERVICE_ROLE_KEY)' },
      { status: 200 }
    );
  }

  // Auth: prefer Authorization Bearer token; fallback to cookie lookup
  let user = null;
  let userError = null;
  const authHeader = request.headers.get('authorization');
  const bearerToken = authHeader?.toLowerCase().startsWith('bearer ')
    ? authHeader.slice(7)
    : null;

  // attempt to find any sb-*-auth-token cookie
  const cookieTokens = request.cookies.getAll().filter((c) => c.name.includes('sb-') && c.name.includes('-auth-token'));
  const cookieToken = cookieTokens[0]?.value;

  try {
    const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const res = await supabaseAnon.auth.getUser(bearerToken || cookieToken);
    user = res.data.user;
    userError = res.error;
  } catch (err: any) {
    user = null;
    userError = err;
  }

  if (userError || !user) {
    // Debug: expose which cookies are present to understand missing session (no values)
    const cookieKeys = request.cookies.getAll().map((c) => c.name);
    const hasAuthCookie = cookieKeys.some((name) => name.includes('sb-') && name.includes('-auth-token'));
    return NextResponse.json(
      {
        submissions: [],
        warning: 'Unauthorized',
        details: userError?.message || 'No user in session',
        cookieKeys,
        hasAuthCookie,
      },
      { status: 200 }
    );
  }

  // Service role client for data access
  const supabaseService = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Determine partner_id (if any) and role
  let partnerId: string | null = null;
  let role: string | null = null;
  try {
    const { data: partnerUser } = await supabaseService
      .from('partner_users')
      .select('partner_id, role')
      .eq('user_id', user.id)
      .maybeSingle();
    if (partnerUser?.partner_id) {
      partnerId = partnerUser.partner_id;
    }
    if (partnerUser?.role) {
      role = partnerUser.role;
    }
  } catch (err) {
    // ignore; partnerId stays null
  }

  let submissions: any[] = [];
  let warning: string | null = null;
  let debug: any = {};

  try {
    const { data, error } = await supabaseService
      .from('referral_submissions')
      .select(
        `
          id,
          lead_name,
          lead_email,
          lead_phone,
          lead_message,
          referral_code,
          partner_id,
          submitted_by_user_id,
          status,
          quality_score,
          created_at
        `
      )
      .or(
        [
          `submitted_by_user_id.eq.${user.id}`,
          partnerId ? `partner_id.eq.${partnerId}` : null,
        ]
          .filter(Boolean)
          .join(',')
      )
      .order('created_at', { ascending: false });

    if (error) {
      warning = error.message;
      debug = { code: error.code, hint: error.hint, message: error.message };
    } else {
      submissions = data || [];
    }
  } catch (err: any) {
    warning = err?.message || 'Failed to fetch submissions';
    debug = { caught: err?.message };
  }

  return NextResponse.json({
    user: { id: user.id, email: user.email },
    partnerId,
    submissions,
    role,
    warning,
    debug,
  }, { status: 200 });
}


