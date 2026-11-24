-- ============================================================================
-- ARTin Migration 04: Table Permissions (GRANT) & Verification Auto-Sync
-- 
-- Fixes PostgreSQL Error 42501 (permission denied for table ...)
-- and Foreign Key Constraint Error (verification_requests_user_id_fkey)
-- by ensuring all auth.users are automatically synced to public.profiles.
-- ============================================================================

-- 1. GRANT Table & Schema Privileges to anon and authenticated roles
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

-- 2. Trigger Function: Automatically create profile when a user registers in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, role, status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'phone',
    COALESCE(NEW.raw_user_meta_data->>'role', 'family'),
    'active'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    updated_at = now();

  IF (COALESCE(NEW.raw_user_meta_data->>'role', 'family') = 'art') THEN
    INSERT INTO public.art_profiles (id, district, city, availability_status, verification_status)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'district', 'Kedaton'),
      'Bandar Lampung',
      'available',
      'unverified'
    )
    ON CONFLICT (id) DO NOTHING;
  ELSIF (COALESCE(NEW.raw_user_meta_data->>'role', 'family') = 'family') THEN
    INSERT INTO public.employer_profiles (id, contact_person, district, city, verification_status)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
      COALESCE(NEW.raw_user_meta_data->>'district', 'Kedaton'),
      'Bandar Lampung',
      'unverified'
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT OR UPDATE ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. One-Time Backfill: Sync all existing auth.users to public.profiles right now
INSERT INTO public.profiles (id, email, full_name, phone, role, status)
SELECT 
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)),
  u.raw_user_meta_data->>'phone',
  CASE 
    WHEN u.email ILIKE '%admin%' OR u.raw_user_meta_data->>'role' = 'admin' THEN 'admin'
    WHEN u.raw_user_meta_data->>'role' = 'art' THEN 'art'
    ELSE 'family'
  END,
  'active'
FROM auth.users u
ON CONFLICT (id) DO NOTHING;

-- Also backfill into art_profiles
INSERT INTO public.art_profiles (id, district, city, availability_status, verification_status)
SELECT 
  p.id,
  'Kedaton',
  'Bandar Lampung',
  'available',
  'unverified'
FROM public.profiles p
WHERE p.role = 'art'
ON CONFLICT (id) DO NOTHING;

-- Also backfill into employer_profiles
INSERT INTO public.employer_profiles (id, contact_person, district, city, verification_status)
SELECT 
  p.id,
  p.full_name,
  'Kedaton',
  'Bandar Lampung',
  'unverified'
FROM public.profiles p
WHERE p.role = 'family'
ON CONFLICT (id) DO NOTHING;

-- 4. Hardened RLS Policies for verification_requests
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view and submit own verification requests" ON public.verification_requests;
DROP POLICY IF EXISTS "Users can view own verification requests" ON public.verification_requests;
DROP POLICY IF EXISTS "Users can insert own verification requests" ON public.verification_requests;
DROP POLICY IF EXISTS "Users and admins can view verification requests" ON public.verification_requests;
DROP POLICY IF EXISTS "Admins can view all verification requests" ON public.verification_requests;
DROP POLICY IF EXISTS "Admins can update verification requests" ON public.verification_requests;

-- Authenticated users can insert their own verification request
CREATE POLICY "Users can insert own verification requests" ON public.verification_requests
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Authenticated users can view their own requests; Admins can view all requests
CREATE POLICY "Users and admins can view verification requests" ON public.verification_requests
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

-- Admins can update status and rejection reasons
CREATE POLICY "Admins can update verification requests" ON public.verification_requests
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- 5. Policies for art_profiles and employer_profiles (allow Admin updates)
DROP POLICY IF EXISTS "Admins can update art profiles" ON public.art_profiles;
CREATE POLICY "Admins can update art profiles" ON public.art_profiles
  FOR ALL TO authenticated
  USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Admins can update employer profiles" ON public.employer_profiles;
CREATE POLICY "Admins can update employer profiles" ON public.employer_profiles
  FOR ALL TO authenticated
  USING (auth.uid() = id OR public.is_admin());

-- 6. Trigger Function: Sync verification status from verification_requests to profile tables
CREATE OR REPLACE FUNCTION public.handle_verification_status_sync()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role = 'art' THEN
    UPDATE public.art_profiles
    SET verification_status = NEW.status, updated_at = now()
    WHERE id = NEW.user_id;
  ELSIF NEW.role = 'family' THEN
    UPDATE public.employer_profiles
    SET verification_status = NEW.status, updated_at = now()
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Attach Trigger to verification_requests
DROP TRIGGER IF EXISTS trigger_sync_verification_status ON public.verification_requests;
CREATE TRIGGER trigger_sync_verification_status
AFTER INSERT OR UPDATE OF status ON public.verification_requests
FOR EACH ROW
EXECUTE FUNCTION public.handle_verification_status_sync();
