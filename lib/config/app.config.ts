// =====================================================
// APPLICATION CONFIGURATION
// =====================================================

/**
 * Application-wide configuration
 * Centralized place for all app settings
 */

export const appConfig = {
  // Application Info
  name: 'ARB Marketing',
  description: 'Elite leads. Winning cases. Elevating your practice.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://arbmarketing.com',
  
  // Contact Information
  contact: {
    email: 'info@arbmarketing.com',
    phone: '+1-555-0123',
    address: '123 Main St, Suite 100, City, State 12345',
  },

  // Social Media Links
  social: {
    linkedin: 'https://linkedin.com/company/arb-marketing',
    twitter: 'https://twitter.com/arbmarketing',
    facebook: 'https://facebook.com/arbmarketing',
    instagram: 'https://instagram.com/arbmarketing',
  },

  // Feature Flags
  features: {
    analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    darkMode: process.env.NEXT_PUBLIC_ENABLE_DARK_MODE === 'true',
    referralSystem: process.env.NEXT_PUBLIC_ENABLE_REFERRAL_SYSTEM === 'true',
    competitions: process.env.NEXT_PUBLIC_ENABLE_COMPETITIONS === 'true',
  },

  // Points System
  points: {
    newSubmission: 10,
    qualifiedLead: 25,
    convertedLead: 100,
  },

  // Quality Score Weights
  qualityScore: {
    phone: 10,
    jobTitle: 10,
    industry: 10,
    companySize: 10,
    budgetRange: 15,
    timeline: 10,
    painPoints: 20,
    linkedinUrl: 15,
  },

  // Pricing Plans
  pricing: [
    {
      id: 'starter',
      name: 'Starter Package',
      price: 2500,
      period: 'month',
      features: [
        'Monthly content calendars',
        '5 reel/content deliverables',
        'Strategic content planning',
        'Social media optimization',
        'Performance tracking',
      ],
    },
    {
      id: 'growth',
      name: 'Growth Package',
      price: 5000,
      period: 'month',
      features: [
        'Full social media management',
        '7-10 reels/content delivered',
        'Professional editing & planning',
        'Strategic marketing consulting',
        'ROI optimization strategies',
      ],
    },
    {
      id: 'custom',
      name: 'Custom Campaign',
      price: null,
      period: 'consultation',
      features: [
        'Free initial consultation',
        'Content series production',
        'Photo/video shoots',
        'TV & streaming commercials',
        'Radio & multi-channel ads',
      ],
    },
  ],

  // Rate Limiting
  rateLimit: {
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  },

  // API Configuration
  api: {
    timeout: 10000, // 10 seconds
    retries: 3,
  },

  // Form Configuration
  forms: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  },

  // Pagination
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
  },

  // Validation
  validation: {
    minPasswordLength: 8,
    maxMessageLength: 2000,
    maxNotesLength: 5000,
  },

  // Navigation
  navigation: [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Contact', href: '/contact' },
    { label: 'FAQ', href: '/faq' },
  ],

  // Footer Navigation
  footerNavigation: {
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Services', href: '/services' },
      { label: 'Contact', href: '/contact' },
      { label: 'FAQ', href: '/faq' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
    ],
    partners: [
      { label: 'Partner Login', href: '/partners/login' },
      { label: 'Partner Dashboard', href: '/partners/dashboard' },
      { label: 'Become a Partner', href: '/partners' },
    ],
  },

  // SEO Keywords
  seoKeywords: [
    'legal marketing',
    'personal injury leads',
    'law firm marketing',
    'attorney referrals',
    'case referrals',
    'legal lead generation',
    'PI attorney marketing',
    'qualified injury leads',
  ],

  // Competition Configuration
  competition: {
    active: process.env.NEXT_PUBLIC_COMPETITION_ACTIVE === 'true',
    endDate: process.env.NEXT_PUBLIC_COMPETITION_END_DATE,
  },
};

/**
 * Get configuration value with type safety
 */
export function getConfig<K extends keyof typeof appConfig>(key: K): typeof appConfig[K] {
  return appConfig[key];
}

/**
 * Check if feature is enabled
 */
export function isFeatureEnabled(feature: keyof typeof appConfig.features): boolean {
  return appConfig.features[feature];
}

/**
 * Get points for action
 */
export function getPoints(action: keyof typeof appConfig.points): number {
  return appConfig.points[action];
}

/**
 * Export type for configuration
 */
export type AppConfig = typeof appConfig;

