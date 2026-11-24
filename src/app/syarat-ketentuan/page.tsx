import React from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';

export default function SyaratKetentuanPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFCFA]">
      <Navbar />
      <main className="flex-1 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-neutral-dark">Syarat & Ketentuan Penggunaan ARTin</h1>
            <p className="text-xs text-neutral-secondary">Wilayah Operasional: Kota Bandar Lampung</p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-border shadow-card space-y-6 text-sm text-neutral-secondary leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-neutral-dark">1. Peran Platform</h2>
              <p>
                ARTin merupakan platform direktori dan penghubung informasi antara keluarga pencari asisten rumah tangga dan calon ART di Kota Bandar Lampung. ARTin bukan merupakan yayasan penyalur atau majikan, dan tidak memotong gaji pekerja rumah tangga.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-neutral-dark">2. Tanggung Jawab Pengguna</h2>
              <p>
                Pengguna bertanggung jawab atas kebenaran data profil yang diunggah. Pengguna dilarang mempublikasikan lowongan palsu, memungut biaya pendaftaran kepada calon ART, atau menyalahgunakan kontak untuk tindakan penipuan.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-neutral-dark">3. Kesepakatan Kerja & Wawancara</h2>
              <p>
                Seluruh proses wawancara, pemeriksaan latar belakang lebih mendalam, dan kesepakatan kontrak kerja dilakukan secara langsung antara keluarga dan kandidat ART. Pengguna dianjurkan untuk selalu mengonfirmasi identitas fisik saat wawancara tatap muka.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
