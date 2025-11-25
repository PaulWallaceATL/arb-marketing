# Referral Partner System - Implementation Guide

## 📋 Overview

This guide will help you implement the complete referral partner system with Supabase backend. The system includes:

- ✅ Referral form that works with or without authentication
- ✅ Login/signup functionality
- ✅ Admin dashboard for managing submissions
- ✅ SQL schema with Row Level Security (RLS)
- ✅ API routes for all operations
- ✅ Partner tracking and performance metrics

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
```

### 2. Set Up Supabase

1. Create a Supabase account at https://supabase.com
2. Create a new project
3. Run the SQL schema from `supabase/schema.sql` in the SQL Editor
4. Get your API keys from Settings → API

### 3. Configure Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Create Your First Admin User

1. In Supabase Dashboard → Authentication → Users
2. Click "Add User" (use your email)
3. Copy the User ID
4. Run in SQL Editor:

```sql
INSERT INTO public.partner_users (user_id, role)
VALUES ('your-user-id', 'admin');
```

### 5. Start Development Server

```bash
npm run dev
```

Visit:
- Referral Form: http://localhost:3000/partners
- Login: http://localhost:3000/partners/login
- Dashboard: http://localhost:3000/partners/dashboard

## 📁 File Structure

```
/app
  /api
    /referral
      /submit/route.ts          # Public API for form submissions
      /submissions/route.ts      # Get submissions (authenticated)
    /admin
      /dashboard/route.ts        # Admin dashboard data
      /submission/[id]/route.ts  # Update submission status
  /auth
    /callback/route.ts          # Auth callback handler
  /partners
    page.tsx                    # Main referral form page
    /login/page.tsx             # Login/signup page
    /dashboard/page.tsx         # Dashboard (admin/partner)

/components
  /auth
    LoginForm.tsx               # Login/signup component
  /referral
    ReferralForm.tsx            # Referral submission form
  /admin
    AdminDashboard.tsx          # Admin dashboard UI

/lib
  /supabase
    client.ts                   # Supabase client & helpers

/supabase
  schema.sql                    # Database schema & policies
```

## 🔑 Key Features

### Referral Form (No Auth Required)

The referral form at `/partners` accepts submissions from anyone:

- Works with or without authentication
- Captures referral code from URL: `/partners?ref=REF123456`
- Stores submission immediately
- Prompts user to login after successful submission
- Tracks UTM parameters automatically

### Authentication Flow

1. User submits referral (no auth required)
2. After submission, prompted to create account
3. Login/signup at `/partners/login`
4. Redirects to dashboard after authentication

### Admin Dashboard

Accessible at `/partners/dashboard` for admin users:

- View all submissions
- Update submission status
- Track partner performance
- View conversion metrics
- Manage leads through pipeline

### Database Tables

1. **channel_partners** - Partner company information
2. **referral_submissions** - All referral form submissions
3. **partner_users** - Maps Supabase Auth users to roles
4. **activity_log** - Audit trail of all actions

## 🎯 Usage Examples

### Basic Referral Link

```
https://partners.yourdomain.com?ref=REF123456
```

### With UTM Tracking

```
https://partners.yourdomain.com?ref=REF123456&utm_source=email&utm_medium=newsletter&utm_campaign=q4_promo
```

## 🔒 Security Features

- **Row Level Security (RLS)** enabled on all tables
- **Public submission** - anyone can submit referrals
- **Protected views** - only authenticated users see dashboards
- **Role-based access** - admin, partner, viewer roles
- **Audit logging** - all actions tracked

## 📊 Admin Dashboard Features

### Summary Statistics
- Total submissions
- New submissions (last 7 days)
- Conversion rate
- Total revenue
- Active partners

### Submission Management
- View all referrals
- Update status: new → contacted → qualified → converted
- Add admin notes
- Track conversion value
- Filter by status

### Partner Performance
- Top performing partners
- Conversion rates
- Revenue by partner
- Referral counts

## 🌐 Subdomain Setup

### For Vercel Deployment

1. Deploy to Vercel
2. Go to Project Settings → Domains
3. Add subdomain: `partners.yourdomain.com`
4. Update DNS records as instructed
5. Update Supabase redirect URLs

### Custom Server Setup

1. Configure DNS A/CNAME record
2. Set up SSL certificate
3. Configure reverse proxy
4. Update environment variables

## 🔧 Customization

### Adding Custom Fields

Edit `components/referral/ReferralForm.tsx`:

```tsx
<div className="form-group">
  <label htmlFor="custom_field">Custom Field</label>
  <input
    type="text"
    id="custom_field"
    name="custom_field"
    value={formData.custom_field}
    onChange={handleChange}
  />
</div>
```

Update API route and database schema accordingly.

### Styling

All components use scoped CSS-in-JS. Customize colors and styles directly in the component files:

```tsx
<style jsx>{`
  .form-input {
    border-color: #your-brand-color;
  }
`}</style>
```

### Email Notifications

Add email notifications using Supabase Edge Functions or integrate with services like SendGrid, Resend, or Mailgun.

## 🐛 Troubleshooting

### "Unauthorized" errors
- Check environment variables are set correctly
- Verify Supabase URL and keys
- Ensure RLS policies are created

### Can't see submissions
- Verify user has admin role in `partner_users` table
- Check RLS policies allow access
- Clear browser cache and cookies

### Form submission fails
- Check browser console for errors
- Verify API route is accessible
- Check Supabase connection

### Login redirects not working
- Verify redirect URLs in Supabase Auth settings
- Check callback route is created
- Ensure NEXT_PUBLIC_APP_URL is set

## 📈 Next Steps

1. **Email Notifications** - Notify on new submissions
2. **Partner Portal** - Individual partner dashboards
3. **Analytics** - Advanced tracking and reporting
4. **Commission Tracking** - Automated commission calculations
5. **Webhooks** - Integration with CRM/payment systems

## 🤝 Support

For issues or questions:
1. Check the SUPABASE_SETUP.md guide
2. Review Supabase documentation
3. Check Next.js documentation
4. Review the code comments

## 📝 Important Notes

- **Form submissions work without login** - This is by design
- **All submissions stored** - Even from unauthenticated users
- **Login optional** - Users can submit and login later
- **Referral codes persist** - Stored in session storage
- **RLS protects data** - Only authorized users see sensitive data

## 🎉 Deployment Checklist

Before deploying to production:

- [ ] Update environment variables
- [ ] Configure Supabase Auth redirect URLs
- [ ] Set up subdomain DNS records
- [ ] Configure SSL certificate
- [ ] Test referral submission (no auth)
- [ ] Test login/signup flow
- [ ] Verify admin dashboard access
- [ ] Test email confirmation
- [ ] Set up monitoring/logging
- [ ] Configure CORS if needed

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [SQL Schema Reference](./supabase/schema.sql)
- [Setup Guide](./SUPABASE_SETUP.md)

