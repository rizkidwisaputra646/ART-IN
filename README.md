# ARTin — Platform Pencarian & Perekrutan Asisten Rumah Tangga (ART)
**Wilayah Operasional: Kota Bandar Lampung, Lampung**

---

## 1. Tentang Produk
**ARTin** adalah platform digital MVP yang mempertemukan keluarga yang membutuhkan Asisten Rumah Tangga (ART) dengan calon ART yang sedang mencari pekerjaan di wilayah Kota Bandar Lampung. 

Platform ini dirancang dengan pendekatan **Modern Marketplace + Warm Home Service**, memadukan kenyamanan, kehangatan layanan rumah tangga, dan keamanan data tingkat tinggi.

### Identitas Visual & Palet Warna
- **Primary Green:** `#087C59` (Warna utama identitas, tombol utama, navigasi)
- **Warm Orange:** `#FFA51F` (Aksen perhatian, highlight, lencana khusus)
- **Warm Cream:** `#FFF9F0` (Latar belakang lembut dan hangat)
- **White:** `#FFFFFF` (Latar belakang bersih)
- **Dark Neutral:** `#34433D` (Teks utama)
- **Secondary Text:** `#64736B` (Teks sekunder dan label)
- **Tipografi:** Plus Jakarta Sans & Inter

---

## 2. Fitur Utama (MVP) Sesuai PRD

### A. Fitur Publik & Landing Page
- **Hero Section:** Dilengkapi form pencarian cepat dengan pilihan kecamatan di Bandar Lampung dan kategori kebutuhan.
- **Kategori Kebutuhan:** Pembersihan Rumah, Juru Masak Harian, Pengasuhan Balita, Pendampingan Lansia, Cuci & Setrika Rapi, dan Perawatan Pekarangan.
- **Pencarian Berdasarkan Jarak (Location-Based Search):**
  - Menggunakan algoritma **PostGIS** (`geography(Point, 4326)`, `ST_DWithin`, `ST_Distance`).
  - Menghitung jarak garis lurus dalam kilometer ke lokasi pengguna (pilihan radius 1, 3, 5, 10, dan 20 km).
  - Pilihan kecamatan manual untuk 20 kecamatan di Bandar Lampung tanpa harus mengaktifkan GPS.
  - Opsi GPS perangkat dengan modal persetujuan izin (*location consent*).
  - **Prinsip Privasi Ketat:** Koordinat geografis presisi dan alamat rumah ART tidak pernah dipublikasikan.

### B. Halaman Pencarian ART (Marketplace)
- Filter kata kunci nama dan keterampilan.
- Filter kecamatan di Bandar Lampung.
- Filter batas radius jarak maksimal (1, 3, 5, 10, 20 km).
- Filter pengalaman kerja (1+, 3+, 5+ tahun).
- Filter sistem kerja (Pulang Pergi, Menginap, Full-time, Part-time).
- Filter gender dan status verifikasi KTP.
- Pengurutan: Jarak terdekat, pengalaman terbanyak, gaji terendah/tertinggi, terbaru.

### C. Halaman Detail Profil ART
- Foto, nama, status verifikasi KTP, status ketersediaan kerja (*Siap Bekerja*).
- Wilayah domisili umum (kecamatan), estimasi jarak garis lurus.
- Riwayat pengalaman kerja dan referensi majikan sebelumnya.
- Daftar keterampilan lengkap beserta tingkat kemahiran (*Dasar, Menengah, Ahli*).
- Tombol WhatsApp dengan pesan pembuka otomatis yang santun.
- Fitur penawaran lowongan dan pelaporan profil mencurigakan.

### D. Pencarian & Detail Lowongan Pekerjaan
- Daftar lowongan keluarga dengan filter kecamatan, jenis kerja, dan rentang gaji.
- Detail jam kerja, hari kerja, fasilitas (makan, transport, THR), dan kualifikasi.
- Formulir pengajuan lamaran dengan pengantar langsung ke keluarga.
- *Business Rule:* ART hanya dapat mengajukan 1 lamaran aktif per lowongan.

### E. Dashboard Keluarga
- Ringkasan lowongan aktif, total pelamar, dan jadwal wawancara.
- Manajemen lowongan: buat lowongan baru, edit, dan tutup lowongan.
- Manajemen pelamar: tinjau profil, ubah status (*Reviewing, Interview, Accepted, Rejected*), dan hubungi pelamar via WhatsApp.
- Pengajuan verifikasi identitas KTP penanggung jawab keluarga.

