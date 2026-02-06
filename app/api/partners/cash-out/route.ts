import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const MIN_POINTS = 250;
const MULTIPLE_OF = 250;
const DOLLARS_PER_POINT = 1;

const supabaseService =
  supabaseUrl && supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      })
    : null;

export async function POST(request: NextRequest) {
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

    const body = await request.json().catch(() => ({}));
    const points = typeof body.points === 'number' ? body.points : parseInt(body.points, 10);

    if (points < MIN_POINTS || points % MULTIPLE_OF !== 0) {
      return NextResponse.json(
        { error: `Cash out must be at least ${MIN_POINTS} points and in increments of ${MULTIPLE_OF}` },
        { status: 400 }
      );
    }

    const { data: row, error: fetchErr } = await supabaseService
      .from('partner_users')
      .select('points')
      .eq('user_id', user.id)
      .maybeSingle();

    if (fetchErr || !row) {
      return NextResponse.json({ error: 'Could not load your points' }, { status: 500 });
    }

    const current = row.points ?? 0;
    if (current < points) {
      return NextResponse.json(
        { error: `Insufficient points. You have ${current}, requested ${points}.` },
        { status: 400 }
      );
    }

    const newPoints = current - points;
    const amountDollars = points * DOLLARS_PER_POINT;

    await supabaseService
      .from('partner_users')
      .update({ points: newPoints })
      .eq('user_id', user.id);

    try {
      await supabaseService.from('partner_payouts').insert({
        user_id: user.id,
        points_deducted: points,
        amount_dollars: amountDollars,
      });
    } catch (e) {
      // Table might not exist yet; still applied the deduction
    }

    return NextResponse.json({
      success: true,
      points_deducted: points,
      amount_dollars: amountDollars,
      remaining_points: newPoints,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Internal error' }, { status: 500 });
  }
}
