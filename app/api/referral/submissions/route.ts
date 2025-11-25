import { NextRequest, NextResponse } from 'next/server';
import { supabase, getUserRole } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
  try {
    // Get user session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user role
    const role = await getUserRole(user.id);
    
    if (!role) {
      return NextResponse.json(
        { error: 'User role not found' },
        { status: 403 }
      );
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('referral_submissions')
      .select(`
        *,
        channel_partners (
          company_name,
          contact_name,
          referral_code
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Filter by status if provided
    if (status) {
      query = query.eq('status', status);
    }

    // If not admin, only show submissions for their partner account
    if (role !== 'admin') {
      // Get partner_id for this user
      const { data: partnerUser } = await supabase
        .from('partner_users')
        .select('partner_id')
        .eq('user_id', user.id)
        .single();
      
      if (partnerUser?.partner_id) {
        query = query.eq('partner_id', partnerUser.partner_id);
      } else {
        // User is not associated with a partner
        return NextResponse.json({ data: [], count: 0 });
      }
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch submissions' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data,
      count,
      limit,
      offset,
    });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

