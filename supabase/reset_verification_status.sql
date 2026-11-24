-- ==============================================================================
-- ARTin: Reset Verification Status to Unverified / Pending
-- Gunakan script ini di SQL Editor Supabase untuk mengembalikan akun yang 
-- sudah didaftarkan ke status 'unverified' (Belum Terverifikasi) 
-- agar dapat diuji proses verifikasinya secara alami oleh Admin.
-- ==============================================================================

-- 1. Kembalikan status seluruh profil ART menjadi 'unverified'
UPDATE public.art_profiles
SET verification_status = 'unverified',
    updated_at = now();

-- 2. Kembalikan status seluruh profil Keluarga menjadi 'unverified'
UPDATE public.employer_profiles
SET verification_status = 'unverified',
    updated_at = now();

-- 3. Kembalikan seluruh pengajuan verifikasi KTP menjadi 'pending' (Menunggu Pemeriksaan)
-- menghapus cap persetujuan sebelumnya agar Admin bisa menguji verifikasi ulang
UPDATE public.verification_requests
SET status = 'pending',
    reviewed_at = NULL,
    reviewed_by = NULL,
    rejection_reason = NULL,
    updated_at = now();

-- 4. Verifikasi hasil pembaruan
SELECT id, district, verification_status FROM public.art_profiles;
SELECT id, district, verification_status FROM public.employer_profiles;
SELECT id, user_id, role, status FROM public.verification_requests;
