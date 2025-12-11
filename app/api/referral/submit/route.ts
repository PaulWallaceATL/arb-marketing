import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';

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

    const body = await request.json();
    
    const {
      referral_code,
      referrer_name,
      referrer_email,
      referrer_phone,
      lead_name,
      lead_email,
      lead_phone,
      lead_message,
      utm_source,
      utm_medium,
      utm_campaign,
    } = body;

    // Validate required fields
    if (!lead_name || !lead_email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Get user session using server client with request/response cookies
    let user = null;
    try {
      const supabaseAnon = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set() {
            // no-op on server read flow
          },
          remove() {
            // no-op on server read flow
          },
        },
      });
      const {
        data: { user: u },
      } = await supabaseAnon.auth.getUser();
      user = u;
    } catch (err) {
      user = null;
    }
    
    // Determine if this is an accounted referral (logged in partner)
    const is_accounted = !!user;
    
    // Get IP address and user agent for tracking
    const ip_header = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip');
    const ip_address = ip_header && ip_header !== 'unknown' ? ip_header : null;
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
    const combined_message = [
      lead_message || '',
      referrer_name || referrer_email || referrer_phone
        ? `\n\nReferrer Details:\n${referrer_name ? `Name: ${referrer_name}` : ''}${referrer_email ? `\nEmail: ${referrer_email}` : ''}${referrer_phone ? `\nPhone: ${referrer_phone}` : ''}`
        : '',
    ].join('');

    // Calculate a simple quality score
    let quality_score = 0;
    if (lead_phone) quality_score += 20;
    if (referrer_email) quality_score += 10;
    if (referrer_phone) quality_score += 10;
    if (combined_message && combined_message.length > 40) quality_score += 20;

    // Insert referral submission
    const baseRecord = {
        partner_id,
        referral_code: referral_code || null,
        lead_name,
        lead_email,
        lead_phone: lead_phone || null,
      lead_company: null,
      lead_job_title: null,
      lead_industry: null,
      lead_company_size: null,
      lead_budget_range: null,
      lead_timeline: null,
      lead_pain_points: null,
      lead_linkedin_url: null,
      lead_message: combined_message || null,
        submission_source: 'web_form',
        ip_address,
        user_agent,
        utm_source: utm_source || null,
        utm_medium: utm_medium || null,
        utm_campaign: utm_campaign || null,
        submitted_by_user_id: user?.id || null,
        is_authenticated: !!user,
        is_accounted,
        quality_score,
        status: 'new',
    };

    const insertAttempt = async (record: any) => {
      return supabase!.from('referral_submissions').insert(record).select().single();
    };

    let { data, error } = await insertAttempt(baseRecord);

    // Fallback if schema migrations not applied (missing columns)
    if (error && error.message && error.message.includes('column')) {
      const fallbackRecord = {
        partner_id: baseRecord.partner_id,
        referral_code: baseRecord.referral_code,
        lead_name: baseRecord.lead_name,
        lead_email: baseRecord.lead_email,
        lead_phone: baseRecord.lead_phone,
        lead_message: baseRecord.lead_message,
        submission_source: baseRecord.submission_source,
        ip_address: baseRecord.ip_address,
        user_agent: baseRecord.user_agent,
        utm_source: baseRecord.utm_source,
        utm_medium: baseRecord.utm_medium,
        utm_campaign: baseRecord.utm_campaign,
        submitted_by_user_id: baseRecord.submitted_by_user_id,
        is_authenticated: baseRecord.is_authenticated,
        status: 'new',
      };
      const fallback = await insertAttempt(fallbackRecord);
      data = fallback.data;
      error = fallback.error;
    }

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { error: 'Failed to submit referral', details: error.message, code: error.code, hint: error.hint, raw: error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: is_accounted
          ? 'Referral submitted and points awarded! Check your dashboard.'
          : 'Referral submitted successfully!',
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

