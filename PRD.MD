# PRODUCT REQUIREMENTS DOCUMENT (PRD)
## Sistem Penghubung Orang Tua dan Asisten Rumah Tangga (ART)

**Versi:** 1.0  
**Jenis Produk:** Web Application  
**Wilayah Operasional:** Kota Bandar Lampung  
**Status:** Draft Pengembangan

---

# 1. Product Overview

## 1.1 Deskripsi Produk

Sistem Penghubung Orang Tua dan ART merupakan platform digital yang dirancang untuk mempertemukan keluarga yang membutuhkan Asisten Rumah Tangga (ART) dengan calon ART yang sedang mencari pekerjaan di Kota Bandar Lampung.

Platform menyediakan dua mekanisme utama, yaitu pencarian calon ART berdasarkan profil dan keterampilan, serta pencarian pekerjaan melalui informasi lowongan yang dipublikasikan oleh keluarga.

Setiap pengguna dapat membuat akun sesuai perannya. ART dapat menampilkan profil profesional dan mengajukan lamaran pekerjaan, sedangkan keluarga dapat membuat lowongan, mencari kandidat, dan melakukan seleksi awal.

Platform dilengkapi sistem verifikasi dan moderasi oleh admin untuk membantu menjaga kualitas informasi serta mengurangi risiko penyalahgunaan.

## 1.2 Product Vision

Menjadi platform pencarian dan perekrutan ART yang sederhana, informatif, dan terpercaya dengan fokus awal pada masyarakat Kota Bandar Lampung.

## 1.3 Tujuan Produk

1. Mempermudah keluarga menemukan ART berdasarkan kebutuhan pekerjaan.
2. Membantu ART memperoleh informasi lowongan yang jelas dan terstruktur.
3. Menyediakan profil ART yang memuat identitas, keterampilan, pengalaman, lokasi, dan harapan gaji.
4. Menyediakan sistem pengajuan lamaran dan pengelolaan kandidat.
5. Meningkatkan kepercayaan melalui pemeriksaan identitas dan moderasi admin.
6. Memusatkan informasi pencarian ART dan lowongan dalam satu platform.

---

# 2. Target Pengguna dan User Roles

Sistem memiliki tiga role utama.

## 2.1 Keluarga (Employer)

Pengguna yang membutuhkan tenaga ART untuk membantu pekerjaan rumah tangga.

Kebutuhan:
- Mencari ART sesuai kebutuhan.
- Melihat profil dan pengalaman ART.
- Membuat lowongan pekerjaan.
- Menerima dan meninjau lamaran.
- Menghubungi kandidat.
- Melakukan seleksi dan wawancara.

## 2.2 ART (Job Seeker)

Pengguna yang ingin mencari pekerjaan sebagai asisten rumah tangga.

Kebutuhan:
- Membuat profil profesional.
- Menampilkan keterampilan dan pengalaman.
- Menentukan harapan gaji.
- Mencari lowongan pekerjaan.
- Mengajukan lamaran.
- Memantau status lamaran.
- Mengelola ketersediaan kerja.

## 2.3 Admin (Platform Administrator)

Pengelola yang bertanggung jawab atas operasional platform.

Kebutuhan:
- Memantau pengguna.
- Memeriksa identitas dan data profil.
- Memoderasi lowongan.
- Menangani laporan pengguna.
- Mengelola status verifikasi.
- Menonaktifkan akun yang melanggar ketentuan.
- Memantau statistik platform.

---

# 3. Product Scope

## 3.1 Fitur Utama (MVP)

Versi pertama aplikasi difokuskan pada fitur berikut:

1. Registrasi dan autentikasi pengguna.
2. Manajemen profil ART.
3. Manajemen profil keluarga.
4. Pencarian dan filter ART.
5. Manajemen lowongan pekerjaan.
6. Pencarian lowongan.
7. Pengajuan lamaran.
8. Pengelolaan status lamaran.
9. Verifikasi identitas oleh admin.
10. Dashboard admin.
11. Sistem pelaporan pengguna.
12. Pengelolaan akun dan status ketersediaan.

