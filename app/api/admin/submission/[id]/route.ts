import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
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
        { error: 'Supabase not configured', details: 'Missing NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, or SUPABASE_SERVICE_ROLE_KEY' },
        { status: 500 }
      );
    }

    // Await params in Next.js 16+
    const { id } = await params;
    
    // Get user session
    const hdrs = await headers();
    const cookieHeader = hdrs.get('cookie') || '';
    const supabaseAnon = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          const match = cookieHeader
            .split(';')
            .map((c) => c.trim())
            .find((c) => c.startsWith(`${name}=`));
          return match ? match.split('=')[1] : null;
        },
        set() {},
        remove() {},
      },
    });
    const {
      data: { user },
      error: authError,
    } = await supabaseAnon.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
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
    const { status, admin_notes, conversion_value } = body;

    // Build update object
    const updateData: any = {};
    
    if (status) {
      updateData.status = status;
      
      // Set timestamps based on status
      if (status === 'contacted' && !updateData.contacted_at) {
        updateData.contacted_at = new Date().toISOString();
      }
      if (status === 'converted' && !updateData.converted_at) {
        updateData.converted_at = new Date().toISOString();
      }
    }
    
    if (admin_notes !== undefined) {
      updateData.admin_notes = admin_notes;
    }
    
    if (conversion_value !== undefined) {
      updateData.conversion_value = conversion_value;
    }

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
        { error: 'Failed to update submission' },
        { status: 500 }
      );
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
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
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
    
    // Get user session
    const hdrs = await headers();
    const cookieHeader = hdrs.get('cookie') || '';
    const supabaseAnon = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          const match = cookieHeader
            .split(';')
            .map((c) => c.trim())
            .find((c) => c.startsWith(`${name}=`));
          return match ? match.split('=')[1] : null;
        },
        set() {},
        remove() {},
      },
    });
    const {
      data: { user },
      error: authError,
    } = await supabaseAnon.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
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
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

