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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!supabaseUrl || !supabaseAnonKey || !supabaseService) {
      return NextResponse.json(
        {
          error: 'Supabase not configured',
          details:
            'Missing NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, or SUPABASE_SERVICE_ROLE_KEY',
        },
        { status: 500 }
      );
    }

    // Await params in Next.js 16+
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
    const hasBearer = !!bearerToken;
    const hasCookieAuth = !!cookieToken;

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
          hasBearer,
          hasCookieAuth,
          bearerLength: bearerToken?.length || 0,
          cookieTokenLength: cookieToken?.length || 0,
        },
        { status: 401 }
      );
    }

    // Check if user is admin
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

    const body = await request.json();
    const {
      status,
      admin_notes,
      conversion_value,
      lead_name,
      lead_email,
      lead_phone,
      lead_company,
      lead_message,
      referral_code,
      partner_id,
      submitted_by_user_id,
      utm_source,
      utm_medium,
      utm_campaign,
      lead_job_title,
      lead_industry,
      lead_company_size,
      lead_budget_range,
      lead_timeline,
      lead_pain_points,
      lead_linkedin_url,
      quality_score,
      is_accounted,
      is_authenticated,
    } = body || {};

    // Get existing submission for status transitions/points
    const { data: existingSubmission, error: existingErr } = await supabaseService
      .from('referral_submissions')
      .select('id,status,submitted_by_user_id')
      .eq('id', id)
      .maybeSingle();

    if (existingErr || !existingSubmission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    const previousStatus = existingSubmission.status;
    const submittedByUserId = existingSubmission.submitted_by_user_id;

    // Build update object
    const updateData: any = {};

    const allowedStatuses = ['pending', 'approved', 'denied'];
    if (status !== undefined) {
      updateData.status = allowedStatuses.includes(status) ? status : 'pending';
    }

    if (admin_notes !== undefined) {
      updateData.admin_notes = admin_notes;
    }

    if (conversion_value !== undefined) {
      updateData.conversion_value = conversion_value;
    }

    if (lead_name !== undefined) updateData.lead_name = lead_name;
    if (lead_email !== undefined) updateData.lead_email = lead_email;
    if (lead_phone !== undefined) updateData.lead_phone = lead_phone || null;
    if (lead_company !== undefined) updateData.lead_company = lead_company || null;
    if (lead_message !== undefined) updateData.lead_message = lead_message || null;

    if (referral_code !== undefined) updateData.referral_code = referral_code || null;
    if (partner_id !== undefined) updateData.partner_id = partner_id || null;

    if (submitted_by_user_id !== undefined) {
      updateData.submitted_by_user_id = submitted_by_user_id || null;
      updateData.is_authenticated =
        is_authenticated !== undefined ? is_authenticated : !!submitted_by_user_id;
      updateData.is_accounted =
        is_accounted !== undefined ? is_accounted : !!submitted_by_user_id;
    }

    if (utm_source !== undefined) updateData.utm_source = utm_source || null;
    if (utm_medium !== undefined) updateData.utm_medium = utm_medium || null;
    if (utm_campaign !== undefined) updateData.utm_campaign = utm_campaign || null;

    if (lead_job_title !== undefined) updateData.lead_job_title = lead_job_title || null;
    if (lead_industry !== undefined) updateData.lead_industry = lead_industry || null;
    if (lead_company_size !== undefined)
      updateData.lead_company_size = lead_company_size || null;
    if (lead_budget_range !== undefined)
      updateData.lead_budget_range = lead_budget_range || null;
    if (lead_timeline !== undefined) updateData.lead_timeline = lead_timeline || null;
    if (lead_pain_points !== undefined) updateData.lead_pain_points = lead_pain_points || null;
    if (lead_linkedin_url !== undefined)
      updateData.lead_linkedin_url = lead_linkedin_url || null;
    if (quality_score !== undefined) updateData.quality_score = quality_score;

    // Update the submission
    const { data, error } = await supabaseService
      .from('referral_submissions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to update submission', details: error.message, code: error.code, hint: error.hint },
        { status: 500 }
      );
    }

    // Award points if status transitions to approved from a non-approved state (ensure row exists)
    if (
      submittedByUserId &&
      previousStatus !== 'approved' &&
      updateData.status === 'approved'
    ) {
      const { data: pointsRow } = await supabaseService
        .from('partner_users')
        .select('points')
        .eq('user_id', submittedByUserId)
        .maybeSingle();
      const currentPoints = pointsRow?.points ?? 0;
      await supabaseService
        .from('partner_users')
        .upsert({ user_id: submittedByUserId, points: currentPoints + 2 }, { onConflict: 'user_id' });
    }

    // Log the activity
    await supabaseService.from('activity_log').insert({
      user_id: user.id,
      action: 'update_submission',
      entity_type: 'referral_submission',
      entity_id: id,
      details: { changes: updateData },
    });

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!supabaseUrl || !supabaseAnonKey || !supabaseService) {
      return NextResponse.json(
        { error: 'Supabase not configured', details: 'Missing NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, or SUPABASE_SERVICE_ROLE_KEY' },
        { status: 500 }
      );
    }

    // Await params in Next.js 16+
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

    // Fetch the submission
    const { data, error } = await supabaseService
      .from('referral_submissions')
      .select(`
        *,
        channel_partners (
          id,
          company_name,
          contact_name,
          email,
          referral_code
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!supabaseUrl || !supabaseAnonKey || !supabaseService) {
      return NextResponse.json(
        {
          error: 'Supabase not configured',
          details:
            'Missing NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, or SUPABASE_SERVICE_ROLE_KEY',
        },
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

    const { data, error } = await supabaseService
      .from('referral_submissions')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to delete submission', details: error.message, code: error.code, hint: error.hint },
        { status: 500 }
      );
    }

    await supabaseService.from('activity_log').insert({
      user_id: user.id,
      action: 'delete_submission',
      entity_type: 'referral_submission',
      entity_id: id,
      details: { deleted: data?.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message },
      { status: 500 }
    );
  }
}

