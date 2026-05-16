-- Video storage bucket + seed static modules

-- ── course-videos bucket ──
INSERT INTO storage.buckets (id, name, public)
VALUES ('course-videos', 'course-videos', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Course videos readable" ON storage.objects;
CREATE POLICY "Course videos readable" ON storage.objects
  FOR SELECT USING (bucket_id = 'course-videos');

DROP POLICY IF EXISTS "Authenticated users upload course videos" ON storage.objects;
CREATE POLICY "Authenticated users upload course videos" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'course-videos');

DROP POLICY IF EXISTS "Authenticated users update course videos" ON storage.objects;
CREATE POLICY "Authenticated users update course videos" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'course-videos');

DROP POLICY IF EXISTS "Authenticated users delete course videos" ON storage.objects;
CREATE POLICY "Authenticated users delete course videos" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'course-videos');

-- ── Seed static modules (only if table is empty) ──
INSERT INTO public.modules (title, description, section, position, badge, badge_color)
SELECT title, description, section, position, badge, badge_color
FROM (VALUES
  ('La mentalité d''un entrepreneur à +20k/mois', 'Présentation du système PIRATE · Mindset · Motivation', 'mindset', 0, NULL::text,   NULL::text),
  ('Préparer son compte TikTok',                  '',                                                        'jour1',   0, 'NEW',        '#a855f7'),
  ('L''Offre Irrésistible',                        '',                                                        'jour1',   1, NULL,         NULL),
  ('Analyser sa concurrence et faire mieux',       '',                                                        'jour1',   2, NULL,         NULL),
  ('Le Tunnel de vente Pirate',                    '',                                                        'jour2',   0, NULL,         NULL),
  ('Créer ton produit digital',                    '',                                                        'jour2',   1, NULL,         NULL),
  ('Stratégie Carrousels PIRATE',                  '',                                                        'jour2',   2, NULL,         NULL),
  ('Les Lives TikTok',                             '',                                                        'jour3',   0, NULL,         NULL),
  ('Closer en DM avec une méthode interdite',      '',                                                        'jour3',   1, 'NEW',        '#ef4444'),
  ('🧲 LeadMagnet ULTIME',                         '',                                                        'jour3',   2, 'NEW',        '#ef4444'),
  ('La puissance de l''emailing',                  '',                                                        'bonus',   0, 'NEW',        '#f59e0b'),
  ('Comment déclarer',                             '',                                                        'bonus',   1, NULL,         NULL),
  ('L''OUTIL d''automatisation TikTok SECRET',     'Accès exclusif aux outils secrets qui font tourner le système en automatique', 'ultime', 0, 'EXCLUSIF', '#f59e0b'),
  ('Logiciel de BOOST d''abonnés ULTIME',          'Accès exclusif aux outils secrets qui font tourner le système en automatique', 'ultime', 1, 'EXCLUSIF', '#f59e0b')
) AS v(title, description, section, position, badge, badge_color)
WHERE NOT EXISTS (SELECT 1 FROM public.modules LIMIT 1);
