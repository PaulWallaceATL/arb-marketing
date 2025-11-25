# 🤝 Referral Channel Partner System

A complete, production-ready referral partner system built with Next.js and Supabase. This system allows you to track referrals, manage partner relationships, and monitor conversions - all with a subdomain-ready architecture.

## ✨ Key Features

### 🎯 Core Functionality
- **Anonymous Referral Submissions** - Users can submit referrals without creating an account
- **Optional Authentication** - After submitting, users are prompted (but not required) to log in
- **Admin Dashboard** - Comprehensive dashboard for managing all referrals
- **Partner Tracking** - Track performance, conversions, and revenue by partner
- **Role-Based Access** - Admin, Partner, and Viewer roles with appropriate permissions

### 🔒 Security
- Row Level Security (RLS) enabled on all tables
- Secure API routes with authentication checks
- Role-based data access policies
- Activity logging for audit trails

### 📊 Analytics
- Real-time submission tracking
- Conversion rate calculations
- Revenue tracking per partner
- Status pipeline management (New → Contacted → Qualified → Converted)

## 🚀 Quick Setup (5 Minutes)

### Step 1: Install Dependencies
```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
```

### Step 2: Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for provisioning (~2 minutes)

### Step 3: Run Database Schema
1. Open Supabase Dashboard → SQL Editor
2. Copy all contents from `supabase/schema.sql`
3. Paste and run in SQL Editor

### Step 4: Configure Environment
Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Step 5: Create Admin User
In Supabase Dashboard → Authentication → Users:
1. Add a user with your email
2. Copy the User ID
3. Run in SQL Editor:
```sql
INSERT INTO public.partner_users (user_id, role)
VALUES ('your-user-id', 'admin');
```

### Step 6: Start Development
```bash
npm run dev
```

Visit http://localhost:3000/partners to see your referral form!

## 📱 Pages & Routes

### Public Pages
- **`/partners`** - Referral submission form (no auth required)
- **`/partners/login`** - Login/Signup page

### Protected Pages
- **`/partners/dashboard`** - Admin/Partner dashboard (requires auth)

### API Routes
- **`POST /api/referral/submit`** - Submit referral (public)
- **`GET /api/referral/submissions`** - Get submissions (authenticated)
- **`GET /api/admin/dashboard`** - Dashboard stats (admin only)
- **`PATCH /api/admin/submission/[id]`** - Update submission (admin only)

## 🎨 How It Works

### User Journey (No Login Required)

1. **User arrives** at `/partners?ref=REF123456`
2. **Fills out form** with lead information
3. **Submits immediately** - stored in database
4. **Sees success message** with optional login prompt
5. **Can continue** browsing or create account later

### Admin Journey

1. **Admin logs in** at `/partners/login`
2. **Views dashboard** at `/partners/dashboard`
3. **Sees all submissions** with status pipeline
4. **Updates status** as leads progress
5. **Tracks conversions** and revenue

### The Smart Part ✨

**The form works whether the user is logged in or not!**
- Unauthenticated submissions are still captured
- Referral code is tracked in both cases
- User can log in later to track their referrals
- Admins see all submissions regardless of auth status

## 📊 Database Schema

### Tables

**`channel_partners`** - Partner companies
```sql
- id, email, company_name, contact_name
- referral_code (unique)
- status (pending, active, inactive)
- commission_rate, total_referrals, total_conversions
```

**`referral_submissions`** - All form submissions
```sql
- id, partner_id, referral_code
- lead_name, lead_email, lead_phone, lead_company, lead_message
- status (new, contacted, qualified, converted, lost, spam)
- is_authenticated, submitted_by_user_id
- utm_source, utm_medium, utm_campaign
```

**`partner_users`** - User roles
```sql
- id, user_id, partner_id
- role (admin, partner, viewer)
```

**`activity_log`** - Audit trail
```sql
- id, user_id, action, entity_type, details
```

## 🔧 Configuration

### Referral Codes

Referral codes are automatically generated when creating partners:
```sql
SELECT generate_referral_code(); -- Returns: REF123456
```

Use in URLs:
```
https://partners.yourdomain.com?ref=REF123456
```

### UTM Tracking

Automatically captured from URL parameters:
```
?ref=REF123456&utm_source=email&utm_medium=newsletter
```

### Status Pipeline

Submissions flow through these statuses:
1. **new** - Just submitted
2. **contacted** - Reached out to lead
3. **qualified** - Lead is interested
4. **converted** - Became a customer
5. **lost** - Not interested
6. **spam** - Invalid submission

## 🌐 Subdomain Deployment

### Vercel (Recommended)

1. Deploy your Next.js app to Vercel
2. Go to Project Settings → Domains
3. Add: `partners.yourdomain.com`
4. Update your DNS (follow Vercel instructions)
5. Update Supabase redirect URLs:
   - Go to Supabase → Authentication → URL Configuration
   - Add: `https://partners.yourdomain.com/auth/callback`

### Custom Server

