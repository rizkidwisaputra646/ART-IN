-- ============================================================================
-- ARTin Production Database Cleanup Script
-- Safely cleans demo/testing records while preserving schema, extensions,
-- RLS policies, and master skills catalog (public.skills).
-- ============================================================================
--
-- PANDUAN PENGGUNAAN (OPERATOR):
-- 1. Buat Backup Database terlebih dahulu di Supabase Dashboard -> Database -> Backups.
-- 2. Buka Supabase Dashboard -> SQL Editor.
-- 3. Jalankan script ini untuk membersihkan data testing/demonstrasi.
-- ============================================================================

BEGIN;

-- 1. Bersihkan Aktivitas & Log Sistem Testing
DELETE FROM public.activity_logs
WHERE user_id IN (
  SELECT id FROM public.profiles WHERE email ILIKE '%@artin.id' OR email ILIKE '%test%' OR email ILIKE '%dummy%'
);

-- 2. Bersihkan Laporan Pengguna Testing
DELETE FROM public.reports
WHERE reporter_id IN (
  SELECT id FROM public.profiles WHERE email ILIKE '%@artin.id' OR email ILIKE '%test%'
) OR reported_user_id IN (
  SELECT id FROM public.profiles WHERE email ILIKE '%@artin.id' OR email ILIKE '%test%'
);

-- 3. Bersihkan Pengajuan Verifikasi Testing
DELETE FROM public.verification_requests
WHERE user_id IN (
  SELECT id FROM public.profiles WHERE email ILIKE '%@artin.id' OR email ILIKE '%test%'
);

-- 4. Bersihkan Lamaran Pekerjaan Testing
DELETE FROM public.applications
WHERE art_id IN (
  SELECT id FROM public.profiles WHERE email ILIKE '%@artin.id' OR email ILIKE '%test%'
) OR job_id IN (
  SELECT id FROM public.job_vacancies WHERE employer_id IN (
    SELECT id FROM public.profiles WHERE email ILIKE '%@artin.id' OR email ILIKE '%test%'
  )
);

-- 5. Bersihkan Lowongan Pekerjaan Testing
DELETE FROM public.job_vacancies
WHERE employer_id IN (
  SELECT id FROM public.profiles WHERE email ILIKE '%@artin.id' OR email ILIKE '%test%'
);

-- 6. Bersihkan Pengalaman Kerja & Keterampilan ART Testing
DELETE FROM public.work_experiences
WHERE art_id IN (
  SELECT id FROM public.profiles WHERE email ILIKE '%@artin.id' OR email ILIKE '%test%'
);

DELETE FROM public.art_skills
WHERE art_id IN (
  SELECT id FROM public.profiles WHERE email ILIKE '%@artin.id' OR email ILIKE '%test%'
);

-- 7. Bersihkan Profil ART & Keluarga Testing
DELETE FROM public.art_profiles
WHERE id IN (
  SELECT id FROM public.profiles WHERE email ILIKE '%@artin.id' OR email ILIKE '%test%'
);

DELETE FROM public.employer_profiles
WHERE id IN (
  SELECT id FROM public.profiles WHERE email ILIKE '%@artin.id' OR email ILIKE '%test%'
);

-- 8. Bersihkan Base Profiles Akun Testing (Kecuali Admin Operator Sah)
DELETE FROM public.profiles
WHERE (email ILIKE '%@artin.id' OR email ILIKE '%test%')
  AND role != 'admin';

-- PENTING: Tabel public.skills (Master Kategori Keahlian) TETAP DIPERTAHANKAN.
-- Verifikasi sisa data:
SELECT 'profiles' AS table_name, count(*) AS count FROM public.profiles
UNION ALL
SELECT 'art_profiles', count(*) FROM public.art_profiles
UNION ALL
SELECT 'employer_profiles', count(*) FROM public.employer_profiles
UNION ALL
SELECT 'job_vacancies', count(*) FROM public.job_vacancies
UNION ALL
SELECT 'skills (master preserved)', count(*) FROM public.skills;

COMMIT;
