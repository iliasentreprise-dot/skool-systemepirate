-- Revoke public EXECUTE on trigger-only SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.assign_first_user_admin() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;

-- Drop broad SELECT policies on public buckets to prevent listing
-- Files remain accessible via public URLs (public buckets bypass RLS for direct reads)
DROP POLICY IF EXISTS "Avatars publicly readable" ON storage.objects;
DROP POLICY IF EXISTS "Post images publicly readable" ON storage.objects;