## 3.2 Di Luar Scope MVP

Fitur berikut belum menjadi prioritas versi pertama:

- Pembayaran dan transaksi digital.
- Sistem komisi atau potongan gaji.
- Chat internal real-time.
- Video interview.
- Pelacakan lokasi secara real-time.
- Rekomendasi kandidat menggunakan AI.
- Kontrak kerja elektronik.
- Aplikasi Android dan iOS khusus.
- Sistem rating dan ulasan publik.

---

# 4. Functional Requirements

## 4.1 Authentication & Account Management

Fitur:
- Registrasi menggunakan nama, email, nomor telepon, dan password.
- Pengguna memilih role saat pendaftaran: Keluarga atau ART.
- Login dan logout.
- Lupa password dan reset password.
- Validasi email.
- Proteksi halaman berdasarkan role.
- Admin memiliki akun yang dibuat atau diberikan oleh pengelola, bukan melalui registrasi publik.
- Pengguna dapat mengubah informasi akun.

Ketentuan:
- Password harus disimpan menggunakan mekanisme hashing yang aman.
- Pengguna tidak dapat mengubah role secara langsung.
- Pengguna yang belum menyelesaikan persyaratan verifikasi tidak dapat menggunakan fitur yang mensyaratkan verifikasi.

## 4.2 ART Profile Management

ART dapat membuat dan mengelola profil profesional.

Data profil:

**Informasi pribadi**
- Nama lengkap.
- Foto profil.
- Jenis kelamin.
- Usia atau tanggal lahir.
- Nomor telepon.
- Domisili.
- Alamat umum atau kecamatan.

**Informasi pekerjaan**
- Deskripsi singkat diri.
- Keterampilan.
- Pengalaman kerja.
- Jenis pekerjaan yang diminati.
- Harapan gaji.
- Ketersediaan bekerja.
- Pilihan jam atau sistem kerja.

**Portofolio dan pengalaman**
- Riwayat pekerjaan sebelumnya.
- Deskripsi pengalaman.
- Referensi kerja jika tersedia dan telah memperoleh persetujuan pihak terkait.

Ketentuan:
- ART dapat mengubah profil.
- ART dapat menentukan status ketersediaan kerja.
- ART dapat mengunggah foto profil.
- ART dapat mengajukan verifikasi identitas.
- Profil yang belum disetujui dapat memiliki pembatasan visibilitas.
- Informasi pribadi sensitif tidak ditampilkan secara publik.

## 4.3 Employer Profile Management

Keluarga dapat membuat profil pemberi kerja.

Data profil:
- Nama penanggung jawab.
- Foto profil (opsional).
- Nomor telepon.
- Email.
- Domisili.
- Kecamatan.
- Alamat pekerjaan yang diperlukan untuk proses perekrutan.
- Status verifikasi.

Ketentuan:
- Keluarga dapat memperbarui informasi.
- Keluarga dapat mengajukan verifikasi.
- Informasi alamat lengkap hanya dapat diakses oleh pihak yang memiliki kepentingan dan izin yang sesuai.

## 4.4 ART Search

Keluarga dapat mencari calon ART berdasarkan kriteria tertentu.

Fitur pencarian:
- Pencarian berdasarkan nama atau kata kunci.
- Filter berdasarkan kecamatan.
- Filter berdasarkan jenis kelamin.
- Filter berdasarkan pengalaman.
- Filter berdasarkan keterampilan.
- Filter berdasarkan harapan gaji.
- Filter berdasarkan ketersediaan.
- Filter berdasarkan status verifikasi.

Informasi pada kartu ART:
- Foto profil.
- Nama.
- Domisili.
- Keterampilan utama.
- Pengalaman kerja.
- Harapan gaji.
- Status ketersediaan.
- Status verifikasi.

