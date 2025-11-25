// =====================================================
// GLOBAL TYPE DEFINITIONS
// =====================================================

import { z } from 'zod';

// =====================================================
// DATABASE TYPES
// =====================================================

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
  lead_job_title?: string;
  lead_industry?: string;
  lead_company_size?: string;
  lead_budget_range?: string;
  lead_timeline?: string;
  lead_pain_points?: string;
  lead_linkedin_url?: string;
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
  is_accounted: boolean;
  quality_score?: number;
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

export interface Competition {
  id: string;
  title: string;
  description?: string;
  prize_description?: string;
  prize_value?: number;
  start_date: string;
  end_date: string;
  status: 'upcoming' | 'active' | 'ended' | 'cancelled';
  rules?: Record<string, any>;
  winner_id?: string;
  created_at: string;
  updated_at: string;
}

export interface PartnerPoints {
  id: string;
  partner_id: string;
  points: number;
  reason: string;
  submission_id?: string;
  competition_id?: string;
  created_at: string;
}

// =====================================================
// ZOD VALIDATION SCHEMAS
// =====================================================

export const referralSubmissionSchema = z.object({
  // Required fields
  lead_name: z.string().min(2, 'Name must be at least 2 characters').max(255),
  lead_email: z.string().email('Invalid email address'),
  lead_company: z.string().min(2, 'Company name must be at least 2 characters').max(255),
  
  // Optional contact fields
  lead_phone: z.string().optional(),
  lead_linkedin_url: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  
  // Optional company fields
  lead_job_title: z.string().max(255).optional(),
  lead_industry: z.string().max(100).optional(),
  lead_company_size: z.string().max(50).optional(),
  
  // Optional project fields
  lead_budget_range: z.string().max(50).optional(),
  lead_timeline: z.string().max(50).optional(),
  lead_pain_points: z.string().max(2000).optional(),
  lead_message: z.string().max(2000).optional(),
  
  // Tracking fields
  referral_code: z.string().optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
});

export type ReferralSubmissionInput = z.infer<typeof referralSubmissionSchema>;

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(255),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;

export const partnerApplicationSchema = z.object({
  email: z.string().email('Invalid email address'),
  company_name: z.string().min(2, 'Company name is required').max(255),
  contact_name: z.string().min(2, 'Contact name is required').max(255),
  phone: z.string().optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
});

export type PartnerApplicationInput = z.infer<typeof partnerApplicationSchema>;

// =====================================================
// API RESPONSE TYPES
// =====================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DashboardStats {
  totalSubmissions: number;
  newSubmissions: number;
  qualifiedLeads: number;
  convertedLeads: number;
  conversionRate: number;
  totalRevenue: number;
  activePartners: number;
  topPartners: Array<{
    id: string;
    company_name: string;
    total_referrals: number;
    total_conversions: number;
    conversion_rate: number;
  }>;
  statusBreakdown: Record<string, number>;
}

// =====================================================
// UI COMPONENT TYPES
// =====================================================

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
}

export interface FormState<T = any> {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
  isSuccess: boolean;
  message?: string;
}

// =====================================================
// UTILITY TYPES
// =====================================================

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

// =====================================================
// CONSTANTS
// =====================================================

export const REFERRAL_STATUS = {
  NEW: 'new',
  CONTACTED: 'contacted',
  QUALIFIED: 'qualified',
  CONVERTED: 'converted',
  LOST: 'lost',
  SPAM: 'spam',
} as const;

export const PARTNER_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  REJECTED: 'rejected',
} as const;

export const USER_ROLE = {
  ADMIN: 'admin',
  PARTNER: 'partner',
  VIEWER: 'viewer',
} as const;

export const COMPETITION_STATUS = {
  UPCOMING: 'upcoming',
  ACTIVE: 'active',
  ENDED: 'ended',
  CANCELLED: 'cancelled',
} as const;

