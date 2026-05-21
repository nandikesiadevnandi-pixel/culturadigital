
-- Posts
CREATE TABLE public.social_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  author_name TEXT NOT NULL,
  school TEXT,
  class_name TEXT NOT NULL,
  image_path TEXT,
  caption TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Class members see posts" ON public.social_posts
FOR SELECT USING (class_name = public.current_user_class() OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "Users create own posts" ON public.social_posts
FOR INSERT WITH CHECK (
  auth.uid() = user_id
  AND NOT public.user_is_blocked(auth.uid())
  AND (class_name = public.current_user_class() OR public.has_role(auth.uid(),'admin'))
);

CREATE POLICY "Author or admin delete post" ON public.social_posts
FOR DELETE USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

-- Likes
CREATE TABLE public.social_likes (
  post_id UUID NOT NULL REFERENCES public.social_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, user_id)
);
ALTER TABLE public.social_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Class members see likes" ON public.social_likes
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.social_posts p WHERE p.id = post_id
    AND (p.class_name = public.current_user_class() OR public.has_role(auth.uid(),'admin')))
);

CREATE POLICY "Users like in own class" ON public.social_likes
FOR INSERT WITH CHECK (
  auth.uid() = user_id AND NOT public.user_is_blocked(auth.uid())
  AND EXISTS (SELECT 1 FROM public.social_posts p WHERE p.id = post_id
    AND (p.class_name = public.current_user_class() OR public.has_role(auth.uid(),'admin')))
);

CREATE POLICY "Users unlike own" ON public.social_likes
FOR DELETE USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

-- Comments
CREATE TABLE public.social_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.social_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  author_name TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.social_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Class members see comments" ON public.social_comments
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.social_posts p WHERE p.id = post_id
    AND (p.class_name = public.current_user_class() OR public.has_role(auth.uid(),'admin')))
);

CREATE POLICY "Users comment in own class" ON public.social_comments
FOR INSERT WITH CHECK (
  auth.uid() = user_id AND NOT public.user_is_blocked(auth.uid())
  AND EXISTS (SELECT 1 FROM public.social_posts p WHERE p.id = post_id
    AND (p.class_name = public.current_user_class() OR public.has_role(auth.uid(),'admin')))
);

CREATE POLICY "Author or admin delete comment" ON public.social_comments
FOR DELETE USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

-- Moderation flags
CREATE TABLE public.moderation_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  author_name TEXT,
  class_name TEXT,
  context TEXT NOT NULL,
  original_text TEXT NOT NULL,
  reason TEXT,
  severity TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.moderation_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read flags" ON public.moderation_flags
FOR SELECT USING (public.has_role(auth.uid(),'admin'));

CREATE POLICY "Anyone insert flag" ON public.moderation_flags
FOR INSERT WITH CHECK (true);

-- Bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('social-posts','social-posts', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Social posts public read" ON storage.objects
FOR SELECT USING (bucket_id = 'social-posts');

CREATE POLICY "Users upload own social post" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'social-posts' AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users delete own social post" ON storage.objects
FOR DELETE USING (
  bucket_id = 'social-posts' AND (auth.uid()::text = (storage.foldername(name))[1]
    OR public.has_role(auth.uid(),'admin'))
);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.social_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.social_likes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.social_comments;
