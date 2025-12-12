-- =====================================================
-- SUPABASE SQL SCHEMA FOR REFERRAL CHANNEL PARTNERS
-- =====================================================

-- Note: JWT secrets are managed by Supabase automatically
-- No need to set them manually

-- =====================================================
-- 1. CHANNEL PARTNERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.channel_partners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    website VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive', 'rejected')),
    referral_code VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE,
    approved_by UUID REFERENCES auth.users(id),
    commission_rate DECIMAL(5,2) DEFAULT 10.00,
    total_referrals INTEGER DEFAULT 0,
    total_conversions INTEGER DEFAULT 0,
    total_revenue DECIMAL(12,2) DEFAULT 0.00
);

-- =====================================================
-- 2. REFERRAL SUBMISSIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.referral_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    partner_id UUID REFERENCES public.channel_partners(id) ON DELETE SET NULL,
    referral_code VARCHAR(50),
    
    -- Lead Information
    lead_email VARCHAR(255) NOT NULL,
    lead_name VARCHAR(255) NOT NULL,
    lead_phone VARCHAR(50),
    lead_company VARCHAR(255),
    lead_message TEXT,
    
    -- Tracking Information
    submission_source VARCHAR(100) DEFAULT 'web_form',
    ip_address INET,
    user_agent TEXT,
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    
    -- Status Tracking
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
    conversion_value DECIMAL(12,2),
    
    -- Authentication Status
    submitted_by_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    is_authenticated BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    contacted_at TIMESTAMP WITH TIME ZONE,
    converted_at TIMESTAMP WITH TIME ZONE,
    
    -- Notes
    admin_notes TEXT
);

-- =====================================================
-- 3. PARTNER USERS TABLE (For login tracking)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.partner_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    partner_id UUID REFERENCES public.channel_partners(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'partner' CHECK (role IN ('admin', 'partner', 'viewer')),
    points INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. ACTIVITY LOG TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.activity_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    partner_id UUID REFERENCES public.channel_partners(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    details JSONB,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. INDEXES FOR PERFORMANCE (idempotent)
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_channel_partners_email ON public.channel_partners(email);
CREATE INDEX IF NOT EXISTS idx_channel_partners_referral_code ON public.channel_partners(referral_code);
CREATE INDEX IF NOT EXISTS idx_channel_partners_status ON public.channel_partners(status);

CREATE INDEX IF NOT EXISTS idx_referral_submissions_partner_id ON public.referral_submissions(partner_id);
CREATE INDEX IF NOT EXISTS idx_referral_submissions_referral_code ON public.referral_submissions(referral_code);
CREATE INDEX IF NOT EXISTS idx_referral_submissions_status ON public.referral_submissions(status);
CREATE INDEX IF NOT EXISTS idx_referral_submissions_created_at ON public.referral_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_referral_submissions_lead_email ON public.referral_submissions(lead_email);

CREATE INDEX IF NOT EXISTS idx_partner_users_user_id ON public.partner_users(user_id);
CREATE INDEX IF NOT EXISTS idx_partner_users_partner_id ON public.partner_users(partner_id);

CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON public.activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON public.activity_log(created_at DESC);

-- =====================================================
-- 6. UPDATED_AT TRIGGER FUNCTION
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers (idempotent)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'update_channel_partners_updated_at'
    ) THEN
        CREATE TRIGGER update_channel_partners_updated_at
            BEFORE UPDATE ON public.channel_partners
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'update_referral_submissions_updated_at'
    ) THEN
        CREATE TRIGGER update_referral_submissions_updated_at
            BEFORE UPDATE ON public.referral_submissions
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END;
$$;

-- =====================================================
-- 7. ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE public.channel_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- Channel Partners Policies
DO $$
BEGIN
    -- Channel partners policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'channel_partners' AND policyname = 'Admins can view all partners') THEN
        CREATE POLICY "Admins can view all partners"
            ON public.channel_partners FOR SELECT
            TO authenticated
            USING (
                EXISTS (
                    SELECT 1 FROM public.partner_users
                    WHERE user_id = auth.uid() AND role = 'admin'
                )
            );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'channel_partners' AND policyname = 'Partners can view their own data') THEN
        CREATE POLICY "Partners can view their own data"
            ON public.channel_partners FOR SELECT
            TO authenticated
            USING (
                id IN (
                    SELECT partner_id FROM public.partner_users
                    WHERE user_id = auth.uid()
                )
            );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'channel_partners' AND policyname = 'Anyone can insert partner applications') THEN
        CREATE POLICY "Anyone can insert partner applications"
            ON public.channel_partners FOR INSERT
            WITH CHECK (true);
    END IF;

    -- Referral submissions policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'referral_submissions' AND policyname = 'Anyone can submit referrals') THEN
        CREATE POLICY "Anyone can submit referrals"
            ON public.referral_submissions FOR INSERT
            WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'referral_submissions' AND policyname = 'Admins can view all submissions') THEN
        CREATE POLICY "Admins can view all submissions"
            ON public.referral_submissions FOR SELECT
            TO authenticated
            USING (
                EXISTS (
                    SELECT 1 FROM public.partner_users
                    WHERE user_id = auth.uid() AND role = 'admin'
                )
            );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'referral_submissions' AND policyname = 'Partners can view their own submissions') THEN
        CREATE POLICY "Partners can view their own submissions"
            ON public.referral_submissions FOR SELECT
            TO authenticated
            USING (
                partner_id IN (
                    SELECT partner_id FROM public.partner_users
                    WHERE user_id = auth.uid()
                )
            );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'referral_submissions' AND policyname = 'Admins can update submissions') THEN
        CREATE POLICY "Admins can update submissions"
            ON public.referral_submissions FOR UPDATE
            TO authenticated
            USING (
                EXISTS (
                    SELECT 1 FROM public.partner_users
                    WHERE user_id = auth.uid() AND role = 'admin'
                )
            );
    END IF;

    -- Partner users policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'partner_users' AND policyname = 'Users can view their own partner user record') THEN
        CREATE POLICY "Users can view their own partner user record"
            ON public.partner_users FOR SELECT
            TO authenticated
            USING (user_id = auth.uid());
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'partner_users' AND policyname = 'Admins can view all partner users') THEN
        CREATE POLICY "Admins can view all partner users"
            ON public.partner_users FOR SELECT
            TO authenticated
            USING (
                EXISTS (
                    SELECT 1 FROM public.partner_users
                    WHERE user_id = auth.uid() AND role = 'admin'
                )
            );
    END IF;

    -- Activity log policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'activity_log' AND policyname = 'Users can view their own activity') THEN
        CREATE POLICY "Users can view their own activity"
            ON public.activity_log FOR SELECT
            TO authenticated
            USING (user_id = auth.uid());
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'activity_log' AND policyname = 'Admins can view all activity') THEN
        CREATE POLICY "Admins can view all activity"
            ON public.activity_log FOR SELECT
            TO authenticated
            USING (
                EXISTS (
                    SELECT 1 FROM public.partner_users
                    WHERE user_id = auth.uid() AND role = 'admin'
                )
            );
    END IF;
