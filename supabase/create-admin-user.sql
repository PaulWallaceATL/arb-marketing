-- =====================================================
-- CREATE ADMIN USER SCRIPT
-- =====================================================
-- This script helps you set up an admin user for testing
-- 
-- IMPORTANT: Run these steps IN ORDER
-- =====================================================

-- =====================================================
-- STEP 1: CREATE USER IN SUPABASE AUTH
-- =====================================================
-- You MUST do this in the Supabase Dashboard first:
-- 1. Go to your Supabase project
-- 2. Click "Authentication" in the sidebar
-- 3. Click "Add User" (or "Users" > "Invite user")
-- 4. Enter email: admin@example.com (or your preferred email)
-- 5. Enter password: YourSecurePassword123!
-- 6. Click "Create user"
-- 7. Copy the user's UUID (you'll see it in the users list)
--
-- Alternative: Use the sign-up page at /partners/login
-- Then come back here and use their user_id
-- =====================================================

-- =====================================================
-- STEP 2: ADD ADMIN ROLE TO USER
-- =====================================================
-- Replace 'YOUR-USER-UUID-HERE' with the actual UUID from Step 1
-- Then run this in the Supabase SQL Editor

-- Option A: Create admin user WITHOUT a partner company
INSERT INTO public.partner_users (user_id, partner_id, role)
VALUES (
    'YOUR-USER-UUID-HERE',  -- Replace with actual user UUID
    NULL,                    -- No partner company for pure admin
    'admin'
)
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- Option B: Create admin user WITH a partner company (if they also submit referrals)
-- First, create a partner entry:
INSERT INTO public.channel_partners (
    email,
    company_name,
    contact_name,
    phone,
    website,
    status,
    referral_code
) VALUES (
    'admin@example.com',
    'ARB Marketing Admin',
    'Admin User',
    '+1-555-ADMIN',
    'https://arbmarketing.com',
    'active',
    generate_referral_code()
)
ON CONFLICT (email) DO UPDATE SET status = 'active'
RETURNING id;

-- Then link the user to this partner with admin role:
-- Replace BOTH UUIDs below
INSERT INTO public.partner_users (user_id, partner_id, role)
VALUES (
    'YOUR-USER-UUID-HERE',      -- Replace with actual user UUID
    'PARTNER-ID-FROM-ABOVE',     -- Replace with partner ID from above query
    'admin'
)
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- =====================================================
-- STEP 3: VERIFY ADMIN ACCESS
-- =====================================================
-- Run this to confirm the admin user was created successfully:

SELECT 
    pu.user_id,
    pu.role,
    au.email,
    cp.company_name,
    cp.referral_code,
    pu.created_at
FROM public.partner_users pu
JOIN auth.users au ON pu.user_id = au.id
LEFT JOIN public.channel_partners cp ON pu.partner_id = cp.id
WHERE pu.role = 'admin';

-- You should see your admin user listed here

-- =====================================================
-- QUICK SETUP: ALL-IN-ONE SCRIPT FOR NEW ADMINS
-- =====================================================
-- If you already have a user created in auth.users,
-- replace the email below and run this entire block:

DO $$
DECLARE
    admin_email VARCHAR := 'admin@example.com'; -- CHANGE THIS
    admin_user_id UUID;
BEGIN
    -- Get the user ID from their email
    SELECT id INTO admin_user_id
    FROM auth.users
    WHERE email = admin_email;
    
    IF admin_user_id IS NULL THEN
        RAISE EXCEPTION 'User with email % not found. Create the user in Supabase Auth first.', admin_email;
    END IF;
    
    -- Add admin role
    INSERT INTO public.partner_users (user_id, partner_id, role)
    VALUES (admin_user_id, NULL, 'admin')
    ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
    
    RAISE NOTICE 'Admin user created successfully for %', admin_email;
END $$;

-- =====================================================
-- BONUS: CREATE MULTIPLE ADMIN USERS AT ONCE
-- =====================================================
-- Uncomment and modify the emails below to create multiple admins:

/*
DO $$
DECLARE
    admin_emails VARCHAR[] := ARRAY[
        'admin1@example.com',
        'admin2@example.com',
        'admin3@example.com'
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
            RAISE NOTICE 'User % not found, skipping', admin_email;
        END IF;
    END LOOP;
END $$;
*/

-- =====================================================
-- TESTING YOUR ADMIN ACCESS
-- =====================================================
-- After creating your admin user:
-- 1. Go to /partners/login
-- 2. Sign in with the admin email/password
-- 3. You should be redirected to /partners/dashboard
-- 4. You should see the full admin dashboard with all submissions
-- 5. Test updating submission status, adding notes, etc.

-- =====================================================
-- TROUBLESHOOTING
-- =====================================================
-- If you can't see admin features after login:
-- 1. Check that the user exists in auth.users:
SELECT id, email, created_at FROM auth.users WHERE email = 'your-admin@example.com';

-- 2. Check that they have admin role in partner_users:
SELECT * FROM public.partner_users WHERE role = 'admin';

-- 3. Clear your browser cache/cookies and try logging in again

-- 4. Check RLS policies are working:
SET request.jwt.claims = '{"sub": "YOUR-USER-UUID-HERE"}';
SELECT * FROM public.referral_submissions LIMIT 5;
-- If you get results, RLS is working correctly