Pengguna dapat membuka halaman detail profil untuk melihat informasi lebih lanjut.

### 4.4.1 Location-Based Search (Pencarian Berdasarkan Jarak)

Sistem menyediakan fitur pencarian calon ART berdasarkan jarak antara lokasi pekerjaan keluarga dengan domisili ART.

**Fitur utama:**
- Pencarian ART berdasarkan lokasi pekerjaan.
- Menampilkan estimasi jarak ART dari lokasi pekerjaan dalam kilometer.
- Mengurutkan hasil pencarian berdasarkan jarak terdekat.
- Filter jarak maksimal, misalnya 1 km, 3 km, 5 km, 10 km, dan 20 km.
- Menggabungkan filter jarak dengan keterampilan, pengalaman, harapan gaji, dan ketersediaan kerja.
- Menampilkan informasi kecamatan atau area domisili ART.

**Alur penggunaan:**
1. Keluarga menentukan lokasi pekerjaan.
2. Sistem mengambil titik koordinat lokasi pekerjaan.
3. Sistem membandingkan koordinat tersebut dengan lokasi domisili ART.
4. Sistem menghitung estimasi jarak.
5. Sistem menampilkan daftar ART berdasarkan jarak terdekat.
6. Keluarga dapat mengatur batas maksimal jarak pencarian.

**Ketentuan:**
- Lokasi rumah ART tidak ditampilkan secara publik.
- ART harus memberikan persetujuan penggunaan data lokasi untuk pencarian.
- Lokasi yang ditampilkan kepada keluarga hanya berupa estimasi jarak dan area domisili.
- Pengguna dapat memperbarui lokasi domisili.
- Pencarian tetap dapat dilakukan tanpa mengaktifkan GPS, melalui pemilihan lokasi secara manual.

## 4.5 Job Vacancy Management

Keluarga dapat membuat dan mengelola lowongan ART.

Data lowongan:

**Informasi pekerjaan**
- Judul lowongan.
- Deskripsi pekerjaan.
- Jenis pekerjaan.
- Lokasi pekerjaan.
- Kecamatan.
- Jumlah tenaga kerja yang dibutuhkan.

**Informasi pekerjaan dan kompensasi**
- Gaji atau rentang gaji.
- Sistem pembayaran.
- Jam kerja.
- Hari kerja.
- Fasilitas yang diberikan.
- Persyaratan kandidat.
- Tanggal mulai bekerja.

**Status lowongan**
- Draft.
- Menunggu moderasi (jika moderasi diwajibkan).
- Aktif.
- Ditutup.
- Ditolak.

Ketentuan:
- Keluarga dapat membuat lowongan.
- Keluarga dapat mengedit lowongan.
- Keluarga dapat menutup lowongan.
- Lowongan yang sudah ditutup tidak dapat menerima lamaran baru.
- Lowongan harus memuat informasi pekerjaan dan kompensasi yang cukup jelas.
- Admin dapat memoderasi lowongan yang dilaporkan atau terindikasi melanggar aturan.

## 4.6 Job Search

ART dapat mencari lowongan berdasarkan:
- Kata kunci.
- Kecamatan atau lokasi.
- Jenis pekerjaan.
- Rentang gaji.
- Sistem kerja.
- Jam kerja.
- Status lowongan.

Kartu lowongan menampilkan:
- Judul pekerjaan.
- Nama pemberi kerja.
- Lokasi.
- Gaji.
- Jenis pekerjaan.
- Jam kerja.
- Tanggal publikasi.
- Status verifikasi pemberi kerja.

## 4.7 Application Management

ART dapat mengajukan lamaran terhadap lowongan yang tersedia.

