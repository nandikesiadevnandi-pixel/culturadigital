CREATE TABLE public.monthly_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  period_key TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, period_key)
);

ALTER TABLE public.monthly_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view their own reports" ON public.monthly_reports
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert their own reports" ON public.monthly_reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update their own reports" ON public.monthly_reports
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete their own reports" ON public.monthly_reports
  FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_monthly_reports_updated_at
BEFORE UPDATE ON public.monthly_reports
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_monthly_reports_user_period ON public.monthly_reports(user_id, period_key);