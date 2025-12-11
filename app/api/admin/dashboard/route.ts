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

export async function GET(request: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseAnonKey || !supabaseService) {
      return NextResponse.json(
        { error: 'Supabase not configured', details: 'Missing NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, or SUPABASE_SERVICE_ROLE_KEY' },
        { status: 500 }
      );
    }

    // Auth via bearer token (preferred) or auth cookie fallback
    const authHeader = request.headers.get('authorization');
    const bearerToken = authHeader?.toLowerCase().startsWith('bearer ')
      ? authHeader.slice(7)
      : null;
    const cookieTokens = request.cookies.getAll().filter((c) => c.name.includes('sb-') && c.name.includes('-auth-token'));
    const cookieToken = cookieTokens[0]?.value;

    const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const {
      data: { user },
      error: authError,
    } = await supabaseAnon.auth.getUser(bearerToken || cookieToken);
    
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

    // Fetch dashboard statistics
    const [
      { count: totalSubmissions },
      { count: newSubmissions },
      { data: convertedSubmissions },
      { count: activePartners },
      { data: recentSubmissions },
      { data: partnerPerformance },
    ] = await Promise.all([
      // Total submissions
      supabaseService
        .from('referral_submissions')
        .select('id', { count: 'exact', head: true }),
      
      // New submissions (last 7 days)
      supabaseService
        .from('referral_submissions')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
      
      // Converted submissions
      supabaseService
        .from('referral_submissions')
        .select('id, conversion_value', { count: 'exact' })
        .eq('status', 'converted'),
      
      // Active partners
      supabaseService
        .from('channel_partners')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'active'),
      
      // Recent submissions (last 10)
      supabaseService
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
        .limit(10),
      
      // Partner performance
      supabaseService
        .from('partner_performance')
        .select('*')
        .eq('status', 'active')
        .order('total_revenue', { ascending: false })
        .limit(10),
    ]);

    // Calculate total revenue
    const totalRevenue = convertedSubmissions?.reduce(
      (sum, sub: any) => sum + (parseFloat(sub.conversion_value) || 0),
      0
    ) || 0;

    // Get submissions by status
    const { data: submissionsByStatus } = await supabaseService
      .from('referral_submissions')
      .select('status');

    const statusCounts = submissionsByStatus?.reduce((acc: any, sub: any) => {
      acc[sub.status] = (acc[sub.status] || 0) + 1;
      return acc;
    }, {}) || {};

    const totalCount = totalSubmissions || 0;
    const convertedCount = convertedSubmissions?.length || 0;
    
    return NextResponse.json({
      summary: {
        totalSubmissions: totalCount,
        newSubmissions: newSubmissions || 0,
        convertedSubmissions: convertedCount,
        activePartners: activePartners || 0,
        totalRevenue: totalRevenue.toFixed(2),
        conversionRate: totalCount > 0
          ? ((convertedCount / totalCount) * 100).toFixed(2)
          : '0.00',
      },
      statusCounts,
      recentSubmissions,
      partnerPerformance,
    });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

