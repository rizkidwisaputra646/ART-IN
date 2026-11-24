import React from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { ShieldCheck } from 'lucide-react';

export default function KebijakanPrivasiPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFCFA]">
      <Navbar />
      <main className="flex-1 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-neutral-dark">Kebijakan Privasi ARTin</h1>
            <p className="text-xs text-neutral-secondary">Terakhir diperbarui: 24 November 2026</p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-border shadow-card space-y-6 text-sm text-neutral-secondary leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-neutral-dark">1. Perlindungan Lokasi & Koordinat Pribadi</h2>
              <p>
                ARTin menerapkan prinsip privasi yang sangat ketat. Alamat rumah presisi dan titik koordinat geografis (latitude/longitude) kandidat ART <strong>tidak pernah dipublikasikan</strong> secara terbuka.
              </p>
              <p>
                Fitur pencarian berdasarkan jarak dihitung di sisi server secara aman (menggunakan PostGIS). Data yang ditampilkan kepada pencari kerja atau pemberi kerja hanya berupa estimasi jarak garis lurus dalam kilometer (misalnya "2.5 km") dan nama kecamatan domisili umum (misalnya "Kecamatan Kedaton").
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-neutral-dark">2. Dokumen Verifikasi Identitas (KTP & Foto)</h2>
              <p>
                Foto kartu identitas (KTP) dan foto diri yang diunggah untuk proses verifikasi disimpan di dalam penyimpanan terproteksi (private storage). Dokumen ini hanya dapat diakses oleh admin resmi ARTin yang bertugas melakukan pemeriksaan dan tidak dapat diakses oleh publik maupun pengguna lain.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-neutral-dark">3. Kontak WhatsApp & Komunikasi</h2>
              <p>
                Nomor kontak WhatsApp hanya ditampilkan kepada pengguna terdaftar yang memiliki kepentingan perekrutan yang sah, dan pengguna dapat mengatur ketersediaan status kontak mereka setiap saat melalui dashboard.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
