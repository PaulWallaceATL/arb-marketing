import { NextRequest, NextResponse } from 'next/server';
import { supabase, isAdmin } from '@/lib/supabase/client';

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

    // Check if user is admin
    const userIsAdmin = await isAdmin(user.id);
    
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
      supabase
        .from('referral_submissions')
        .select('id', { count: 'exact', head: true }),
      
      // New submissions (last 7 days)
      supabase
        .from('referral_submissions')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
      
      // Converted submissions
      supabase
        .from('referral_submissions')
        .select('id, conversion_value', { count: 'exact' })
        .eq('status', 'converted'),
      
      // Active partners
      supabase
        .from('channel_partners')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'active'),
      
      // Recent submissions (last 10)
      supabase
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
      supabase
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
    const { data: submissionsByStatus } = await supabase
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

