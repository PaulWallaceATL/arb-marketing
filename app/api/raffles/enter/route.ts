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

    const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
      global: {
        headers: bearerToken ? { Authorization: `Bearer ${bearerToken}` } : undefined,
      },
    });

    const {
      data: { user },
      error: authError,
    } = await supabaseAnon.auth.getUser(bearerToken || undefined);

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { raffle_id } = body || {};

    if (!raffle_id) {
      return NextResponse.json({ error: 'raffle_id is required' }, { status: 400 });
    }

    // Fetch raffle details and current entry count
    const { data: raffle, error: raffleErr } = await supabaseService
      .from('raffles')
      .select('id, entry_cost_points, max_entries, status, raffle_entries(count)')
      .eq('id', raffle_id)
      .maybeSingle();

    if (raffleErr || !raffle) {
      return NextResponse.json({ error: 'Raffle not found' }, { status: 404 });
    }

    const entryCount = Array.isArray(raffle.raffle_entries) && raffle.raffle_entries.length > 0
      ? raffle.raffle_entries[0].count
      : 0;

    if (raffle.status !== 'active') {
      return NextResponse.json({ error: 'Raffle is not active' }, { status: 400 });
    }
    if (entryCount >= raffle.max_entries) {
      return NextResponse.json({ error: 'Raffle is full' }, { status: 400 });
    }

    // Get user points
    const { data: pointsRow, error: pointsErr } = await supabaseService
      .from('partner_users')
      .select('points')
      .eq('user_id', user.id)
      .maybeSingle();

    if (pointsErr) {
      return NextResponse.json({ error: 'Failed to fetch points' }, { status: 500 });
    }

    const currentPoints = pointsRow?.points ?? 0;
    if (currentPoints < raffle.entry_cost_points) {
      return NextResponse.json({ error: 'Insufficient points' }, { status: 400 });
    }

    // Create entry and deduct points
    const { error: entryErr } = await supabaseService
      .from('raffle_entries')
      .insert({
        raffle_id,
        user_id: user.id,
        points_spent: raffle.entry_cost_points,
      });

    if (entryErr) {
      return NextResponse.json({ error: 'Failed to create entry', details: entryErr.message }, { status: 500 });
    }

    const nextPoints = currentPoints - raffle.entry_cost_points;
    await supabaseService
      .from('partner_users')
      .upsert({ user_id: user.id, points: nextPoints }, { onConflict: 'user_id' });

    return NextResponse.json({ success: true, remaining_points: nextPoints });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Internal error' }, { status: 500 });
  }
}
