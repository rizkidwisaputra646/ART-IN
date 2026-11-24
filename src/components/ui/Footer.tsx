import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, ShieldCheck, HeartHandshake } from 'lucide-react';
import { APP_CONFIG, BANDAR_LAMPUNG_DISTRICTS } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="bg-cream-100 border-t border-accent-border/60 text-neutral-dark pt-14 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-primary/20 bg-white">
                <Image
                  src="/logo.png"
                  alt="Logo ARTin"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-2xl font-black text-primary font-sans">
                ART<span className="text-accent">in</span>
              </span>
            </Link>
            <p className="text-sm text-neutral-secondary leading-relaxed">
              Platform terpercaya penghubung keluarga dan Asisten Rumah Tangga di Kota Bandar Lampung. Memudahkan pencarian kandidat berdasarkan keterampilan, pengalaman, dan estimasi jarak terdekat.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-primary bg-primary-light/80 px-3 py-1.5 rounded-lg w-fit">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>Fokus Wilayah Kota Bandar Lampung</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-secondary mb-4">
              Jelajahi Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/cari-art" className="text-neutral-dark hover:text-primary transition-colors font-medium">
                  Cari Asisten Rumah Tangga
                </Link>
              </li>
              <li>
                <Link href="/lowongan" className="text-neutral-dark hover:text-primary transition-colors font-medium">
                  Daftar Lowongan Kerja
                </Link>
              </li>
              <li>
                <Link href="/cara-kerja" className="text-neutral-dark hover:text-primary transition-colors font-medium">
                  Cara Kerja Platform
                </Link>
              </li>
              <li>
                <Link href="/tentang" className="text-neutral-dark hover:text-primary transition-colors font-medium">
                  Tentang ARTin
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-neutral-dark hover:text-primary transition-colors font-medium">
                  Daftar Sebagai Pencari Kerja
                </Link>
              </li>
            </ul>
          </div>

          {/* Districts Coverage */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-secondary mb-4">
              Kecamatan Bandar Lampung
            </h4>
            <div className="grid grid-cols-2 gap-1.5 text-xs text-neutral-secondary">
              {BANDAR_LAMPUNG_DISTRICTS.slice(0, 10).map((d) => (
                <Link
                  key={d.name}
                  href={`/cari-art?kecamatan=${encodeURIComponent(d.name)}`}
                  className="hover:text-primary transition-colors"
                >
                  • {d.name}
                </Link>
              ))}
            </div>
            <Link
              href="/cari-art"
              className="inline-block mt-3 text-xs font-semibold text-primary hover:underline"
            >
              Lihat 20 Kecamatan Lainnya &rarr;
            </Link>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-secondary mb-4">
              Layanan & Bantuan
            </h4>
            <div className="space-y-3 text-sm text-neutral-secondary">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>Kota Bandar Lampung, Provinsi Lampung, Indonesia</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span>+62 812-3456-7890 (Admin WhatsApp)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span>support@artin.id</span>
              </div>
            </div>

            <div className="mt-5 p-3.5 bg-white rounded-xl border border-neutral-border text-xs text-neutral-secondary">
              <span className="font-semibold text-neutral-dark block mb-1">
                Jaminan Privasi Data
              </span>
              Koordinat pribadi dan alamat rumah ART tidak ditampilkan secara publik demi keamanan bersama.
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-border/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-secondary">
          <p>© {new Date().getFullYear()} ARTin Platform. Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-6">
            <Link href="/kebijakan-privasi" className="hover:text-primary">
              Kebijakan Privasi
            </Link>
            <Link href="/syarat-ketentuan" className="hover:text-primary">
              Syarat & Ketentuan
            </Link>
            <Link href="/login" className="hover:text-primary font-medium text-neutral-dark">
              Akses Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
