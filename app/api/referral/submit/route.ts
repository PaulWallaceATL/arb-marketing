import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      referral_code,
      lead_name,
      lead_email,
      lead_phone,
      lead_company,
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
    
    // Get IP address and user agent for tracking
    const ip_address = request.headers.get('x-forwarded-for') || 
                       request.headers.get('x-real-ip') || 
                       'unknown';
    const user_agent = request.headers.get('user-agent') || 'unknown';

    // Find partner by referral code (if provided)
    let partner_id = null;
    if (referral_code) {
      const { data: partner } = await supabase
        .from('channel_partners')
        .select('id')
        .eq('referral_code', referral_code)
        .eq('status', 'active')
        .single();
      
      partner_id = partner?.id || null;
    }

    // Insert referral submission
    const { data, error } = await supabase
      .from('referral_submissions')
      .insert({
        partner_id,
        referral_code: referral_code || null,
        lead_name,
        lead_email,
        lead_phone: lead_phone || null,
        lead_company: lead_company || null,
        lead_message: lead_message || null,
        submission_source: 'web_form',
        ip_address,
        user_agent,
        utm_source: utm_source || null,
        utm_medium: utm_medium || null,
        utm_campaign: utm_campaign || null,
        submitted_by_user_id: user?.id || null,
        is_authenticated: !!user,
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
      message: 'Referral submitted successfully',
      submission_id: data.id,
    });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