Ketentuan:
- Satu ART hanya dapat memiliki satu lamaran aktif untuk satu lowongan.
- ART dapat melihat riwayat lamaran.
- ART dapat membatalkan lamaran selama belum diterima atau diproses ke tahap yang tidak memungkinkan pembatalan.
- Keluarga dapat melihat daftar pelamar.
- Keluarga dapat melihat profil kandidat.
- Keluarga dapat memperbarui status lamaran.

Status lamaran:
1. Pending: lamaran baru diterima.
2. Reviewing: sedang ditinjau keluarga.
3. Interview: kandidat diundang wawancara.
4. Accepted: lamaran diterima.
5. Rejected: lamaran ditolak.
6. Withdrawn: lamaran dibatalkan ART.

Setiap perubahan status harus tercatat dan dapat dilihat oleh pihak terkait.

## 4.8 Contact & Communication

Sistem menyediakan sarana agar keluarga dan ART dapat berkomunikasi.

MVP:
- Tombol kontak melalui WhatsApp.
- Nomor kontak ditampilkan berdasarkan persetujuan pengguna.
- Kontak hanya tersedia sesuai kebijakan privasi dan status akun.
- Sistem dapat menyediakan template pesan awal.

Contoh pesan:
"Halo, saya melihat profil Anda melalui platform pencarian ART. Apakah saat ini masih tersedia untuk bekerja?"

Chat internal belum termasuk MVP.

## 4.9 Verification System

Admin bertanggung jawab melakukan pemeriksaan data pengguna.

Jenis pemeriksaan:
- Identitas pengguna.
- Kelengkapan profil.
- Validitas informasi kontak.
- Informasi pekerjaan atau referensi jika diperlukan.

Status verifikasi:
- Unverified.
- Pending.
- Verified.
- Rejected.
- Requires Revision.

Alur:
1. Pengguna mengirimkan data verifikasi.
2. Admin menerima pengajuan.
3. Admin memeriksa dokumen dan informasi.
4. Admin menyetujui, menolak, atau meminta perbaikan.
5. Pengguna mendapatkan informasi hasil pemeriksaan.

Ketentuan keamanan:
- Dokumen identitas disimpan dalam private storage.
- Dokumen hanya dapat diakses admin yang berwenang.
- Dokumen tidak boleh tersedia melalui URL publik.
- Sistem menyimpan riwayat tindakan verifikasi.
- Status Verified hanya berarti pemeriksaan sesuai prosedur telah dilakukan, bukan jaminan mutlak bahwa pengguna bebas risiko.

## 4.10 Reporting System

Pengguna dapat melaporkan:
- Profil mencurigakan.
- Lowongan palsu.
- Informasi tidak sesuai.
- Penipuan.
- Penyalahgunaan kontak.
- Pelanggaran ketentuan platform.

Admin dapat:
- Melihat laporan.
- Memeriksa bukti.
- Mengubah status laporan.
- Memberikan peringatan.
- Menonaktifkan konten atau akun sesuai hasil pemeriksaan.

Status laporan:
- Open.
- Reviewing.
- Resolved.
- Rejected.

---

# 5. Admin Dashboard

Admin memiliki dashboard khusus untuk mengelola operasional platform.

## 5.1 Dashboard Overview

Menampilkan:
- Total pengguna.
- Total ART.
- Total keluarga.
- Total lowongan aktif.
- Total lamaran.
- Pengajuan verifikasi yang menunggu pemeriksaan.
- Laporan yang belum ditangani.

## 5.2 User Management

Admin dapat:
- Melihat daftar pengguna.
- Mencari pengguna.
- Memfilter berdasarkan role.
- Melihat detail akun.
- Melihat status verifikasi.
- Menonaktifkan akun.
- Mengaktifkan kembali akun jika memenuhi ketentuan.

## 5.3 Verification Management

Admin dapat:
- Melihat daftar pengajuan verifikasi.
- Membuka dokumen identitas secara aman.
- Memeriksa informasi pengguna.
- Menyetujui verifikasi.
- Menolak pengajuan.
- Meminta perbaikan data.
- Melihat riwayat pemeriksaan.

