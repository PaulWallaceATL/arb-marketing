import { createClient } from '@supabase/supabase-js';

// Supabase client for client-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Types for our database
export interface ChannelPartner {
  id: string;
  email: string;
  company_name: string;
  contact_name: string;
  phone?: string;
  website?: string;
  status: 'pending' | 'active' | 'inactive' | 'rejected';
  referral_code: string;
  created_at: string;
  updated_at: string;
  approved_at?: string;
  approved_by?: string;
  commission_rate: number;
  total_referrals: number;
  total_conversions: number;
  total_revenue: number;
}

export interface ReferralSubmission {
  id: string;
  partner_id?: string;
  referral_code?: string;
  lead_email: string;
  lead_name: string;
  lead_phone?: string;
  lead_company?: string;
  lead_message?: string;
  submission_source: string;
  ip_address?: string;
  user_agent?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost' | 'spam';
  conversion_value?: number;
  submitted_by_user_id?: string;
  is_authenticated: boolean;
  created_at: string;
  updated_at: string;
  contacted_at?: string;
  converted_at?: string;
  admin_notes?: string;
}

export interface PartnerUser {
  id: string;
  user_id: string;
  partner_id?: string;
  role: 'admin' | 'partner' | 'viewer';
  created_at: string;
  last_login_at: string;
}

export interface ActivityLog {
  id: string;
  user_id?: string;
  partner_id?: string;
  action: string;
  entity_type?: string;
  entity_id?: string;
  details?: Record<string, any>;
  ip_address?: string;
  created_at: string;
}

// Helper functions
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

export async function getUserRole(userId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('partner_users')
    .select('role')
    .eq('user_id', userId)
    .single();
  
  if (error) return null;
  return data?.role || null;
}

export async function isAdmin(userId: string): Promise<boolean> {
  const role = await getUserRole(userId);
  return role === 'admin';
}

export async function logActivity(
  action: string,
  details?: Record<string, any>,
  entityType?: string,
  entityId?: string
) {
  try {
    const user = await getCurrentUser();
    
    await supabase.from('activity_log').insert({
      user_id: user?.id,
      action,
      entity_type: entityType,
      entity_id: entityId,
      details,
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
}

export default supabase;

