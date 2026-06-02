ALTER TABLE public.bafo_matches REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bafo_matches;
ALTER TABLE public.bafo_rankings REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bafo_rankings;