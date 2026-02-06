-- Points system: gift card flag and payouts table
-- Run this migration to enable the new points rules and cash-out.

-- Add gift card claimed flag to partner_users
ALTER TABLE public.partner_users
  ADD COLUMN IF NOT EXISTS gift_card_25_claimed BOOLEAN NOT NULL DEFAULT FALSE;

-- Payouts table (cash-out in 250 pt increments, 1 pt = $1)
CREATE TABLE IF NOT EXISTS public.partner_payouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  points_deducted INTEGER NOT NULL CHECK (points_deducted > 0),
  amount_dollars DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_partner_payouts_user_id ON public.partner_payouts(user_id);
CREATE INDEX IF NOT EXISTS idx_partner_payouts_created_at ON public.partner_payouts(created_at DESC);

-- RLS
ALTER TABLE public.partner_payouts ENABLE ROW LEVEL SECURITY;

-- Partners can view their own payouts
DROP POLICY IF EXISTS "Partners can view own payouts" ON public.partner_payouts;
CREATE POLICY "Partners can view own payouts"
  ON public.partner_payouts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins can view all
DROP POLICY IF EXISTS "Admins can view all payouts" ON public.partner_payouts;
CREATE POLICY "Admins can view all payouts"
  ON public.partner_payouts FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.partner_users WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Only service role can insert (API will use service role)
DROP POLICY IF EXISTS "Service role insert payouts" ON public.partner_payouts;
CREATE POLICY "Service role insert payouts"
  ON public.partner_payouts FOR INSERT
  TO authenticated
  WITH CHECK (false);
-- Note: Insert from app uses service role key, so RLS may be bypassed. If not, add a policy for insert where user_id = auth.uid() for self cash-out.

COMMENT ON TABLE public.partner_payouts IS 'Cash-out history: 250 points = $250, minimum 250 pts';
