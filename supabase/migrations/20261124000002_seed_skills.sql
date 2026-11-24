-- ============================================================================
-- ARTin Seed Data: Master Skills & Bandar Lampung Initial Candidates & Jobs
-- Realistic, culturally authentic Indonesian data tailored for Bandar Lampung
-- ============================================================================

-- Master Skills
INSERT INTO public.skills (name, category, icon) VALUES
('Pembersihan Rumah Menyeluruh', 'Kebersihan', 'Sparkles'),
('Memasak Masakan Nusantara', 'Kuliner', 'Utensils'),
('Perawatan & Pengasuhan Balita', 'Pengasuhan', 'Baby'),
('Pendampingan Lansia', 'Pengasuhan', 'HeartPulse'),
('Mencuci & Menyetrika Rapi', 'Kebersihan', 'Shirt'),
('Perawatan Tanaman & Kebun', 'Pekarangan', 'Flower2'),
('Belanja Kebutuhan Dapur', 'Rumah Tangga', 'ShoppingBag'),
('Bisa Mengendarai Motor', 'Mobilitas', 'Bike'),
('Memasak Menu Khusus/Diet', 'Kuliner', 'ChefHat'),
('Pertolongan Pertama (P3K)', 'Kesehatan', 'ShieldPlus')
ON CONFLICT (name) DO NOTHING;