### F. Dashboard ART
- Ringkasan kelengkapan profil dan status verifikasi KTP.
- Pemantauan status lamaran (*Pending, Reviewing, Interview, Accepted, Rejected*).
- Kemampuan membatalkan (*withdraw*) lamaran yang masih berstatus pending.
- Pengaturan ketersediaan kerja (*Siap Bekerja / Sedang Bekerja*).
- Pengaturan persetujuan penggunaan lokasi jarak (*Location Consent*).
- Formulir pengajuan verifikasi KTP dan foto selfie.

### G. Dashboard Admin
- Statistik operasional: Total pengguna, total ART, total keluarga, lowongan aktif, antrean verifikasi, dan laporan masuk.
- Manajemen Verifikasi Identitas: Membuka dokumen KTP pemohon secara aman dari *private storage*, menyetujui, meminta revisi, atau menolak pengajuan.
- Moderasi Lowongan: Meninjau dan menonaktifkan lowongan bermasalah atau fiktif.
- Manajemen Laporan: Memproses aduan pengguna terkait penipuan, data palsu, atau penyalahgunaan kontak.
- Manajemen Pengguna: Melihat status akun dan detail kontak pengguna.
- *Aturan:* Tidak ada pendaftaran publik untuk admin.

---

## 3. Struktur Teknologi & Database

| Layer | Teknologi |
|---|---|
| Framework | Next.js (App Router, React 18, TypeScript) |
| Styling | Tailwind CSS dengan Brand Tokens ARTin |
| Ikonografi | Lucide React |
| Database | PostgreSQL melalui Supabase + PostGIS Extension |
| Autentikasi | Supabase Auth dengan Role-Based Access (Keluarga, ART, Admin) |
| Penyimpanan Berkas | Supabase Storage (Private bucket untuk dokumen identitas) |
| Engine Jarak | PostGIS Function `search_art_by_distance` & Haversine Formula |

### Skema Database & Migrasi
File migrasi SQL lengkap tersedia di folder `supabase/migrations/`:
- `20261124000001_initial_schema.sql`: Membuat ekstensi PostGIS, tabel `profiles`, `art_profiles`, `employer_profiles`, `skills`, `art_skills`, `work_experiences`, `job_vacancies`, `applications`, `verification_requests`, `reports`, `activity_logs`, fungsi PostGIS aman `search_art_by_distance`, serta seluruh aturan Row Level Security (RLS).
- `20261124000002_seed_skills.sql`: Seed data master keterampilan rumah tangga di Indonesia.

---

## 4. Cara Menjalankan Proyek Secara Lokal

### Prasyarat
- Node.js versi 18 atau yang lebih baru (rekomendasi Node.js 20+).
- npm atau pnpm.

### Langkah Instalasi
1. Masuk ke direktori proyek:
   ```bash
   cd "ART-IN"
   ```

2. Konfigurasi Environment Variables:
   Salin file `.env.example` menjadi `.env.local`:
   ```bash
   copy .env.example .env.local
   ```
   *(Opsional) Masukkan URL dan Anon Key proyek Supabase Anda jika ingin menghubungkan langsung ke instance cloud Supabase.*

3. Jalankan server pengembangan lokal:
   ```bash
   npm run dev
   ```
   Buka peramban di [http://localhost:3000](http://localhost:3000).

4. Menjalankan Build Produksi:
   ```bash
   npm run build
   npm run start
   ```

---

## 5. Akun Simulasi Cepat (Pengujian)

Pada halaman [http://localhost:3000/login](http://localhost:3000/login), tersedia tombol **Role Switcher** untuk langsung mencoba alur kerja ketiga role tanpa perlu menghafal kata sandi:
- **Keluarga (Ibu Maya Lestari):** Meninjau pelamar, mengundang wawancara, dan membuat lowongan.
- **Calon ART (Siti Rahayu):** Memantau status lamaran kerja, mengajukan lamaran baru, dan mengatur privasi lokasi.
- **Admin ARTin:** Memeriksa dokumen KTP pemohon, memoderasi lowongan kerja, dan menyelesaikan laporan pengguna.
