import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  try {
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

    // Get user session if exists (but don't require it)
    const { data: { user } } = await supabase.auth.getUser();
    
    // Determine if this is an accounted referral (logged in partner)
    const is_accounted = !!user;
    
    // Get IP address and user agent for tracking
    const ip_address = request.headers.get('x-forwarded-for') || 
                       request.headers.get('x-real-ip') || 
                       'unknown';
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
    const { data, error } = await supabase
      .from('referral_submissions')
      .insert({
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
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to submit referral' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: is_accounted 
        ? 'Referral submitted and points awarded! Check your dashboard.' 
        : 'Referral submitted successfully!',
      submission_id: data.id,
      is_accounted,
      quality_score,
    });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

