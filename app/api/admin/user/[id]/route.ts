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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    // Auth via bearer token (preferred) or auth cookie fallback
    const authHeader = request.headers.get('authorization');
    const bearerToken = authHeader?.toLowerCase().startsWith('bearer ')
      ? authHeader.slice(7)
      : null;
    const cookieTokens = request.cookies
      .getAll()
      .filter((c) => c.name.includes('sb-') && c.name.includes('-auth-token'));
    const cookieToken = cookieTokens[0]?.value;

    const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        headers: bearerToken ? { Authorization: `Bearer ${bearerToken}` } : undefined,
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

    // Target user info
    const { data: targetUser, error: tErr } = await supabaseService.auth.admin.getUserById(id);
    if (tErr) {
      return NextResponse.json(
        { error: 'Failed to fetch user', details: tErr.message },
        { status: 404 }
      );
    }

    // Submissions for that user
    const { data: submissions, error: subErr } = await supabaseService
      .from('referral_submissions')
      .select('id, lead_name, lead_email, lead_phone, status, created_at, lead_message')
      .eq('submitted_by_user_id', id)
      .order('created_at', { ascending: false });

    if (subErr) {
      return NextResponse.json(
        { error: 'Failed to fetch submissions', details: subErr.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        user: {
          id: targetUser.user?.id,
          email: targetUser.user?.email,
        },
        submissions: submissions || [],
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message },
      { status: 500 }
    );
  }
}

