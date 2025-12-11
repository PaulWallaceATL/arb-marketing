import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
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

  // Auth: get user from session cookie (anon key) with explicit cookie adapter
  let user = null;
  let userError = null;
  try {
    const cookieStore: any = await cookies();
    const supabaseAnon = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          const val = cookieStore.get(name)?.value;
          return val ?? null;
        },
        set() {},
        remove() {},
      },
    });
    const res = await supabaseAnon.auth.getUser();
    user = res.data.user;
    userError = res.error;
  } catch (err: any) {
    user = null;
    userError = err;
  }

  if (userError || !user) {
    return NextResponse.json(
      { submissions: [], warning: 'Unauthorized', details: userError?.message },
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