## 5.4 Job Management

Admin dapat:
- Melihat semua lowongan.
- Memfilter lowongan.
- Meninjau lowongan yang dilaporkan.
- Menonaktifkan lowongan bermasalah.
- Melihat riwayat perubahan status.

## 5.5 Report Management

Admin dapat:
- Melihat seluruh laporan.
- Melihat bukti laporan.
- Memproses laporan.
- Memberikan tindakan terhadap akun atau konten.
- Menyimpan catatan tindak lanjut.

---

# 6. User Flow

## 6.1 Family Flow

1. Pengguna membuka website.
2. Melakukan registrasi sebagai keluarga.
3. Login.
4. Melengkapi profil.
5. Melakukan verifikasi jika diperlukan.
6. Masuk ke dashboard keluarga.
7. Memilih pencarian ART atau membuat lowongan.
8. Melihat profil kandidat atau menerima lamaran.
9. Memilih kandidat.
10. Menghubungi kandidat.
11. Melakukan wawancara.
12. Membuat kesepakatan kerja secara langsung.

## 6.2 ART Flow

1. Pengguna membuka website.
2. Melakukan registrasi sebagai ART.
3. Login.
4. Melengkapi profil profesional.
5. Mengajukan verifikasi identitas.
6. Menunggu pemeriksaan admin.
7. Mencari lowongan.
8. Melihat detail pekerjaan.
9. Mengajukan lamaran.
10. Memantau status lamaran.
11. Dihubungi keluarga jika lolos seleksi awal.
12. Mengikuti wawancara dan proses perekrutan.

## 6.3 Admin Flow

1. Admin login.
2. Membuka dashboard.
3. Memeriksa pengajuan verifikasi.
4. Memeriksa profil dan dokumen.
5. Menyetujui atau menolak pengajuan.
6. Memantau laporan.
7. Melakukan moderasi.
8. Mengelola akun yang melanggar ketentuan.

---

# 7. UI/UX Requirements

## 7.1 Design Direction

Arah desain:
- Modern.
- Minimalis.
- Profesional.
- Ramah pengguna.
- Tidak terlalu padat.
- Mobile-first.
- Mudah dipahami pengguna nonteknis.

## 7.2 Public Website

Halaman:
1. Landing Page.
2. Tentang Platform.
3. Cari ART.
4. Daftar Lowongan.
5. Detail Profil ART.
6. Detail Lowongan.
7. Login.
8. Registrasi.

## 7.3 Family Dashboard

Halaman:
1. Dashboard.
2. Profil Keluarga.
3. Cari ART.
4. Detail ART.
5. Lowongan Saya.
6. Buat Lowongan.
7. Pelamar.
8. Detail Lamaran.
9. Pengaturan Akun.

## 7.4 ART Dashboard

Halaman:
1. Dashboard.
2. Profil Saya.
3. Edit Profil.
4. Verifikasi Identitas.
5. Cari Lowongan.
6. Detail Lowongan.
7. Lamaran Saya.
8. Status Lamaran.
9. Pengaturan Akun.

## 7.5 Admin Dashboard

Halaman:
1. Dashboard Overview.
2. Manajemen Pengguna.
3. Verifikasi Identitas.
4. Manajemen Lowongan.
5. Manajemen Laporan.
6. Riwayat Aktivitas.
7. Pengaturan Admin.

---

# 8. Technical Requirements

## 8.1 Technology Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js |
| Programming Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui (opsional) |
| Backend | Next.js Server Actions / Route Handlers |
| Database | PostgreSQL |
| Backend-as-a-Service | Supabase |
| Authentication | Supabase Auth |
| File Storage | Supabase Storage |
| Database Security | PostgreSQL Row Level Security |
| Deployment | Vercel |
| Version Control | GitHub |

## 8.2 Database Entities

Entitas utama yang diperlukan:

