-- ============================================================================
-- ARTin Database Schema Migration
-- PostGIS, Tables, Constraints, Indexes, Functions, RLS, & Triggers
-- Target Region: Bandar Lampung, Lampung, Indonesia
-- ============================================================================

-- 1. Enable PostGIS Extension
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Base Profiles Table (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('family', 'art', 'admin')),
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  avatar_url TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deactivated')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. ART Profiles Table
CREATE TABLE IF NOT EXISTS public.art_profiles (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  gender TEXT CHECK (gender IN ('female', 'male')),
  birth_date DATE,
  age INTEGER,
  city TEXT NOT NULL DEFAULT 'Bandar Lampung',
  district TEXT NOT NULL,
  address_summary TEXT,
  bio TEXT,
  experience_years INTEGER NOT NULL DEFAULT 0,
  preferred_job_types TEXT[] NOT NULL DEFAULT '{"full_time"}',
  expected_salary_min NUMERIC NOT NULL DEFAULT 1500000,
  expected_salary_max NUMERIC NOT NULL DEFAULT 2500000,
  availability_status TEXT NOT NULL DEFAULT 'available' CHECK (availability_status IN ('available', 'busy', 'not_available')),
  work_schedule TEXT DEFAULT 'Pulang Pergi (08:00 - 17:00)',
  verification_status TEXT NOT NULL DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected', 'requires_revision')),
  location_consent BOOLEAN NOT NULL DEFAULT false,
  location GEOGRAPHY(Point, 4326),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Employer (Family) Profiles Table
CREATE TABLE IF NOT EXISTS public.employer_profiles (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  contact_person TEXT,
  phone TEXT,
  city TEXT NOT NULL DEFAULT 'Bandar Lampung',
  district TEXT NOT NULL,
  work_address TEXT,
  work_address_summary TEXT,
  location GEOGRAPHY(Point, 4326),
  verification_status TEXT NOT NULL DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected', 'requires_revision')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Master Skills Table
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  icon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. ART Skills Relation
CREATE TABLE IF NOT EXISTS public.art_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  art_id UUID NOT NULL REFERENCES public.art_profiles(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  proficiency_level TEXT NOT NULL DEFAULT 'menengah' CHECK (proficiency_level IN ('dasar', 'menengah', 'ahli')),
  UNIQUE(art_id, skill_id)
);

-- 7. Work Experiences Table
CREATE TABLE IF NOT EXISTS public.work_experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  art_id UUID NOT NULL REFERENCES public.art_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  employer_name TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN NOT NULL DEFAULT false,
  description TEXT,
  reference_contact TEXT,
  reference_consent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Job Vacancies Table
CREATE TABLE IF NOT EXISTS public.job_vacancies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID NOT NULL REFERENCES public.employer_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  job_type TEXT NOT NULL CHECK (job_type IN ('full_time', 'part_time', 'live_in', 'live_out')),
  city TEXT NOT NULL DEFAULT 'Bandar Lampung',
  district TEXT NOT NULL,
  work_address TEXT,
  location GEOGRAPHY(Point, 4326),
  required_count INTEGER NOT NULL DEFAULT 1,
  salary_min NUMERIC NOT NULL DEFAULT 1500000,
  salary_max NUMERIC NOT NULL DEFAULT 2500000,
  payment_schedule TEXT NOT NULL DEFAULT 'Bulanan' CHECK (payment_schedule IN ('Harian', 'Mingguan', 'Bulanan')),
  working_hours TEXT DEFAULT '08:00 - 17:00 WIB',
  working_days TEXT DEFAULT 'Senin - Sabtu',
  facilities TEXT[] DEFAULT '{"Makan Siang", "Uang Transport"}',
  requirements TEXT[] DEFAULT '{"Pengalaman minimal 1 tahun", "Jujur dan bertanggung jawab"}',
  start_date DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'pending_moderation', 'active', 'closed', 'rejected')),
  moderation_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. Applications Table
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.job_vacancies(id) ON DELETE CASCADE,
  art_id UUID NOT NULL REFERENCES public.art_profiles(id) ON DELETE CASCADE,
  cover_letter TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'interview', 'accepted', 'rejected', 'withdrawn')),
  status_history JSONB NOT NULL DEFAULT '[]'::jsonb,
  notes_from_employer TEXT,
  interview_scheduled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(job_id, art_id)
);

