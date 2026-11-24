-- ============================================================================
-- ARTin Migration 03: Storage Buckets & Hardened Admin RLS Policies
-- Security Hardening: Admin Capabilities, Private Storage & Privilege Guards
-- ============================================================================

-- 1. Helper Function: Check whether current auth user has 'admin' role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin' AND status = 'active'
  );
$$;

-- 2. Admin Policies for Verification Requests (Strictly Private)
-- Admin can view all verification submissions
CREATE POLICY "Admins can view all verification requests" ON public.verification_requests
  FOR SELECT USING (public.is_admin());

-- Admin can review/update verification status
CREATE POLICY "Admins can update verification requests" ON public.verification_requests
  FOR UPDATE USING (public.is_admin());

-- 3. Admin Policies for Reports & Moderation
-- Admin can view all user reports
CREATE POLICY "Admins can view all reports" ON public.reports
  FOR SELECT USING (public.is_admin());

-- Admin can update report status and resolution notes
CREATE POLICY "Admins can update reports" ON public.reports
  FOR UPDATE USING (public.is_admin());

-- 4. Admin Policies for Job Vacancies Moderation
-- Admin can moderate / update status of any job vacancy
CREATE POLICY "Admins can moderate any job vacancy" ON public.job_vacancies
  FOR UPDATE USING (public.is_admin());

-- 5. Admin Policies for User Profiles
-- Admin can view all profiles including deactivated ones
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_admin());

-- Admin can update profile status (suspend / deactivate)
CREATE POLICY "Admins can update user status" ON public.profiles
  FOR UPDATE USING (public.is_admin());

-- 6. Supabase Storage Buckets Setup
-- Public bucket for avatars
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  2097152, -- 2MB max
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 2097152;

-- STRICTLY PRIVATE bucket for verification identity documents (KTP & Selfie)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'verification-docs',
  'verification-docs',
  false, -- Private bucket! Never publicly accessible
  5242880, -- 5MB max
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 5242880;

-- 7. Storage RLS Policies for verification-docs
-- Authenticated users can upload their own verification documents to their subfolder
CREATE POLICY "Users can upload own verification documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'verification-docs' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can read only their own documents
CREATE POLICY "Users can view own verification documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'verification-docs'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Admins can view/read any verification document in the private bucket
CREATE POLICY "Admins can access all verification documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'verification-docs'
  AND public.is_admin()
);