1. users
2. art_profiles
3. employer_profiles
4. verification_requests
5. skills
6. art_skills
7. work_experiences
8. job_vacancies
9. applications
10. reports
11. notifications
12. activity_logs

Relasi utama:
- Satu pengguna memiliki satu role utama.
- Satu akun ART memiliki satu profil ART.
- Satu akun keluarga memiliki satu profil keluarga.
- Satu profil ART dapat memiliki banyak keterampilan.
- Satu profil ART dapat memiliki banyak pengalaman kerja.
- Satu keluarga dapat membuat banyak lowongan.
- Satu lowongan dapat menerima banyak lamaran.
- Satu ART dapat mengajukan banyak lamaran.
- Satu pengguna dapat membuat banyak laporan.
- Setiap tindakan administratif penting dicatat dalam activity_logs.

## 8.3 Security Requirements

- Menggunakan Supabase Row Level Security.
- Menerapkan validasi pada sisi server.
- Melindungi halaman berdasarkan role.
- Tidak mengekspos service role key ke frontend.
- Menggunakan private bucket untuk dokumen identitas.
- Membatasi akses terhadap data pribadi.
- Melakukan validasi file upload berdasarkan tipe dan ukuran.
- Mencatat tindakan penting admin.
- Menerapkan proteksi terhadap akses tidak sah.
- Menyediakan kebijakan privasi dan persetujuan pemrosesan data.

---

# 9. Business Rules

1. Pengguna hanya dapat memiliki satu role utama dalam satu akun.
2. Registrasi admin tidak tersedia untuk publik.
3. ART harus melengkapi informasi wajib sebelum dapat mengajukan lamaran.
4. Keluarga harus melengkapi informasi wajib sebelum dapat mempublikasikan lowongan.
5. Lowongan yang ditutup tidak dapat menerima lamaran baru.
6. ART tidak dapat melamar lowongan yang sama berulang kali dengan lamaran aktif.
7. Pengguna hanya dapat mengubah data milik akunnya sendiri.
8. Admin memiliki akses pengelolaan sesuai kewenangan.
9. Dokumen verifikasi tidak dapat dilihat oleh pengguna lain.
10. Status verifikasi tidak boleh diberikan otomatis hanya karena pengguna mengunggah dokumen.
11. Kontak pribadi hanya boleh dibagikan sesuai persetujuan pengguna dan kebijakan platform.
12. Platform tidak menjamin bahwa seluruh pengguna atau informasi pekerjaan bebas risiko.

---

# 10. Non-Functional Requirements

## Performance
- Halaman utama harus dimuat secara efisien.
- Pencarian menggunakan pagination.
- Gambar profil harus dioptimalkan.
- Query database harus menghindari pengambilan data yang tidak diperlukan.

## Reliability
- Sistem harus menangani kegagalan jaringan dan proses penyimpanan.
- Perubahan status lamaran harus tersimpan secara konsisten.
- Sistem menyediakan penanganan error yang jelas.

## Usability
- Navigasi harus konsisten.
- Formulir harus memiliki validasi.
- Tampilan harus responsif.
- Status proses harus mudah dipahami.

## Security & Privacy
- Akses database menggunakan kebijakan RLS.
- Dokumen identitas disimpan secara privat.
- Data pribadi tidak ditampilkan secara berlebihan.
- Proses penghapusan akun dan pengelolaan data mengikuti kebijakan retensi yang ditetapkan.

---

# 11. Acceptance Criteria

Fitur MVP dianggap selesai apabila:

1. Pengguna dapat mendaftar dan login sesuai role.
2. Pengguna tidak dapat mengakses dashboard role lain tanpa izin.
3. ART dapat membuat dan memperbarui profil.
4. Keluarga dapat membuat dan memperbarui lowongan.
5. Keluarga dapat mencari serta memfilter ART.
6. ART dapat mencari dan memfilter lowongan.
7. ART dapat mengajukan lamaran.
8. Keluarga dapat melihat dan mengelola lamaran.
9. Perubahan status lamaran tersimpan dan dapat dilihat pihak terkait.
10. Admin dapat melakukan pemeriksaan verifikasi.
11. Dokumen identitas tidak dapat diakses publik.
12. Admin dapat mengelola laporan.
13. Sistem dapat digunakan melalui perangkat mobile dan desktop.
14. Seluruh hak akses database telah diuji melalui RLS.

