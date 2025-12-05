# Admin User Setup Guide

This guide will help you set up an admin user to test the admin features of the referral system.

## Prerequisites

Before you begin, make sure you have:
1. ✅ Supabase project created
2. ✅ Run `supabase/schema.sql` in your Supabase SQL Editor
3. ✅ Run `supabase/schema-update-competitions.sql` in your Supabase SQL Editor
4. ✅ Environment variables configured (`.env.local`)

## Quick Setup (Recommended)

### Option 1: Create Admin via Supabase Dashboard

**Step 1: Create the user**
1. Go to your Supabase Dashboard
2. Click **Authentication** → **Users**
3. Click **"Add User"** or **"Invite user"**
4. Enter:
   - Email: `admin@yourdomain.com` (or any email you prefer)
   - Password: Create a secure password
5. Click **"Create user"**
6. **Copy the user's UUID** (you'll see it in the users list - it looks like `a1b2c3d4-e5f6-...`)

**Step 2: Grant admin role**
1. Go to **SQL Editor** in Supabase
2. Run this query (replace `YOUR-USER-UUID` with the UUID you copied):

```sql
INSERT INTO public.partner_users (user_id, partner_id, role)
VALUES (
    'YOUR-USER-UUID-HERE',  -- Replace this!
    NULL,
    'admin'
)
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
```

3. Done! 🎉

### Option 2: Use Existing User (Easiest)

If you already signed up via the website:

1. Go to **SQL Editor** in Supabase
2. Run this query with your email:

```sql
DO $$
DECLARE
    admin_email VARCHAR := 'your-email@example.com'; -- CHANGE THIS TO YOUR EMAIL
    admin_user_id UUID;
BEGIN
    SELECT id INTO admin_user_id
    FROM auth.users
    WHERE email = admin_email;
    
    IF admin_user_id IS NULL THEN
        RAISE EXCEPTION 'User with email % not found', admin_email;
    END IF;
    
    INSERT INTO public.partner_users (user_id, partner_id, role)
    VALUES (admin_user_id, NULL, 'admin')
    ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
    
    RAISE NOTICE 'Admin user created successfully for %', admin_email;
END $$;
```

## Testing Your Admin Access

### 1. Login
1. Go to `http://localhost:3000/partners/login` (or your deployed URL)
2. Sign in with your admin email and password
3. You should be redirected to `/partners/dashboard`

### 2. Verify Admin Features
You should see:
- ✅ "admin" badge in the top right
- ✅ Full admin dashboard (not the "coming soon" message)
- ✅ All referral submissions from all partners
- ✅ Ability to update submission status
- ✅ Filters and search functionality
- ✅ Statistics and metrics

### 3. Test Functionality
Try these actions:
- View all submissions
- Filter by status
- Update a submission's status
- Add admin notes to a submission
- View partner performance stats

## Troubleshooting

### Problem: Still seeing "Partner Dashboard" instead of Admin Dashboard

**Solution:**
1. Clear your browser cache and cookies
2. Log out completely
3. Close all browser tabs
4. Log back in

### Problem: "User not found" error when running SQL

**Solution:**
Make sure the user exists first:
```sql
-- Check if user exists
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'your-email@example.com';
```

If no results, create the user in Supabase Dashboard first (Authentication → Users → Add User)

### Problem: Can't see any submissions

**Solution:**
Check Row Level Security policies:
```sql
-- Verify you have admin role
SELECT pu.*, au.email
FROM public.partner_users pu
JOIN auth.users au ON pu.user_id = au.id
WHERE au.email = 'your-email@example.com';
```

Should show `role = 'admin'`

### Problem: SQL script returns an error

**Solution:**
Make sure you've run both schema files first:
1. `supabase/schema.sql` (main schema)
2. `supabase/schema-update-competitions.sql` (adds extra fields)

## Advanced: Create Multiple Admins

To create multiple admin users at once:

```sql
DO $$
DECLARE
    admin_emails VARCHAR[] := ARRAY[
        'admin1@company.com',
        'admin2@company.com',
        'admin3@company.com'
    ];
    admin_email VARCHAR;
    admin_user_id UUID;
BEGIN
    FOREACH admin_email IN ARRAY admin_emails
    LOOP
        SELECT id INTO admin_user_id
        FROM auth.users
        WHERE email = admin_email;
        
        IF admin_user_id IS NOT NULL THEN
            INSERT INTO public.partner_users (user_id, partner_id, role)
            VALUES (admin_user_id, NULL, 'admin')
            ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
            
            RAISE NOTICE 'Admin role granted to %', admin_email;
        ELSE
            RAISE NOTICE 'User % not found, create them first', admin_email;
        END IF;
    END LOOP;
END $$;
```

## Security Notes

### Admin Permissions
Admins can:
- ✅ View all referral submissions (from all partners)
- ✅ Update submission status and conversion values
- ✅ Add admin notes
- ✅ View all partner statistics
- ✅ Access admin-only API endpoints

### Regular Partners can:
- ✅ View only their own submissions
- ✅ Submit new referrals
- ✅ View their points and ranking
- ❌ Cannot view other partners' data
- ❌ Cannot update submission status

### Protection
- Row Level Security (RLS) policies enforce these permissions at the database level
- Middleware protects admin routes from unauthorized access
- All admin actions are logged in the activity_log table

## Need Help?

If you're still having issues:
1. Check the console for errors (browser DevTools)
2. Check the Supabase logs (Supabase Dashboard → Logs)
3. Verify your environment variables are set correctly
4. Make sure you've run both schema SQL files

## Quick Verification Queries

```sql
-- 1. List all admin users
SELECT au.email, pu.role, pu.created_at
FROM public.partner_users pu
JOIN auth.users au ON pu.user_id = au.id
WHERE pu.role = 'admin';

-- 2. Check total submissions
SELECT COUNT(*) as total_submissions 
FROM public.referral_submissions;

-- 3. View recent submissions
SELECT lead_name, lead_email, lead_company, status, created_at
FROM public.referral_submissions
ORDER BY created_at DESC
LIMIT 10;
```

---

**Ready to test?** Create your admin user and start exploring the admin dashboard! 🚀

