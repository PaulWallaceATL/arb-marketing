import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseService =
  supabaseUrl && supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      })
    : null;

export async function GET(request: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseAnonKey || !supabaseService) {
      return NextResponse.json(
        {
          error: 'Supabase not configured',
          details: 'Missing NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, or SUPABASE_SERVICE_ROLE_KEY',
        },
        { status: 500 }
      );
    }

    // Auth via bearer token (preferred) or auth cookie fallback
    const authHeader = request.headers.get('authorization');
    const bearerToken = authHeader?.toLowerCase().startsWith('bearer ')
      ? authHeader.slice(7)
      : null;
    const cookieTokens = request.cookies
      .getAll()
      .filter((c) => c.name.includes('sb-') && c.name.includes('-auth-token'));
    const cookieToken = cookieTokens[0]?.value;
    const hasBearer = !!bearerToken;
    const hasCookieAuth = !!cookieToken;

    const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        headers: bearerToken
          ? { Authorization: `Bearer ${bearerToken}` }
          : undefined,
      },
    });

    const {
      data: { user },
      error: authError,
    } = await supabaseAnon.auth.getUser(bearerToken || cookieToken);

    if (authError || !user) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          details: authError?.message || 'No user from token',
          hasBearer,
          hasCookieAuth,
          bearerLength: bearerToken?.length || 0,
          cookieTokenLength: cookieToken?.length || 0,
        },
        { status: 401 }
      );
    }

    // Check admin role
    const { data: userRole } = await supabaseService
      .from('partner_users')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle();
    const userIsAdmin = userRole?.role === 'admin';

    if (!userIsAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    // Fetch submissions
    const { data: submissions, error: subError } = await supabaseService
      .from('referral_submissions')
      .select(
        `
          id,
          lead_name,
          lead_email,
          lead_phone,
          status,
          created_at,
          submitted_by_user_id,
          partner_id
        `
      )
      .order('created_at', { ascending: false });

    if (subError) {
      return NextResponse.json(
        { error: 'Failed to fetch submissions', details: subError.message },
        { status: 500 }
      );
    }

    const byUserId: Record<string, any[]> = {};
    const userIds = new Set<string>();
    (submissions || []).forEach((s) => {
      if (s.submitted_by_user_id) {
        userIds.add(s.submitted_by_user_id);
        byUserId[s.submitted_by_user_id] = byUserId[s.submitted_by_user_id] || [];
        byUserId[s.submitted_by_user_id].push(s);
      }
    });

    // Fetch user emails via admin API
    const users: { user_id: string; email: string | null }[] = [];
    for (const uid of userIds) {
      const { data, error } = await supabaseService.auth.admin.getUserById(uid);
      if (error) {
        users.push({ user_id: uid, email: null });
      } else {
        users.push({ user_id: uid, email: data.user?.email || null });
      }
    }

    const result = users.map((u) => ({
      user_id: u.user_id,
      email: u.email,
      submissions: byUserId[u.user_id] || [],
    }));

    return NextResponse.json({ users: result }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message },
      { status: 500 }
    );
  }
}