1. Point subdomain DNS to your server
2. Configure SSL (Let's Encrypt recommended)
3. Set up reverse proxy (nginx/Apache)
4. Update environment variables

## 🎯 Usage Examples

### Create a Referral Partner

```sql
INSERT INTO channel_partners (
  email, company_name, contact_name, status, referral_code
) VALUES (
  'partner@company.com',
  'Partner Company LLC',
  'John Doe',
  'active',
  generate_referral_code()
);
```

### Get Partner's Referral Link

```sql
SELECT 
  'https://partners.yourdomain.com?ref=' || referral_code as referral_link
FROM channel_partners 
WHERE email = 'partner@company.com';
```

### Query Submissions

```sql
-- All submissions for a partner
SELECT * FROM referral_submissions 
WHERE referral_code = 'REF123456'
ORDER BY created_at DESC;

-- Conversion rate by partner
SELECT * FROM partner_performance 
WHERE status = 'active'
ORDER BY conversion_rate DESC;
```

## 🔐 Security Best Practices

1. **Never expose Service Role Key** - Only use in server-side code
2. **Use RLS policies** - Already configured in schema
3. **Validate input** - Form validation on client and server
4. **Sanitize data** - Prevent SQL injection (Supabase handles this)
5. **Monitor activity** - Use activity_log table

## 🎨 Customization

### Brand Colors

Update colors in component styles:
```tsx
// In any component
<style jsx>{`
  .btn-primary {
    background: #your-brand-color;
  }
`}</style>
```

### Form Fields

Add custom fields to `ReferralForm.tsx`:
```tsx
<div className="form-group">
  <label>Your Custom Field</label>
  <input 
    type="text" 
    name="custom_field"
    value={formData.custom_field}
    onChange={handleChange}
  />
</div>
```

Don't forget to update:
1. Database schema (add column)
2. API route (accept field)
3. TypeScript types (add to interface)

### Email Notifications

Integrate with email service in API route:
```tsx
// In /api/referral/submit/route.ts
import { sendEmail } from '@/lib/email';

// After successful submission
await sendEmail({
  to: 'admin@company.com',
  subject: 'New Referral Submission',
  body: `New lead: ${lead_name}`,
});
```

## 📈 Metrics & Reporting

### Available Metrics

The admin dashboard shows:
- Total submissions (all time)
- New submissions (last 7 days)
- Conversion rate
- Total revenue
- Active partner count
- Status breakdown
- Partner performance ranking

### Custom Reports

Query the database directly:
```sql
-- Top performing partners this month
SELECT 
  company_name,
  total_referrals,
  total_conversions,
  total_revenue
FROM channel_partners
WHERE created_at >= date_trunc('month', CURRENT_DATE)
ORDER BY total_revenue DESC
LIMIT 10;
```

## 🐛 Troubleshooting

### Issue: Form submission fails
**Solution:** Check browser console, verify Supabase connection, ensure RLS policies allow public inserts

### Issue: Can't log in
**Solution:** Verify user exists in Auth, check redirect URLs in Supabase settings

### Issue: Dashboard shows no data
**Solution:** Ensure user has admin role in `partner_users` table

### Issue: RLS policy violation
**Solution:** Check policies in schema.sql are applied correctly

## 📚 File Reference

```
Key Files:
├── supabase/schema.sql              # Database schema
├── lib/supabase/client.ts           # Supabase client
├── components/
│   ├── referral/ReferralForm.tsx    # Main form
│   ├── auth/LoginForm.tsx           # Auth UI
│   └── admin/AdminDashboard.tsx     # Dashboard UI
├── app/
│   ├── partners/page.tsx            # Form page
│   ├── partners/login/page.tsx      # Login page
│   ├── partners/dashboard/page.tsx  # Dashboard page
│   └── api/                         # API routes
├── SUPABASE_SETUP.md                # Detailed setup
└── IMPLEMENTATION_GUIDE.md          # Full guide
```

## 🎉 What Makes This Special

1. **No forced authentication** - Respect user privacy
2. **Immediate capture** - Never lose a lead
3. **Flexible tracking** - Works with or without referral codes
4. **Production ready** - RLS, validation, error handling
5. **Extensible** - Easy to add features

## 🚀 Next Features to Add

- [ ] Email notifications for new submissions
- [ ] Partner-specific dashboards
- [ ] Commission calculator
- [ ] Export to CSV
- [ ] Webhook integrations
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Mobile app

## 💡 Pro Tips

1. **Test without login first** - Verify public submission works
2. **Create test partners** - Use them to test referral tracking
3. **Monitor activity log** - Great for debugging
4. **Set up error monitoring** - Use Sentry or similar
5. **Back up your database** - Supabase has point-in-time recovery

## 📞 Support

For detailed guides:
- Setup: See `SUPABASE_SETUP.md`
- Implementation: See `IMPLEMENTATION_GUIDE.md`
- Database: See `supabase/schema.sql` (heavily commented)

## 📄 License

This implementation is part of your project. Modify as needed!

---

**Built with ❤️ using Next.js 16 and Supabase**

Ready to track those referrals! 🚀

