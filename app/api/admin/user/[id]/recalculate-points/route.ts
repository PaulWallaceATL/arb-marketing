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

const POINTS_SUBMISSION = 10;
const POINTS_DENIAL = 10;
const POINTS_APPROVAL = 250;
const POINTS_APPROVAL_BONUS_EVERY_5 = 500;

const isApproved = (s: string) => s === 'approved' || s === 'qualified' || s === 'converted';
const isDenied = (s: string) => s === 'denied';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!supabaseUrl || !supabaseAnonKey || !supabaseService) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 500 }
      );
    }

    const { id } = await params;

    const authHeader = request.headers.get('authorization');
    const bearerToken = authHeader?.toLowerCase().startsWith('bearer ')
      ? authHeader.slice(7)
      : null;
    const cookieTokens = request.cookies
      .getAll()
      .filter((c) => c.name.includes('sb-') && c.name.includes('-auth-token'));
    const cookieToken = cookieTokens[0]?.value;

    const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
      global: {
        headers: bearerToken ? { Authorization: `Bearer ${bearerToken}` } : undefined,
      },
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
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Get target user's partner_id
    const { data: targetPu } = await supabaseService
      .from('partner_users')
      .select('partner_id')
      .eq('user_id', id)
      .maybeSingle();

    const partnerId = targetPu?.partner_id ?? null;

    // Submissions where this user is the submitter
    const { data: directSubs } = await supabaseService
      .from('referral_submissions')
      .select('id, status')
      .eq('submitted_by_user_id', id);

    // Unassigned submissions linked to this user's partner (award to primary partner user)
    let partnerSubs: { id: string; status: string }[] = [];
    if (partnerId) {
      const { data: puList } = await supabaseService
        .from('partner_users')
        .select('user_id')
        .eq('partner_id', partnerId)
        .order('user_id', { ascending: true });
      const primaryUserId = puList?.[0]?.user_id;
      if (primaryUserId === id) {
        const { data: unassigned } = await supabaseService
          .from('referral_submissions')
          .select('id, status')
          .eq('partner_id', partnerId)
          .is('submitted_by_user_id', null);
        partnerSubs = unassigned || [];
      }
    }

    const allSubs = [...(directSubs || []), ...partnerSubs];
    const uniqueById = new Map(allSubs.map((s) => [s.id, s]));
    const submissions = Array.from(uniqueById.values());

    let points = 0;
    let approvedCount = 0;

    for (const s of submissions) {
      points += POINTS_SUBMISSION; // 10 per submission
      if (isDenied(s.status)) {
        points += POINTS_DENIAL;
      } else if (isApproved(s.status)) {
        approvedCount++;
      }
    }
    for (let i = 1; i <= approvedCount; i++) {
      const isFifth = i % 5 === 0;
      points += POINTS_APPROVAL + (isFifth ? POINTS_APPROVAL_BONUS_EVERY_5 : 0);
    }

    // Ensure partner_users row exists, then update points
    const { data: existingRow } = await supabaseService
      .from('partner_users')
      .select('user_id')
      .eq('user_id', id)
      .maybeSingle();

    if (!existingRow) {
      await supabaseService.from('partner_users').upsert(
        { user_id: id, partner_id: partnerId, role: 'partner', points },
        { onConflict: 'user_id' }
      );
    } else {
      const { error: updateErr } = await supabaseService
        .from('partner_users')
        .update({ points })
        .eq('user_id', id);

      if (updateErr) {
        return NextResponse.json(
          { error: 'Failed to update points', details: updateErr.message },
          { status: 500 }
        );
      }
    }

    await supabaseService.from('activity_log').insert({
      user_id: user.id,
      action: 'recalculate_points',
      entity_type: 'partner_user',
      entity_id: id,
      details: {
        recalculated_points: points,
        submissions_count: submissions.length,
        approved_count: approvedCount,
      },
    });

    return NextResponse.json({
      success: true,
      points,
      submissions_count: submissions.length,
      approved_count: approvedCount,
    });
  } catch (error: any) {
    console.error('Recalculate points error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message },
      { status: 500 }
    );
  }
}
