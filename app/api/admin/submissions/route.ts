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
        {
          error: 'Supabase not configured',
          details:
            'Missing NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, or SUPABASE_SERVICE_ROLE_KEY',
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

    const body = await request.json();
    const {
      user_id,
      lead_name,
      lead_email,
      lead_phone,
      lead_company,
      lead_message,
      status = 'pending',
      referral_code,
      partner_id,
      admin_notes,
      conversion_value,
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
    } = body || {};

    if (!lead_name || !lead_email) {
      return NextResponse.json(
        { error: 'lead_name and lead_email are required' },
        { status: 400 }
      );
    }

    const allowedStatuses = ['pending', 'approved', 'denied'];
    const normalizedStatus = allowedStatuses.includes(status) ? status : 'pending';

    const newSubmission = {
      partner_id: partner_id || null,
      referral_code: referral_code || null,
      lead_name,
      lead_email,
      lead_phone: lead_phone || null,
      lead_company: lead_company || null,
      lead_message: lead_message || null,
      submission_source: 'admin_entry',
      utm_source: utm_source || null,
      utm_medium: utm_medium || null,
      utm_campaign: utm_campaign || null,
      status: normalizedStatus,
      conversion_value: conversion_value ?? null,
      admin_notes: admin_notes || null,
      submitted_by_user_id: user_id || null,
      is_authenticated: !!user_id,
      is_accounted: !!user_id,
      lead_job_title: lead_job_title || null,
      lead_industry: lead_industry || null,
      lead_company_size: lead_company_size || null,
      lead_budget_range: lead_budget_range || null,
      lead_timeline: lead_timeline || null,
      lead_pain_points: lead_pain_points || null,
      lead_linkedin_url: lead_linkedin_url || null,
      quality_score: quality_score ?? null,
    };

    const { data, error } = await supabaseService
      .from('referral_submissions')
      .insert(newSubmission)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to create submission', details: error.message },
        { status: 500 }
      );
    }

    // Award points: +1 for any referral, +2 extra if approved at creation
    if (user_id) {
      const { data: pointsRow } = await supabaseService
        .from('partner_users')
        .select('points')
        .eq('user_id', user_id)
        .maybeSingle();
      const currentPoints = pointsRow?.points ?? 0;
      const bonusForApproved = normalizedStatus === 'approved' ? 2 : 0;
      await supabaseService
        .from('partner_users')
        .update({ points: currentPoints + 1 + bonusForApproved })
        .eq('user_id', user_id);
    }

    await supabaseService.from('activity_log').insert({
      user_id: user.id,
      action: 'create_submission',
      entity_type: 'referral_submission',
      entity_id: data.id,
      details: { newSubmission },
    });

    return NextResponse.json({ data }, { status: 201 });
  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message },
      { status: 500 }
    );
  }
}


