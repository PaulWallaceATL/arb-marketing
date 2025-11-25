# Environment Variables Template

Copy this file to `.env.local` and fill in your values.

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: Service Role Key (Server-side only - NEVER expose to client)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Analytics (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Email Configuration (Optional - for contact forms)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@arbmarketing.com

# Rate Limiting Configuration
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000

# Security
NEXTAUTH_SECRET=generate-a-secure-random-string-here
NEXTAUTH_URL=http://localhost:3000

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_DARK_MODE=true
NEXT_PUBLIC_ENABLE_REFERRAL_SYSTEM=true
NEXT_PUBLIC_ENABLE_COMPETITIONS=true

# Competition Configuration
NEXT_PUBLIC_COMPETITION_ACTIVE=true
NEXT_PUBLIC_COMPETITION_END_DATE=2025-12-31
```

## How to Generate Secrets

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32
```

