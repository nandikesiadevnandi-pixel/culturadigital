
CREATE TABLE public.submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  class_number TEXT NOT NULL,
  auto_score INTEGER NOT NULL DEFAULT 0,
  manual_score INTEGER NOT NULL DEFAULT 0,
  total_score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (student_name, class_number)
);

CREATE TABLE public.answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  question_number INTEGER NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'open', 'reflective')),
  answer_text TEXT NOT NULL,
  is_correct BOOLEAN,
  manual_points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_answers_submission ON public.answers(submission_id);
CREATE INDEX idx_submissions_class ON public.submissions(class_number, total_score DESC);

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;

-- Anyone can read (public ranking)
CREATE POLICY "Anyone can view submissions"
  ON public.submissions FOR SELECT USING (true);

CREATE POLICY "Anyone can view answers"
  ON public.answers FOR SELECT USING (true);

-- Anyone can insert (open form, no auth)
CREATE POLICY "Anyone can submit"
  ON public.submissions FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can submit answers"
  ON public.answers FOR INSERT WITH CHECK (true);

-- No update/delete from clients - only via edge function with service role

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_submissions_updated_at
  BEFORE UPDATE ON public.submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.submissions;