END;
$$;

-- =====================================================
-- 8. FUNCTIONS FOR BUSINESS LOGIC
-- =====================================================

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
DECLARE
    new_code TEXT;
    code_exists BOOLEAN;
BEGIN
    LOOP
        new_code := 'REF' || LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
        
        SELECT EXISTS (
            SELECT 1 FROM public.channel_partners WHERE referral_code = new_code
        ) INTO code_exists;
        
        EXIT WHEN NOT code_exists;
    END LOOP;
    
    RETURN new_code;
END;
$$ LANGUAGE plpgsql;

-- Function to update partner statistics
CREATE OR REPLACE FUNCTION update_partner_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.channel_partners
        SET total_referrals = total_referrals + 1
        WHERE id = NEW.partner_id;
    END IF;
    
    IF TG_OP = 'UPDATE' AND NEW.status = 'converted' AND OLD.status != 'converted' THEN
        UPDATE public.channel_partners
        SET 
            total_conversions = total_conversions + 1,
            total_revenue = total_revenue + COALESCE(NEW.conversion_value, 0)
        WHERE id = NEW.partner_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'update_partner_stats_trigger'
    ) THEN
        CREATE TRIGGER update_partner_stats_trigger
            AFTER INSERT OR UPDATE ON public.referral_submissions
            FOR EACH ROW
            EXECUTE FUNCTION update_partner_stats();
    END IF;
END;
$$;

-- =====================================================
-- 9. SEED DATA (Optional - for testing)
-- =====================================================

-- Insert a test admin user (you'll need to create this user in Supabase Auth first)
-- Example: INSERT INTO public.partner_users (user_id, role) VALUES ('your-admin-user-id', 'admin');

-- =====================================================
-- RAFFLES & ENTRIES
-- =====================================================
CREATE TABLE IF NOT EXISTS public.raffles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    entry_cost_points INTEGER NOT NULL CHECK (entry_cost_points > 0),
    max_entries INTEGER NOT NULL CHECK (max_entries > 0),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','closed')),
    image_url TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.raffles ADD COLUMN IF NOT EXISTS image_url TEXT;

CREATE TABLE IF NOT EXISTS public.raffle_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    raffle_id UUID REFERENCES public.raffles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    points_spent INTEGER NOT NULL CHECK (points_spent > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (raffle_id, user_id, id)
);

CREATE INDEX IF NOT EXISTS idx_raffle_entries_raffle_id ON public.raffle_entries(raffle_id);
CREATE INDEX IF NOT EXISTS idx_raffle_entries_user_id ON public.raffle_entries(user_id);

-- Insert a test channel partner
INSERT INTO public.channel_partners (
    email,
    company_name,
    contact_name,
    phone,
    website,
    status,
    referral_code
) VALUES (
    'partner@example.com',
    'Example Partner LLC',
    'John Doe',
    '+1-555-0123',
    'https://example.com',
    'active',
    'REF123456'
) ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- 10. VIEWS FOR REPORTING
-- =====================================================

CREATE OR REPLACE VIEW public.partner_performance AS
SELECT 
    cp.id,
    cp.company_name,
    cp.contact_name,
    cp.email,
    cp.referral_code,
    cp.status,
    cp.total_referrals,
    cp.total_conversions,
    cp.total_revenue,
    CASE 
        WHEN cp.total_referrals > 0 
        THEN ROUND((cp.total_conversions::DECIMAL / cp.total_referrals * 100), 2)
        ELSE 0 
    END as conversion_rate,
    COUNT(CASE WHEN rs.status = 'new' THEN 1 END) as pending_leads,
    COUNT(CASE WHEN rs.status = 'contacted' THEN 1 END) as contacted_leads,
    COUNT(CASE WHEN rs.status = 'qualified' THEN 1 END) as qualified_leads
FROM public.channel_partners cp
LEFT JOIN public.referral_submissions rs ON cp.id = rs.partner_id
GROUP BY cp.id, cp.company_name, cp.contact_name, cp.email, cp.referral_code, 
         cp.status, cp.total_referrals, cp.total_conversions, cp.total_revenue;

-- =====================================================
-- SETUP COMPLETE
-- =====================================================
-- To use this schema:
-- 1. Copy this entire script
-- 2. Go to your Supabase project Dashboard
-- 3. Navigate to SQL Editor
-- 4. Paste and run this script
-- 5. Configure your environment variables in your Next.js app
-- =====================================================

