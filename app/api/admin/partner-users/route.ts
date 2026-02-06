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
        { error: 'Supabase not configured' },
        { status: 500 }
      );
    }

    const authHeader = request.headers.get('authorization');
    const bearerToken = authHeader?.toLowerCase().startsWith('bearer ')
      ? authHeader.slice(7)
      : null;
    const cookieToken = request.cookies
      .getAll()
      .find((c) => c.name.includes('sb-') && c.name.includes('-auth-token'))
      ?.value;

    const { createClient: createAnon } = await import('@supabase/supabase-js');
    const supabaseAnon = createAnon(supabaseUrl, supabaseAnonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
      global: { headers: bearerToken ? { Authorization: `Bearer ${bearerToken}` } : undefined },
    });
    const {
      data: { user },
      error: authError,
    } = await supabaseAnon.auth.getUser(bearerToken || cookieToken);

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: userRole } = await supabaseService
      .from('partner_users')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle();
    if (userRole?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { data: partnerUsers, error } = await supabaseService
      .from('partner_users')
      .select('user_id, partner_id, role, points')
      .order('user_id');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const withEmails: { user_id: string; partner_id: string | null; email: string | null; points: number }[] = [];
    for (const pu of partnerUsers || []) {
      const { data: authUser } = await supabaseService.auth.admin.getUserById(pu.user_id);
      withEmails.push({
        user_id: pu.user_id,
        partner_id: pu.partner_id,
        email: authUser?.user?.email ?? null,
        points: pu.points ?? 0,
      });
    }

    return NextResponse.json({ users: withEmails });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Internal error' }, { status: 500 });
  }
}
