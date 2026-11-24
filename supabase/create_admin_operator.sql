-- ============================================================================
-- ARTin Operator Provisioning Script
-- Creates or promotes an official Administrator account safely.
-- Note: Admin accounts CANNOT register via the public website.
-- ============================================================================
-- 
-- CARA PENGGUNAAN:
-- 1. Buat akun admin di Supabase Auth:
--    Dashboard -> Authentication -> Users -> Add User -> Create User
--    (Masukkan email operator, contoh: admin@artin.id atau email resmi Anda, dan password aman)
-- 2. Salin User UID yang dihasilkan dari tabel Authentication.
-- 3. Masukkan UID dan data Anda di bawah ini, lalu jalankan di SQL Editor.
-- ============================================================================

DO $$
DECLARE
  v_admin_id UUID := 'MASUKKAN-USER-UID-DARI-SUPABASE-AUTH-DISINI';
  v_admin_email TEXT := 'admin@artin.id';
  v_admin_name TEXT := 'Administrator Resmi ARTin';
  v_admin_phone TEXT := '081234567890';
BEGIN
  -- Validasi UID
  IF v_admin_id = 'MASUKKAN-USER-UID-DARI-SUPABASE-AUTH-DISINI'::uuid THEN
    RAISE NOTICE 'Silakan ganti v_admin_id dengan User UID asli dari Supabase Auth.';
    RETURN;
  END IF;

  -- Upsert ke public.profiles dengan role 'admin'
  INSERT INTO public.profiles (id, role, full_name, email, phone, status, created_at, updated_at)
  VALUES (
    v_admin_id,
    'admin',
    v_admin_name,
    v_admin_email,
    v_admin_phone,
    'active',
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE
  SET
    role = 'admin',
    full_name = EXCLUDED.full_name,
    status = 'active',
    updated_at = now();

  RAISE NOTICE 'Akun Administrator berhasil didaftarkan: % (%)', v_admin_name, v_admin_email;
END $$;