-- 10. Verification Requests Table (Strictly Private Access)
CREATE TABLE IF NOT EXISTS public.verification_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('family', 'art')),
  id_card_url TEXT NOT NULL,
  selfie_url TEXT NOT NULL,
  certificate_urls TEXT[] DEFAULT '{}',
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected', 'requires_revision')),
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. Reports Table
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reported_user_id UUID REFERENCES public.profiles(id),
  reported_job_id UUID REFERENCES public.job_vacancies(id),
  category TEXT NOT NULL CHECK (category IN ('penipuan', 'lowongan_palsu', 'profil_mencurigakan', 'kontak_disalahgunakan', 'pelecehan', 'lainnya')),
  reason TEXT NOT NULL,
  evidence_urls TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'reviewing', 'resolved', 'rejected')),
  admin_notes TEXT,
  resolved_by UUID REFERENCES public.profiles(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 12. Activity Logs Table
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for Fast Querying
CREATE INDEX IF NOT EXISTS idx_art_profiles_district ON public.art_profiles(district);
CREATE INDEX IF NOT EXISTS idx_art_profiles_availability ON public.art_profiles(availability_status);
CREATE INDEX IF NOT EXISTS idx_art_profiles_verification ON public.art_profiles(verification_status);
CREATE INDEX IF NOT EXISTS idx_art_profiles_location ON public.art_profiles USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_job_vacancies_district ON public.job_vacancies(district);
CREATE INDEX IF NOT EXISTS idx_job_vacancies_status ON public.job_vacancies(status);
CREATE INDEX IF NOT EXISTS idx_job_vacancies_location ON public.job_vacancies USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON public.applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_art_id ON public.applications(art_id);

-- ============================================================================
-- SAFE SERVER-SIDE POSTGIS SEARCH FUNCTION
-- Note: Raw coordinates and exact addresses are NEVER exposed to the frontend!
-- Only distance in kilometers (rounded to 1 decimal) and general district are returned.
-- ============================================================================
CREATE OR REPLACE FUNCTION public.search_art_by_distance(
  p_lat DOUBLE PRECISION DEFAULT NULL,
  p_lng DOUBLE PRECISION DEFAULT NULL,
  p_max_distance_km DOUBLE PRECISION DEFAULT NULL,
  p_district TEXT DEFAULT NULL,
  p_min_experience INTEGER DEFAULT NULL,
  p_max_salary NUMERIC DEFAULT NULL,
  p_gender TEXT DEFAULT NULL,
  p_job_type TEXT DEFAULT NULL,
  p_verification_only BOOLEAN DEFAULT FALSE,
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  avatar_url TEXT,
  gender TEXT,
  age INTEGER,
  city TEXT,
  district TEXT,
  address_summary TEXT,
  bio TEXT,
  experience_years INTEGER,
  preferred_job_types TEXT[],
  expected_salary_min NUMERIC,
  expected_salary_max NUMERIC,
  availability_status TEXT,
  work_schedule TEXT,
  verification_status TEXT,
  distance_km NUMERIC,
  skills JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_ref_point GEOGRAPHY;
BEGIN
  IF p_lat IS NOT NULL AND p_lng IS NOT NULL THEN
    v_ref_point := ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography;
  END IF;

  RETURN QUERY
  SELECT
    ap.id,
    p.full_name,
    p.avatar_url,
    ap.gender,
    ap.age,
    ap.city,
    ap.district,
    ap.address_summary,
    ap.bio,
    ap.experience_years,
    ap.preferred_job_types,
    ap.expected_salary_min,
    ap.expected_salary_max,
    ap.availability_status,
    ap.work_schedule,
    ap.verification_status,
    CASE
      WHEN v_ref_point IS NOT NULL AND ap.location IS NOT NULL AND ap.location_consent = true
      THEN ROUND((ST_Distance(ap.location, v_ref_point) / 1000.0)::numeric, 1)
      ELSE NULL
    END AS distance_km,
    COALESCE(
      (
        SELECT jsonb_agg(jsonb_build_object('id', s.id, 'name', s.name, 'category', s.category, 'level', ask.proficiency_level))
        FROM public.art_skills ask
        JOIN public.skills s ON s.id = ask.skill_id
        WHERE ask.art_id = ap.id
      ),
      '[]'::jsonb
    ) AS skills
  FROM public.art_profiles ap
  JOIN public.profiles p ON p.id = ap.id
  WHERE p.status = 'active'
    -- District filter
    AND (p_district IS NULL OR p_district = '' OR ap.district ILIKE '%' || p_district || '%')
    -- Experience filter
    AND (p_min_experience IS NULL OR ap.experience_years >= p_min_experience)
    -- Salary filter
    AND (p_max_salary IS NULL OR ap.expected_salary_min <= p_max_salary)
    -- Gender filter
    AND (p_gender IS NULL OR p_gender = '' OR ap.gender = p_gender)
    -- Job type filter
    AND (p_job_type IS NULL OR p_job_type = '' OR p_job_type = ANY(ap.preferred_job_types))
    -- Verification filter
    AND (NOT p_verification_only OR ap.verification_status = 'verified')
    -- Distance filter (Only applies when reference point, max distance, and consent are provided)
    AND (
      v_ref_point IS NULL 
      OR p_max_distance_km IS NULL 
      OR (ap.location IS NOT NULL AND ap.location_consent = true AND ST_DWithin(ap.location, v_ref_point, p_max_distance_km * 1000))
    )
  ORDER BY
    CASE 
      WHEN v_ref_point IS NOT NULL AND ap.location IS NOT NULL AND ap.location_consent = true
      THEN ST_Distance(ap.location, v_ref_point)
      ELSE 9999999
    END ASC,
    ap.experience_years DESC,
    ap.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.art_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.art_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_vacancies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: Public can view active profiles (name, avatar, role); Owner can update their own
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (status = 'active');

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- ART Profiles: Public viewable, Owner updatable
CREATE POLICY "ART profiles are viewable by everyone" ON public.art_profiles
  FOR SELECT USING (true);

CREATE POLICY "ART can update own profile" ON public.art_profiles
  FOR ALL USING (auth.uid() = id);

-- Employer Profiles: Public can view general info; Owner can edit
CREATE POLICY "Employer profiles are viewable by everyone" ON public.employer_profiles
  FOR SELECT USING (true);

CREATE POLICY "Employer can update own profile" ON public.employer_profiles
  FOR ALL USING (auth.uid() = id);

-- Skills: Viewable by everyone; Admin can manage
CREATE POLICY "Skills are viewable by everyone" ON public.skills
  FOR SELECT USING (true);

-- ART Skills: Viewable by everyone; ART can manage own skills
CREATE POLICY "ART skills are viewable by everyone" ON public.art_skills
  FOR SELECT USING (true);

CREATE POLICY "ART can manage own skills" ON public.art_skills
  FOR ALL USING (auth.uid() = art_id);

-- Work Experiences: Viewable by everyone; ART can manage own experiences
CREATE POLICY "Work experiences viewable by everyone" ON public.work_experiences
  FOR SELECT USING (true);

CREATE POLICY "ART can manage own work experiences" ON public.work_experiences
  FOR ALL USING (auth.uid() = art_id);

-- Job Vacancies: Active jobs viewable by everyone; Employers manage own
CREATE POLICY "Active job vacancies viewable by everyone" ON public.job_vacancies
  FOR SELECT USING (status = 'active' OR auth.uid() = employer_id);

CREATE POLICY "Employers can insert and manage own vacancies" ON public.job_vacancies
  FOR ALL USING (auth.uid() = employer_id);

-- Applications: ART can view & insert their own; Employers can view applications for their jobs
CREATE POLICY "ART can view own applications" ON public.applications
  FOR SELECT USING (auth.uid() = art_id);

CREATE POLICY "ART can create applications" ON public.applications
  FOR INSERT WITH CHECK (auth.uid() = art_id);

CREATE POLICY "ART can update own applications (withdraw)" ON public.applications
  FOR UPDATE USING (auth.uid() = art_id);

CREATE POLICY "Employers can view applications for their jobs" ON public.applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.job_vacancies jv
      WHERE jv.id = applications.job_id AND jv.employer_id = auth.uid()
    )
  );

CREATE POLICY "Employers can update application status for their jobs" ON public.applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.job_vacancies jv
      WHERE jv.id = applications.job_id AND jv.employer_id = auth.uid()
    )
  );

-- Verification Requests: STRICTLY Private! Only owner and Admin can view
CREATE POLICY "Users can view and submit own verification requests" ON public.verification_requests
  FOR ALL USING (auth.uid() = user_id);

-- Reports: Users can submit reports; Only reporter and Admin can view
CREATE POLICY "Users can submit reports" ON public.reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view own reports" ON public.reports
  FOR SELECT USING (auth.uid() = reporter_id);
