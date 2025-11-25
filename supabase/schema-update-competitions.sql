-- =====================================================
-- COMPETITION & GAMIFICATION ENHANCEMENT
-- Run this AFTER the main schema.sql
-- =====================================================

-- =====================================================
-- 1. COMPETITIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.competitions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    prize_description TEXT NOT NULL,
    prize_value DECIMAL(10,2),
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'ended', 'cancelled')),
    rules JSONB,
    winner_partner_id UUID REFERENCES public.channel_partners(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- =====================================================
-- 2. UPDATE REFERRAL SUBMISSIONS TABLE
-- Add more detailed lead information
-- =====================================================
ALTER TABLE public.referral_submissions 
ADD COLUMN IF NOT EXISTS lead_job_title VARCHAR(255),
ADD COLUMN IF NOT EXISTS lead_industry VARCHAR(255),
ADD COLUMN IF NOT EXISTS lead_company_size VARCHAR(100),
ADD COLUMN IF NOT EXISTS lead_budget_range VARCHAR(100),
ADD COLUMN IF NOT EXISTS lead_timeline VARCHAR(100),
ADD COLUMN IF NOT EXISTS lead_pain_points TEXT,
ADD COLUMN IF NOT EXISTS lead_linkedin_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS is_accounted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS quality_score INTEGER DEFAULT 0 CHECK (quality_score >= 0 AND quality_score <= 100);

-- Add comment to clarify accounted vs unaccounted
COMMENT ON COLUMN public.referral_submissions.is_accounted IS 
'TRUE if submitted by logged-in partner (tracked), FALSE if anonymous (unaccounted)';

-- =====================================================
-- 3. PARTNER POINTS & RANKINGS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.partner_points (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    partner_id UUID REFERENCES public.channel_partners(id) ON DELETE CASCADE NOT NULL,
    submission_id UUID REFERENCES public.referral_submissions(id) ON DELETE SET NULL,
    points INTEGER DEFAULT 0,
    reason VARCHAR(255),
    awarded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    awarded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- =====================================================
-- 4. COMPETITION LEADERBOARD VIEW
-- =====================================================
CREATE OR REPLACE VIEW public.competition_leaderboard AS
SELECT 
    cp.id as partner_id,
    cp.company_name,
    cp.contact_name,
    cp.email,
    cp.referral_code,
    COUNT(CASE WHEN rs.is_accounted = TRUE THEN 1 END) as total_tracked_referrals,
    COUNT(CASE WHEN rs.status = 'qualified' AND rs.is_accounted = TRUE THEN 1 END) as qualified_referrals,
    COUNT(CASE WHEN rs.status = 'converted' AND rs.is_accounted = TRUE THEN 1 END) as converted_referrals,
    COALESCE(SUM(pp.points), 0) as total_points,
    RANK() OVER (ORDER BY COALESCE(SUM(pp.points), 0) DESC) as rank,
    cp.total_revenue,
    ROUND(
        CASE 
            WHEN COUNT(CASE WHEN rs.is_accounted = TRUE THEN 1 END) > 0 
            THEN (COUNT(CASE WHEN rs.status = 'converted' AND rs.is_accounted = TRUE THEN 1 END)::DECIMAL / 
                  COUNT(CASE WHEN rs.is_accounted = TRUE THEN 1 END) * 100)
            ELSE 0 
        END, 2
    ) as conversion_rate
FROM public.channel_partners cp
LEFT JOIN public.referral_submissions rs ON cp.id = rs.partner_id
LEFT JOIN public.partner_points pp ON cp.id = pp.partner_id
WHERE cp.status = 'active'
GROUP BY cp.id, cp.company_name, cp.contact_name, cp.email, cp.referral_code, cp.total_revenue
ORDER BY total_points DESC;

-- =====================================================
-- 5. UNACCOUNTED REFERRALS VIEW (For Admin)
-- =====================================================
CREATE OR REPLACE VIEW public.unaccounted_referrals AS
SELECT 
    rs.*,
    CASE 
        WHEN rs.quality_score >= 80 THEN 'High'
        WHEN rs.quality_score >= 50 THEN 'Medium'
        ELSE 'Low'
    END as quality_rating
FROM public.referral_submissions rs
WHERE rs.is_accounted = FALSE
ORDER BY rs.created_at DESC;

-- =====================================================
-- 6. INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_competitions_status ON public.competitions(status);
CREATE INDEX IF NOT EXISTS idx_competitions_dates ON public.competitions(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_partner_points_partner_id ON public.partner_points(partner_id);
CREATE INDEX IF NOT EXISTS idx_referral_submissions_is_accounted ON public.referral_submissions(is_accounted);
CREATE INDEX IF NOT EXISTS idx_referral_submissions_quality_score ON public.referral_submissions(quality_score);

-- =====================================================
-- 7. TRIGGERS
-- =====================================================
CREATE TRIGGER update_competitions_updated_at
    BEFORE UPDATE ON public.competitions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 8. AUTO-ASSIGN POINTS FUNCTION
-- =====================================================
CREATE OR REPLACE FUNCTION auto_assign_points()
RETURNS TRIGGER AS $$
BEGIN
    -- Only assign points for accounted (logged-in) referrals
    IF NEW.is_accounted = TRUE AND NEW.partner_id IS NOT NULL THEN
        
        -- Points for new submission
        IF TG_OP = 'INSERT' THEN
            INSERT INTO public.partner_points (partner_id, submission_id, points, reason)
            VALUES (NEW.partner_id, NEW.id, 10, 'New referral submitted');
        END IF;
        
        -- Points for status changes
        IF TG_OP = 'UPDATE' THEN
            -- Qualified lead
            IF NEW.status = 'qualified' AND OLD.status != 'qualified' THEN
                INSERT INTO public.partner_points (partner_id, submission_id, points, reason)
                VALUES (NEW.partner_id, NEW.id, 25, 'Lead qualified');
            END IF;
            
            -- Converted lead
            IF NEW.status = 'converted' AND OLD.status != 'converted' THEN
                INSERT INTO public.partner_points (partner_id, submission_id, points, reason)
                VALUES (NEW.partner_id, NEW.id, 100, 'Lead converted');
            END IF;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_assign_points_trigger
    AFTER INSERT OR UPDATE ON public.referral_submissions
    FOR EACH ROW
    EXECUTE FUNCTION auto_assign_points();

-- =====================================================
-- 9. RLS POLICIES FOR NEW TABLES
-- =====================================================
ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_points ENABLE ROW LEVEL SECURITY;

-- Competitions - Everyone can view active competitions
CREATE POLICY "Anyone can view active competitions"
    ON public.competitions FOR SELECT
    USING (status IN ('active', 'upcoming'));

CREATE POLICY "Admins can manage competitions"
    ON public.competitions FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.partner_users
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Partner Points - Partners can view their own points
CREATE POLICY "Partners can view their own points"
    ON public.partner_points FOR SELECT
    TO authenticated
    USING (
        partner_id IN (
            SELECT partner_id FROM public.partner_users
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can view all points"
    ON public.partner_points FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.partner_users
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- =====================================================
-- 10. SEED DATA - Sample Competition
-- =====================================================
INSERT INTO public.competitions (
    title,
    description,
    prize_description,
    prize_value,
    start_date,
    end_date,
    status,
    rules
) VALUES (
    'Q4 2024 Top Referrer Challenge',
    'Submit the most qualified leads this quarter and win amazing prizes!',
    '1st Place: $5,000 Cash + Premium Dinner for 2 | 2nd Place: $2,500 Cash | 3rd Place: $1,000 Cash',
    5000.00,
    NOW(),
    NOW() + INTERVAL '3 months',
    'active',
    '{"scoring": {"new_referral": 10, "qualified": 25, "converted": 100}, "minimum_referrals": 5}'
) ON CONFLICT DO NOTHING;

-- =====================================================
-- SETUP COMPLETE
-- =====================================================
-- Next steps:
-- 1. Update the referral form component with new fields
-- 2. Create partner dashboard with leaderboard
-- 3. Create admin competition management UI
-- 4. Test point assignment system
-- =====================================================

