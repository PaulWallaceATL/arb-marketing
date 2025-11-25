# Supabase Referral System Setup Guide

## Prerequisites
1. A Supabase account (sign up at https://supabase.com)
2. Node.js and npm installed
3. A subdomain configured for your referral portal

## Step 1: Create Supabase Project

1. Go to https://app.supabase.com
2. Click "New Project"
3. Fill in:
   - Project Name: "ARB Referral System" (or your choice)
   - Database Password: (choose a strong password)
   - Region: (choose closest to your users)
4. Wait for project to be provisioned (~2 minutes)

## Step 2: Run SQL Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase/schema.sql`
4. Paste into the SQL Editor
5. Click "Run" or press `Cmd/Ctrl + Enter`
6. Verify: You should see "Success. No rows returned"

## Step 3: Get API Keys

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **Anon/Public Key**: `eyJhbGc...` (starts with eyJ)
   - **Service Role Key**: `eyJhbGc...` (KEEP THIS SECRET!)

## Step 4: Configure Environment Variables

Create a `.env.local` file in your project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: For server-side admin operations only
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_REFERRAL_SUBDOMAIN_URL=https://partners.yourdomain.com
```

## Step 5: Install Dependencies

```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
```

## Step 6: Create Admin User

1. In Supabase dashboard, go to **Authentication** → **Users**
2. Click "Add User"
3. Fill in:
   - Email: your-admin-email@example.com
   - Password: (choose a strong password)
   - Email Confirm: Toggle ON (to auto-confirm)
4. Click "Create User"
5. Copy the User ID (UUID)

## Step 7: Make User an Admin

1. Go back to **SQL Editor**
2. Run this query (replace `your-user-id` with the UUID from step 6):

```sql
INSERT INTO public.partner_users (user_id, role)
VALUES ('your-user-id-here', 'admin');
```

## Step 8: Configure Authentication Settings

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider (should be enabled by default)
3. Go to **Authentication** → **URL Configuration**
4. Add your site URL:
   - Site URL: `http://localhost:3000` (for development)
   - Add production URLs when deploying
5. Add redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `https://partners.yourdomain.com/auth/callback`

## Step 9: Test the Setup

1. Start your development server:
```bash
npm run dev
```

2. Navigate to: `http://localhost:3000/partners` (referral form)
3. Try submitting a referral without logging in
4. Check Supabase dashboard → **Table Editor** → `referral_submissions`
5. You should see your submission!

## Step 10: Configure Subdomain (Production)

### Option A: Vercel Deployment

1. Deploy to Vercel
2. In Vercel dashboard, go to your project
3. Go to **Settings** → **Domains**
4. Add your subdomain: `partners.yourdomain.com`
5. Update your DNS records as instructed by Vercel

### Option B: Custom Server

1. Configure your DNS to point subdomain to your server
2. Set up SSL certificate (use Let's Encrypt)
3. Configure reverse proxy (nginx/Apache)

## Database Tables Overview

### `channel_partners`
Stores channel partner information and referral codes

### `referral_submissions`
Stores all referral form submissions (authenticated or not)

### `partner_users`
Links Supabase Auth users to partners and roles

### `activity_log`
Tracks all system activities for audit purposes

## Security Features

- **Row Level Security (RLS)**: Enabled on all tables
- **Role-based Access**: Admin, Partner, and Viewer roles
- **Public Submissions**: Anyone can submit referrals (no auth required)
- **Protected Views**: Only authenticated users can view dashboards

## API Endpoints Created

- `POST /api/referral/submit` - Submit a referral (public)
- `GET /api/referral/submissions` - Get submissions (authenticated)
- `GET /api/admin/dashboard` - Admin dashboard data (admin only)
- `PATCH /api/admin/submission/:id` - Update submission status (admin only)

## Testing the System

### Test Referral Submission (No Auth)
```bash
curl -X POST http://localhost:3000/api/referral/submit \
  -H "Content-Type: application/json" \
  -d '{
    "referral_code": "REF123456",
    "lead_name": "John Doe",
    "lead_email": "john@example.com",
    "lead_phone": "+1-555-0123",
    "lead_company": "Test Corp",
    "lead_message": "Interested in your services"
  }'
```

## Troubleshooting

### Issue: "Failed to fetch"
- Check that your Supabase URL and keys are correct in `.env.local`
- Restart your Next.js dev server after adding env variables

### Issue: "Row Level Security Policy violation"
- Verify RLS policies were created correctly
- Check that your admin user is in the `partner_users` table

### Issue: Can't login
- Verify email confirmation is enabled in Supabase Auth settings
- Check that redirect URLs are configured correctly

## Next Steps

1. Customize the referral form fields
2. Set up email notifications for new submissions
3. Configure commission tracking
4. Add partner dashboard features
5. Set up analytics and reporting

## Support

For issues, check:
- Supabase documentation: https://supabase.com/docs
- Next.js documentation: https://nextjs.org/docs
- Project repository issues

