
CREATE TABLE public.modules (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  section text NOT NULL DEFAULT '',
  position integer NOT NULL DEFAULT 0,
  thumbnail_url text,
  badge text,
  badge_color text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.chapters (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id uuid NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  video_url text NOT NULL DEFAULT '',
  duration_seconds integer NOT NULL DEFAULT 0,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.user_chapter_progress (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  chapter_id uuid NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  completed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, chapter_id)
);

ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_chapter_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Modules viewable by everyone" ON public.modules FOR SELECT USING (true);
CREATE POLICY "Admins manage modules ins" ON public.modules FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage modules upd" ON public.modules FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage modules del" ON public.modules FOR DELETE USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Chapters viewable by everyone" ON public.chapters FOR SELECT USING (true);
CREATE POLICY "Admins manage chapters ins" ON public.chapters FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage chapters upd" ON public.chapters FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage chapters del" ON public.chapters FOR DELETE USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Users view own progress" ON public.user_chapter_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own progress" ON public.user_chapter_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own progress" ON public.user_chapter_progress FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER modules_set_updated_at BEFORE UPDATE ON public.modules FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER chapters_set_updated_at BEFORE UPDATE ON public.chapters FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
