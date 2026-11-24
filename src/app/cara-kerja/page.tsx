import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, MapPin, Phone, Users, CheckCircle, ArrowRight } from 'lucide-react';

export default function CaraKerjaPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFCFA]">
      <Navbar />

      <main className="flex-1 py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary-light px-3 py-1 rounded-full">
              Panduan Lengkap
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-neutral-dark tracking-tight">
              Cara Kerja Platform ARTin
            </h1>
            <p className="text-sm sm:text-base text-neutral-secondary max-w-2xl mx-auto">
              Memahami bagaimana ARTin memfasilitasi pertemuan terpercaya antara keluarga pencari ART dan calon tenaga kerja di Bandar Lampung.
            </p>
          </div>

          {/* Dual Flow Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Flow 1: Keluarga */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-border shadow-card space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-neutral-border">
                <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold">
                  K
                </div>
                <div>
                  <h2 className="text-lg font-bold text-neutral-dark">Alur Bagi Keluarga</h2>
                  <p className="text-xs text-neutral-secondary">Mencari dan merekrut calon ART</p>
                </div>
              </div>

              <div className="space-y-5 text-xs text-neutral-secondary">
                <div className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary-light text-primary font-bold flex items-center justify-center shrink-0">1</span>
                  <div>
                    <h4 className="font-bold text-neutral-dark text-sm">Cari Berdasarkan Jarak & Kebutuhan</h4>
                    <p className="mt-1 leading-relaxed">Tentukan lokasi pekerjaan Anda di salah satu dari 20 kecamatan Bandar Lampung dan gunakan filter radius 1-20 km serta spesialisasi tugas (memasak, mengasuh anak, atau pembersihan).</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary-light text-primary font-bold flex items-center justify-center shrink-0">2</span>
                  <div>
                    <h4 className="font-bold text-neutral-dark text-sm">Pasang Lowongan Pekerjaan</h4>
                    <p className="mt-1 leading-relaxed">Jika belum menemukan kandidat yang pas, buat lowongan pekerjaan dengan detail jam kerja, hari kerja, dan tawaran gaji yang jelas.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary-light text-primary font-bold flex items-center justify-center shrink-0">3</span>
                  <div>
                    <h4 className="font-bold text-neutral-dark text-sm">Seleksi & Wawancara Mandiri</h4>
                    <p className="mt-1 leading-relaxed">Hubungi kandidat langsung via WhatsApp dengan pesan pembuka yang santun, jadwalkan wawancara di rumah atau tempat netral, dan sepakati perjanjian kerja secara mandiri.</p>
                  </div>
                </div>
              </div>

              <Link href="/cari-art" className="block pt-2">
                <Button variant="primary" size="md" className="w-full">
                  Mulai Cari ART Terdekat
                </Button>
              </Link>
            </div>

            {/* Flow 2: ART */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-border shadow-card space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-neutral-border">
                <div className="w-10 h-10 rounded-xl bg-accent text-neutral-dark flex items-center justify-center font-bold">
                  A
                </div>
                <div>
                  <h2 className="text-lg font-bold text-neutral-dark">Alur Bagi Calon ART</h2>
                  <p className="text-xs text-neutral-secondary">Mendapatkan lowongan kerja resmi</p>
                </div>
              </div>

              <div className="space-y-5 text-xs text-neutral-secondary">
                <div className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-accent-light text-amber-900 font-bold flex items-center justify-center shrink-0">1</span>
                  <div>
                    <h4 className="font-bold text-neutral-dark text-sm">Buat Profil Profesional</h4>
                    <p className="mt-1 leading-relaxed">Daftar secara gratis, cantumkan pengalaman kerja, keahlian khusus, preferensi jam kerja (pulang pergi / menginap), dan harapan gaji.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-accent-light text-amber-900 font-bold flex items-center justify-center shrink-0">2</span>
                  <div>
                    <h4 className="font-bold text-neutral-dark text-sm">Ajukan Verifikasi Identitas</h4>
                    <p className="mt-1 leading-relaxed">Unggah foto KTP asli dan selfie untuk diverifikasi oleh admin. Profil yang telah terverifikasi akan mendapatkan tanda centang hijau dan lebih diminati keluarga.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-accent-light text-amber-900 font-bold flex items-center justify-center shrink-0">3</span>
                  <div>
                    <h4 className="font-bold text-neutral-dark text-sm">Lamar Lowongan & Berkomunikasi</h4>
                    <p className="mt-1 leading-relaxed">Pilih lowongan di dekat domisili Anda, kirim lamaran, dan pantau status tanggapan dari keluarga pemberi kerja secara langsung melalui platform.</p>
                  </div>
                </div>
              </div>

              <Link href="/register" className="block pt-2">
                <Button variant="accent" size="md" className="w-full font-bold">
                  Daftar Menjadi ART
                </Button>
              </Link>
            </div>
          </div>

          {/* Privacy & Safety Guarantee */}
          <div className="bg-cream-100 rounded-3xl p-6 sm:p-8 border border-accent-border/80 space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <ShieldCheck className="w-6 h-6" />
              <h3 className="text-lg font-bold text-neutral-dark">Prinsip Keamanan & Privasi Data</h3>
            </div>
            <p className="text-xs sm:text-sm text-neutral-secondary leading-relaxed">
              Demi keamanan seluruh pengguna, ARTin tidak membagikan koordinat presisi atau alamat rumah ART di halaman publik. Estimasi jarak yang ditampilkan dihitung secara matematis menggunakan PostGIS berdasarkan titik tengah kecamatan atau persetujuan lokasi. Kesepakatan kerja, pemeriksaan fisik, dan pembayaran gaji dilakukan secara langsung dan transparan antara keluarga dan ART.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
