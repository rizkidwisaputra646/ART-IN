import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, MapPin, Users, HeartHandshake, Sparkles } from 'lucide-react';
import { APP_CONFIG } from '@/lib/constants';

export default function TentangPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFCFA]">
      <Navbar />

      <main className="flex-1 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary-light px-3 py-1 rounded-full">
              Profil Inisiatif
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-neutral-dark tracking-tight">
              Tentang ARTin Bandar Lampung
            </h1>
            <p className="text-sm sm:text-base text-neutral-secondary max-w-2xl mx-auto leading-relaxed">
              Membangun jembatan kepercayaan antara keluarga yang membutuhkan tenaga asisten rumah tangga dan para pekerja profesional di Kota Bandar Lampung.
            </p>
          </div>

          {/* Story & Vision */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-border shadow-card space-y-6 text-sm text-neutral-secondary leading-relaxed">
            <h2 className="text-xl font-bold text-neutral-dark">Latar Belakang</h2>
            <p>
              Mencari Asisten Rumah Tangga (ART) yang jujur, terampil, dan bertempat tinggal dekat dengan lokasi rumah seringkali menjadi tantangan tersendiri bagi keluarga modern di Bandar Lampung. Di sisi lain, banyak calon ART yang memiliki etos kerja baik kesulitan mendapatkan informasi lowongan pekerjaan yang jelas, adil, dan transparan mengenai beban kerja serta kompensasi.
            </p>
            <p>
              <strong>ARTin</strong> hadir sebagai platform independen yang memfasilitasi pencarian berbasis keterampilan, pengalaman, dan estimasi jarak terdekat di 20 kecamatan Bandar Lampung. Dengan sistem moderasi data dan verifikasi identitas resmi, ARTin berupaya mewujudkan ekosistem kerja rumah tangga yang bermartabat, saling menghormati, dan aman bagi kedua belah pihak.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-neutral-border">
              <div className="p-5 rounded-2xl bg-[#FAFCFA] border border-neutral-border space-y-2">
                <h3 className="font-bold text-neutral-dark flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  Misi Bagi Keluarga
                </h3>
                <p className="text-xs">
                  Menyediakan akses mudah ke profil kandidat ART terverifikasi dengan informasi keterampilan, pengalaman riil, dan perkiraan jarak yang realistis.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAFCFA] border border-neutral-border space-y-2">
                <h3 className="font-bold text-neutral-dark flex items-center gap-2">
                  <HeartHandshake className="w-5 h-5 text-accent" />
                  Misi Bagi Pekerja ART
                </h3>
                <p className="text-xs">
                  Membuka peluang kerja layak dengan kejelasan jam kerja, perlindungan data pribadi, dan kesempatan menunjukkan keterampilan profesional secara bermartabat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
