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

// GET: list raffles with entry counts
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

    const { data: userRole } = await supabaseService
      .from('partner_users')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle();
    const userIsAdmin = userRole?.role === 'admin';
    if (!userIsAdmin) {
      return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 });
    }

    const { data, error } = await supabaseService
      .from('raffles')
      .select('*, raffle_entries(count)')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Normalize entry counts
    const raffles = (data || []).map((r: any) => ({
      ...r,
      entry_count: Array.isArray(r.raffle_entries) && r.raffle_entries.length > 0
        ? r.raffle_entries[0].count
        : 0,
    }));

    return NextResponse.json({ raffles });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Internal error' }, { status: 500 });
  }
}

// POST: create raffle
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

    const { data: userRole } = await supabaseService
      .from('partner_users')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle();
    const userIsAdmin = userRole?.role === 'admin';
    if (!userIsAdmin) {
      return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, entry_cost_points, max_entries, image_url } = body || {};

    if (!name || !entry_cost_points || !max_entries) {
      return NextResponse.json({ error: 'name, entry_cost_points, max_entries are required' }, { status: 400 });
    }

    const { data, error } = await supabaseService
      .from('raffles')
      .insert({
        name,
        description: description || null,
        entry_cost_points,
        max_entries,
        image_url: image_url || null,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ raffle: data });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Internal error' }, { status: 500 });
  }
}
