-- ============================================================================
-- ARTin Migration 05: Storage Policies for Avatars & Admin Verification Audit
-- 
-- 1. Storage bucket policies for 'avatars' (public read, authenticated insert/update)
-- 2. Enhanced RLS for verification_requests to support full admin review lifecycle
-- 3. Grants and permissions for seamless frontend operations
-- ============================================================================

-- 1. Ensure 'avatars' bucket exists and is public
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- 2. Storage Objects Policies for avatars bucket
DROP POLICY IF EXISTS "Public can view avatars" ON storage.objects;
CREATE POLICY "Public can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Authenticated users can update avatars" ON storage.objects;
CREATE POLICY "Authenticated users can update avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars');

-- 3. Storage Objects Policies for verification-docs bucket
-- Allow authenticated users to insert verification docs freely
DROP POLICY IF EXISTS "Authenticated users can upload verification docs" ON storage.objects;
CREATE POLICY "Authenticated users can upload verification docs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'verification-docs');

-- Allow users to view their own docs or Admins to view all
DROP POLICY IF EXISTS "Admins and owners can view verification docs" ON storage.objects;
CREATE POLICY "Admins and owners can view verification docs"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'verification-docs' AND (
    (storage.foldername(name))[1] = auth.uid()::text 
    OR name ILIKE '%' || auth.uid()::text || '%'
    OR public.is_admin()
  )
);

-- 4. Full Admin Control and Audit Policies on verification_requests
-- Ensure admin can UPDATE any verification request (approve, reject, revise, reset)
DROP POLICY IF EXISTS "Admins full control on verification requests" ON public.verification_requests;
CREATE POLICY "Admins full control on verification requests"
ON public.verification_requests
FOR ALL
TO authenticated
USING (auth.uid() = user_id OR public.is_admin())
WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- 5. Ensure grant permissions on storage tables
GRANT ALL ON TABLE storage.objects TO anon, authenticated, service_role;
GRANT ALL ON TABLE storage.buckets TO anon, authenticated, service_role;
