-- Make lead_email optional on referral_submissions (form allows optional email)
ALTER TABLE public.referral_submissions
  ALTER COLUMN lead_email DROP NOT NULL;
