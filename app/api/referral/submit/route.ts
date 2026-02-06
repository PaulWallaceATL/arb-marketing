import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Use service role on the server to avoid RLS/anon issues
const supabase = supabaseUrl && supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : null;

export async function POST(request: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseAnonKey || !supabase) {
      return NextResponse.json(
        { error: 'Supabase not configured', details: 'Missing NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, or SUPABASE_SERVICE_ROLE_KEY' },
        { status: 500 }
      );
    }

    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid request body', details: 'Expected JSON' },
        { status: 400 }
      );
    }
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body', details: 'Body must be an object' },
        { status: 400 }
      );
    }

    const {
      referral_code,
      referrer_name,
      referrer_email,
      referrer_phone,
      relation_to_referral,
      lead_name,
      lead_email,
      lead_phone,
      lead_message,
      utm_source,
      utm_medium,
      utm_campaign,
    } = body as Record<string, unknown>;

    // Validate required fields (both emails are optional)
    const leadNameStr = lead_name != null ? String(lead_name).trim() : '';
    if (!leadNameStr) {
      return NextResponse.json(
        { error: 'Lead name is required' },
        { status: 400 }
      );
    }
    if (referrer_name || referrer_phone) {
      if (!referrer_name || !referrer_phone) {
        return NextResponse.json(
          { error: 'When providing referrer info, referrer name and phone are required' },
          { status: 400 }
        );
      }
    }
    if (referrer_name && !lead_phone) {
      return NextResponse.json(
        { error: 'Lead phone number is required' },
        { status: 400 }
      );
    }

    // Get user session using server client with request/response cookies
    let user = null;
    const authHeader = request.headers.get('authorization');
    const bearerToken = authHeader?.toLowerCase().startsWith('bearer ')
      ? authHeader.slice(7)
      : null;
    const cookieTokens = request.cookies.getAll().filter((c) => c.name.includes('sb-') && c.name.includes('-auth-token'));
    const cookieToken = cookieTokens[0]?.value;
    try {
      const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });
      const {
        data: { user: u },
      } = await supabaseAnon.auth.getUser(bearerToken || cookieToken);
      user = u;
    } catch (err) {
      user = null;
    }
    
    // Determine if this is an accounted referral (logged in partner)
    const is_accounted = !!user;
    
    // Get IP address and user agent for tracking (DB column is INET - must be single valid IP or null)
    const ip_header = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip');
    let ip_address: string | null = null;
    if (ip_header && ip_header !== 'unknown') {
      const first = String(ip_header).split(',')[0].trim();
      // INET accepts IPv4 (e.g. 1.2.3.4) or IPv6; reject comma/space lists or junk
      if (first && first.length >= 7 && first.length <= 45 && !/[\s,]/.test(first)) {
        ip_address = first;
      }
    }
    const user_agent = request.headers.get('user-agent') || 'unknown';

    // Find partner by referral code OR by logged-in user
    let partner_id = null;
    
    if (user) {
      // If logged in, get their partner ID
      const { data: partnerUser } = await supabase
        .from('partner_users')
        .select('partner_id')
        .eq('user_id', user.id)
        .single();
      
      partner_id = partnerUser?.partner_id || null;
    } else if (referral_code) {
      // If not logged in but has referral code
      const { data: partner } = await supabase
        .from('channel_partners')
        .select('id')
        .eq('referral_code', referral_code)
        .eq('status', 'active')
        .single();
      
      partner_id = partner?.id || null;
    }

    // Combine referrer info into notes so it's stored
    const referrerParts = [];
    if (referrer_name) referrerParts.push(`Name: ${referrer_name}`);
    if (referrer_email) referrerParts.push(`Email: ${referrer_email}`);
    if (referrer_phone) referrerParts.push(`Phone: ${referrer_phone}`);
    if (relation_to_referral) referrerParts.push(`Relation to referral: ${String(relation_to_referral).replace(/_/g, ' ')}`);
    const referrerBlock = referrerParts.length
      ? `\n\nReferrer Details:\n${referrerParts.join('\n')}`
      : '';
    const combined_message = [String(lead_message ?? '').trim(), referrerBlock].join('');

    // Calculate a simple quality score
    let quality_score = 0;
    if (lead_phone) quality_score += 20;
    if (referrer_email) quality_score += 10;
    if (referrer_phone) quality_score += 10;
    if (combined_message && combined_message.length > 40) quality_score += 20;

    // Normalize optional email (store null when empty; use '' for DBs that still have NOT NULL)
    const leadEmailValue = lead_email && String(lead_email).trim() ? String(lead_email).trim() : null;
    const leadEmailForDb = leadEmailValue ?? '';

    // Build insert record with no undefined (Supabase/Postgres can reject undefined).
    // Omit ip_address to avoid INET parse errors from proxies; we can add it back later with validation.
    // Omit status so DB default is used (production may have different check constraint: e.g. 'new' vs 'pending')
    const minimalRecord: Record<string, unknown> = {
      partner_id: partner_id ?? null,
      referral_code: referral_code ? String(referral_code) : null,
      lead_name: leadNameStr,
      lead_email: leadEmailForDb,
      lead_phone: lead_phone ? String(lead_phone) : null,
      lead_message: combined_message ? String(combined_message) : null,
      submission_source: 'web_form',
      user_agent: user_agent ?? null,
      utm_source: utm_source ? String(utm_source) : null,
      utm_medium: utm_medium ? String(utm_medium) : null,
      utm_campaign: utm_campaign ? String(utm_campaign) : null,
      submitted_by_user_id: user?.id ?? null,
      is_authenticated: !!user,
    };
    // Omit ip_address to avoid INET parse errors (proxies often send comma-separated or invalid values).
    // Optional: add back with strict validation if you need IP logging.

    const insertAttempt = async (record: Record<string, unknown>) => {
      return supabase!.from('referral_submissions').insert(record).select().single();
    };

    let data: { id: string } | null = null;
    let error: { message?: string; code?: string; hint?: string } | null = null;

    try {
      let result = await insertAttempt(minimalRecord);
      data = result.data as { id: string } | null;
      error = result.error;

      // If minimal insert fails due to missing columns, try with extended columns
      if (error && typeof error.message === 'string' && error.message.includes('column')) {
        const extendedRecord = { ...minimalRecord, lead_company: null, lead_job_title: null, lead_industry: null, lead_company_size: null, lead_budget_range: null, lead_timeline: null, lead_pain_points: null, lead_linkedin_url: null, is_accounted: !!user, quality_score };
        result = await insertAttempt(extendedRecord);
        data = result.data as { id: string } | null;
        error = result.error;
      }

      // If insert failed due to status check constraint (e.g. production allows 'new' not 'pending'), retry with status 'new'
      if (error && typeof error.message === 'string' && error.message.includes('referral_submissions_status_check')) {
        result = await insertAttempt({ ...minimalRecord, status: 'new' });
        if (!result.error) {
          data = result.data as { id: string } | null;
          error = null;
        }
      }

      // If service-role insert still fails, try anon client so RLS "Anyone can submit referrals" may allow it
      if (error) {
        const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey, {
          auth: { autoRefreshToken: false, persistSession: false },
        });
        const recordToTry = error.message && error.message.includes('status_check') ? { ...minimalRecord, status: 'new' } : minimalRecord;
        const anonResult = await supabaseAnon.from('referral_submissions').insert(recordToTry).select().single();
        if (!anonResult.error) {
          data = anonResult.data as { id: string } | null;
          error = null;
        }
      }

    } catch (insertErr: unknown) {
      const err = insertErr as Error;
      console.error('Referral insert threw:', err);
      return NextResponse.json(
        { error: 'Failed to submit referral', details: err?.message ?? String(insertErr) },
        { status: 500 }
      );
    }

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        {
          error: 'Failed to submit referral',
          details: error.message ?? 'Database error',
          code: (error as any)?.code,
          hint: (error as any)?.hint,
        },
        { status: 500 }
      );
    }

    if (!data?.id) {
      return NextResponse.json(
        { error: 'Failed to submit referral', details: 'No submission id returned' },
        { status: 500 }
      );
    }

    // Award 10 points for any submission by an authenticated user (ensure row exists)
    const POINTS_PER_SUBMISSION = 10;
    if (user?.id) {
      try {
        const { data: currentPointsRow } = await supabase
          .from('partner_users')
          .select('points')
          .eq('user_id', user.id)
          .maybeSingle();

        const currentPoints = currentPointsRow?.points ?? 0;
        await supabase
          .from('partner_users')
          .upsert({ user_id: user.id, points: currentPoints + POINTS_PER_SUBMISSION }, { onConflict: 'user_id' });
      } catch (pointsErr) {
        console.error('Points award failed (submission still saved):', pointsErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: is_accounted 
          ? `Referral submitted! Status set to pending. ${POINTS_PER_SUBMISSION} points awarded.` 
          : 'Referral submitted successfully! Status set to pending.',
        submission_id: data.id,
        is_accounted,
        quality_score,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Server error:', error);
    const err = error as any;
    return NextResponse.json(
      { error: 'Internal server error', details: err?.message, stack: err?.stack },
      { status: 500 }
    );
  }
}