---

# 12. Development Roadmap

## Phase 1 — Foundation
- Setup Next.js dan TypeScript.
- Setup Tailwind CSS.
- Setup Supabase.
- Setup database.
- Setup autentikasi.
- Implementasi role dan proteksi akses.

## Phase 2 — User Management
- Registrasi keluarga dan ART.
- Login.
- Profil keluarga.
- Profil ART.
- Upload foto dan dokumen.

## Phase 3 — Job & Search
- Pembuatan lowongan.
- Pengelolaan lowongan.
- Pencarian ART.
- Pencarian lowongan.
- Filter dan pagination.

## Phase 4 — Application System
- Pengajuan lamaran.
- Daftar pelamar.
- Pengelolaan status lamaran.
- Kontak WhatsApp.

## Phase 5 — Admin Dashboard
- Dashboard statistik.
- Manajemen pengguna.
- Verifikasi identitas.
- Moderasi lowongan.
- Manajemen laporan.

## Phase 6 — Testing & Deployment
- Pengujian fungsional.
- Pengujian hak akses.
- Pengujian keamanan dasar.
- Pengujian responsivitas.
- Perbaikan bug.
- Deployment ke Vercel.

---

# 13. Success Metrics

Keberhasilan MVP dievaluasi berdasarkan:

1. Pengguna berhasil melakukan registrasi dan login.
2. ART berhasil melengkapi profil.
3. Keluarga berhasil membuat lowongan.
4. Pengguna dapat menemukan informasi yang relevan melalui pencarian.
5. Pengajuan lamaran dapat diproses tanpa kesalahan.
6. Admin dapat menyelesaikan proses verifikasi.
7. Tidak terdapat akses tidak sah terhadap dokumen identitas.
8. Pengguna dapat menyelesaikan alur utama melalui perangkat mobile.

Target kuantitatif pengguna dan tingkat keberhasilan ditentukan setelah uji coba awal.

---

# 14. Future Development

Fitur yang dapat dipertimbangkan setelah MVP berhasil diuji:

- Chat internal.
- Notifikasi WhatsApp otomatis.
- Rating dan ulasan setelah hubungan kerja selesai.
- Riwayat pekerjaan ART.
- Sistem rekomendasi kandidat.
- Verifikasi referensi kerja.
- Fitur favorit atau bookmark kandidat.
- Pengembangan aplikasi mobile.
- Perluasan wilayah operasional di luar Bandar Lampung.

---

# 15. Project Constraints & Assumptions

## Constraints
- Pengembangan awal difokuskan pada Kota Bandar Lampung.
- Sistem berbentuk website responsif.
- Pengembangan MVP mengutamakan layanan gratis atau biaya rendah.
- Tim memiliki keterbatasan waktu dan sumber daya.
- Pemeriksaan identitas dilakukan oleh admin, bukan sistem AI otomatis.

## Assumptions
- Pengguna memiliki akses internet.
- ART dan keluarga bersedia mendaftar serta mengisi informasi yang diperlukan.
- Admin tersedia untuk memeriksa pengajuan verifikasi.
- Pengguna bertanggung jawab terhadap kebenaran informasi yang diberikan.
- Wawancara dan kesepakatan kerja dilakukan langsung oleh keluarga dan calon ART.

---

**END OF DOCUMENT**

Dokumen ini merupakan acuan awal pengembangan MVP dan dapat diperbarui berdasarkan hasil wawancara, validasi kebutuhan pengguna, serta evaluasi tim pengembang.