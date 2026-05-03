ALTER TABLE public.submissions ADD COLUMN IF NOT EXISTS platform TEXT NOT NULL DEFAULT 'cultura';
CREATE INDEX IF NOT EXISTS idx_submissions_platform ON public.submissions(platform);