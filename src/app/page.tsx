'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { Button } from '@/components/ui/Button';
import { ArtCard } from '@/components/ui/ArtCard';
import { JobCard } from '@/components/ui/JobCard';
import { BANDAR_LAMPUNG_DISTRICTS } from '@/lib/constants';
import { searchArtProfiles, searchJobVacancies } from '@/lib/data-repository';
import {
  Search,
  MapPin,
  ShieldCheck,
  Navigation,
  Sparkles,
  Users,
  Briefcase,
  CheckCircle,
  ArrowRight,
  Clock,
  HeartHandshake,
  Baby,
  Utensils,
  Home,
  HeartPulse,
  Shirt,
  Flower2,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Fetch top ART candidates & latest jobs
  const featuredArts = searchArtProfiles({ verifiedOnly: true }).slice(0, 4);
  const latestJobs = searchJobVacancies({ status: 'active' }).slice(0, 4);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedDistrict) params.set('kecamatan', selectedDistrict);
    if (selectedCategory) params.set('kategori', selectedCategory);
    router.push(`/cari-art?${params.toString()}`);
  };

  const categories = [
    {
      name: 'Pembersihan Rumah',
      desc: 'Sapu, pel, lap perabot & pembersihan menyeluruh',
      icon: Home,
      keyword: 'Pembersihan',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      name: 'Juru Masak Harian',
      desc: 'Masakan khas Nusantara & belanja dapur segar',
      icon: Utensils,
      keyword: 'Memasak',
      color: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      name: 'Pengasuhan Balita',
      desc: 'Telaten, sabar & ramah mendampingi anak',
      icon: Baby,
      keyword: 'Balita',
      color: 'bg-sky-50 text-sky-800 border-sky-200',
    },
    {
      name: 'Pendampingan Lansia',
      desc: 'Pengingat obat, teman bicara & bantuan gerak',
      icon: HeartPulse,
      keyword: 'Lansia',
      color: 'bg-rose-50 text-rose-800 border-rose-200',
    },
    {
      name: 'Cuci & Setrika Rapi',
      desc: 'Pakaian keluarga, seragam dinas & sprei',
      icon: Shirt,
      keyword: 'Menyetrika',
      color: 'bg-purple-50 text-purple-800 border-purple-200',
    },
    {
      name: 'Pekarangan & Kebun',
      desc: 'Perawatan tanaman hias, rumput & halaman',
      icon: Flower2,
      keyword: 'Tanaman',
      color: 'bg-teal-50 text-teal-800 border-teal-200',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFCFA]">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-b from-cream-50 via-cream to-[#FAFCFA] pt-12 pb-20 lg:pt-16 lg:pb-28 border-b border-accent-border/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              {/* Left Column: Headlines & CTA */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                {/* Region Tag */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-light border border-primary/20 text-primary-dark text-xs font-semibold shadow-xs">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span>Platform Khusus Kota Bandar Lampung</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-dark tracking-tight leading-[1.15]">
                  Temukan ART yang Tepat untuk{' '}
                  <span className="text-primary relative inline-block">
                    Keluarga Anda.
                    <span className="absolute bottom-1 left-0 w-full h-2.5 bg-accent/25 -z-10 rounded-full" />
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-neutral-secondary max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Platform pencarian Asisten Rumah Tangga yang membantu keluarga menemukan kandidat terpercaya berdasarkan keterampilan, pengalaman, dan estimasi lokasi terdekat di Bandar Lampung.
                </p>

                {/* Quick Search Form */}
                <form
                  onSubmit={handleHeroSearch}
                  className="bg-white p-3 sm:p-4 rounded-2xl shadow-card border border-neutral-border space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3 max-w-2xl"
                >
                  <div className="flex-1 min-w-0">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-secondary mb-1">
                      Kecamatan
                    </label>
                    <select
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="w-full bg-neutral-light border border-neutral-border text-neutral-dark rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    >
                      <option value="">Semua Kecamatan</option>
                      {BANDAR_LAMPUNG_DISTRICTS.map((d) => (
                        <option key={d.name} value={d.name}>
                          Kec. {d.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-1 min-w-0">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-secondary mb-1">
                      Kebutuhan Utama
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full bg-neutral-light border border-neutral-border text-neutral-dark rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    >
                      <option value="">Semua Kategori</option>
                      <option value="Pembersihan">Pembersihan Rumah</option>
                      <option value="Memasak">Memasak Harian</option>
                      <option value="Balita">Pengasuhan Balita</option>
                      <option value="Lansia">Pendampingan Lansia</option>
                      <option value="Menyetrika">Cuci & Setrika</option>
                    </select>
                  </div>

                  <div className="sm:self-end">
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      leftIcon={<Search className="w-4 h-4" />}
                      className="w-full sm:w-auto h-[42px] px-5"
                    >
                      Cari ART
                    </Button>
                  </div>
                </form>

                {/* Primary Dual CTAs */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                  <Link href="/cari-art">
                    <Button
                      variant="primary"
                      size="lg"
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                      className="shadow-sm"
                    >
                      Cari ART Terdekat
                    </Button>
                  </Link>
                  <Link href="/lowongan">
                    <Button
                      variant="accent"
                      size="lg"
                      leftIcon={<Briefcase className="w-4 h-4" />}
                    >
                      Cari Pekerjaan ART
                    </Button>
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-neutral-border/70 text-left max-w-lg mx-auto lg:mx-0">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-xs font-bold text-neutral-dark leading-tight">
                      Verifikasi KTP Admin
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-accent shrink-0" />
                    <span className="text-xs font-bold text-neutral-dark leading-tight">
                      Jarak Realistis PostGIS
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HeartHandshake className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-xs font-bold text-neutral-dark leading-tight">
                      Kontak Langsung Sopan
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Visual Showcase */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  {/* Backdrop Glow */}
                  <div className="absolute inset-0 bg-primary/10 rounded-3xl transform rotate-2 scale-98 -z-10" />

                  {/* Main Hero Card */}
                  <div className="bg-white rounded-3xl p-6 shadow-dropdown border border-neutral-border space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-border/80">
                      <div className="flex items-center gap-2.5">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-wider text-neutral-secondary">
                          Kandidat Siap Kerja Hari Ini
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-primary bg-primary-light px-2.5 py-0.5 rounded-full">
                        Kedaton & Sekitarnya
                      </span>
                    </div>

                    {/* Featured Mini Profile Preview */}
                    <div className="flex items-center gap-4 bg-cream-50 p-3.5 rounded-2xl border border-accent-border/50">
                      <div className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-primary/20">
                        <Image
                          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80"
                          alt="Siti Rahayu"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-bold text-neutral-dark truncate">Siti Rahayu</h4>
                          <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full">
                            Terverifikasi
                          </span>
                        </div>
                        <p className="text-xs text-neutral-secondary mt-0.5">Kec. Kedaton • 6 Th Pengalaman</p>
                        <p className="text-xs font-bold text-primary mt-1">Rp 2,0 jt - 2,6 jt /bln</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-neutral-secondary">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Estimasi jarak 2.4 km dari lokasi pekerjaan Anda</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Keahlian: Pembersihan Menyeluruh & Masak Nusantara</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Privasi aman: Alamat rumah presisi tidak dipublikasikan</span>
                      </div>
                    </div>

                    <Link href="/cari-art" className="block pt-2">
                      <Button variant="outline" size="sm" className="w-full text-xs border-primary/40 text-primary hover:bg-primary-light">
                        Lihat Semua Kandidat di Bandar Lampung &rarr;
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 2: KEBUTUHAN KELUARGA (CATEGORIES) */}
        <section className="py-16 md:py-20 bg-white border-b border-neutral-border/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary-light px-3 py-1 rounded-full">
                Kategori Kebutuhan
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-dark mt-3">
                Layanan Rumah Tangga Sesuai Kebutuhan Anda
              </h2>
              <p className="text-sm text-neutral-secondary mt-2">
                Pilih spesialisasi keahlian ART yang paling sesuai dengan rutinitas harian keluarga Anda di Bandar Lampung.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Link
                    key={cat.name}
                    href={`/cari-art?kategori=${encodeURIComponent(cat.keyword)}`}
                    className="group bg-[#FAFCFA] rounded-2xl p-6 border border-neutral-border/80 hover:border-primary/50 hover:bg-white hover:shadow-card transition-all duration-200"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-2xl border ${cat.color} group-hover:scale-105 transition-transform`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-neutral-dark group-hover:text-primary transition-colors">
                          {cat.name}
                        </h3>
                        <p className="text-xs text-neutral-secondary mt-1 leading-relaxed">
                          {cat.desc}
                        </p>
                        <span className="inline-flex items-center text-xs font-semibold text-primary mt-3 group-hover:underline">
                          Cari Kandidat &rarr;
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 3: KEUNGGULAN ARTin */}
        <section className="py-16 md:py-20 bg-cream-50 border-b border-accent-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-accent bg-accent-light px-3 py-1 rounded-full border border-accent-border">
                Mengapa ARTin?
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-dark mt-3">
                Dirancang Nyaman untuk Keluarga & Bermartabat untuk ART
              </h2>
              <p className="text-sm text-neutral-secondary mt-2">
                Solusi pencarian tenaga kerja rumah tangga lokal yang transparan, aman, dan menghargai privasi kedua belah pihak.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-7 border border-neutral-border shadow-card space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-primary-light flex items-center justify-center text-primary">
                  <Navigation className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-neutral-dark">
                  Pencarian Berdasarkan Jarak
                </h3>
                <p className="text-xs text-neutral-secondary leading-relaxed">
                  Didukung mesin lokasi PostGIS yang menghitung jarak garis lurus kandidat ke rumah Anda di 20 kecamatan Bandar Lampung tanpa mengekspos alamat pribadi ART.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-7 border border-neutral-border shadow-card space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-neutral-dark">
                  Verifikasi Identitas Manual
                </h3>
                <p className="text-xs text-neutral-secondary leading-relaxed">
                  Admin memeriksa KTP dan dokumen pendukung secara teliti di sistem private storage sebelum memberikan tanda verified pada profil pengguna.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-7 border border-neutral-border shadow-card space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-neutral-dark">
                  Transparansi Ekspektasi Gaji
                </h3>
                <p className="text-xs text-neutral-secondary leading-relaxed">
                  Ekspektasi gaji, sistem kerja pulang-pergi atau menginap, serta jam kerja dipaparkan dengan jelas sejak awal demi kesepakatan yang saling menguntungkan.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: CARA KERJA PLATFORM */}
        <section className="py-16 md:py-20 bg-white border-b border-neutral-border/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary-light px-3 py-1 rounded-full">
                Alur Praktis
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-dark mt-3">
                Bagaimana ARTin Bekerja
              </h2>
              <p className="text-sm text-neutral-secondary mt-2">
                Hanya butuh beberapa langkah sederhana untuk menemukan mitra kerja rumah tangga Anda.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Family Flow */}
              <div className="bg-[#FAFCFA] rounded-3xl p-6 sm:p-8 border border-neutral-border/90 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-dark">Untuk Keluarga Pencari ART</h3>
                    <p className="text-xs text-neutral-secondary">Menemukan kandidat terbaik di Bandar Lampung</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs text-neutral-secondary">
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-primary-light text-primary font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      1
                    </span>
                    <p><strong className="text-neutral-dark">Tentukan Kebutuhan & Lokasi:</strong> Pilih kecamatan atau aktifkan radius jarak terdekat.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-primary-light text-primary font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      2
                    </span>
                    <p><strong className="text-neutral-dark">Bandingkan Profil & Portofolio:</strong> Cek keahlian, pengalaman kerja sebelumnya, dan status verifikasi.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-primary-light text-primary font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      3
                    </span>
                    <p><strong className="text-neutral-dark">Hubungi via WhatsApp:</strong> Mulai percakapan sopan untuk menjadwalkan wawancara langsung.</p>
                  </div>
                </div>

                <Link href="/cari-art" className="block pt-2">
                  <Button variant="primary" size="sm" className="w-full">
                    Cari ART Sekarang
                  </Button>
                </Link>
              </div>

              {/* ART Flow */}
              <div className="bg-[#FAFCFA] rounded-3xl p-6 sm:p-8 border border-neutral-border/90 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent text-neutral-dark flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-dark">Untuk Calon Asisten Rumah Tangga</h3>
                    <p className="text-xs text-neutral-secondary">Mendapatkan lowongan pekerjaan yang jelas dan aman</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs text-neutral-secondary">
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-accent-light text-amber-900 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      1
                    </span>
                    <p><strong className="text-neutral-dark">Daftar & Lengkapi Profil:</strong> Masukkan keahlian, pengalaman, dan tentukan harapan gaji.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-accent-light text-amber-900 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      2
                    </span>
                    <p><strong className="text-neutral-dark">Unggah Dokumen Verifikasi:</strong> Dapatkan lencana Terverifikasi agar lebih dipercaya keluarga.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-accent-light text-amber-900 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      3
                    </span>
                    <p><strong className="text-neutral-dark">Lamar Lowongan yang Cocok:</strong> Pantau status lamaran hingga tahap wawancara.</p>
                  </div>
                </div>

                <Link href="/register" className="block pt-2">
                  <Button variant="accent" size="sm" className="w-full font-bold">
                    Daftar Sebagai ART
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: PROFIL ART PILIHAN */}
        <section className="py-16 md:py-20 bg-[#FAFCFA] border-b border-neutral-border/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-10">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary-light px-3 py-1 rounded-full">
                  Kandidat Terpilih
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-dark mt-2">
                  Profil ART Terverifikasi di Bandar Lampung
                </h2>
                <p className="text-xs sm:text-sm text-neutral-secondary mt-1">
                  Kandidat yang telah melalui verifikasi identitas dan memiliki riwayat kerja terdata.
                </p>
              </div>

              <Link href="/cari-art">
                <Button
                  variant="outline"
                  size="sm"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="border-primary/40 text-primary hover:bg-primary-light"
                >
                  Lihat Semua ART
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredArts.map((art) => (
                <ArtCard key={art.id} art={art} showDistance={false} />
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 6: INFORMASI LOWONGAN PEKERJAAN TERBARU */}
        <section className="py-16 md:py-20 bg-white border-b border-neutral-border/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-10">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-accent bg-accent-light px-3 py-1 rounded-full border border-accent-border">
                  Lowongan Terkini
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-dark mt-2">
                  Lowongan ART dari Keluarga di Bandar Lampung
                </h2>
                <p className="text-xs sm:text-sm text-neutral-secondary mt-1">
                  Pemberi kerja keluarga yang sedang mencari asisten rumah tangga saat ini.
                </p>
              </div>

              <Link href="/lowongan">
                <Button
                  variant="outline"
                  size="sm"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="border-primary/40 text-primary hover:bg-primary-light"
                >
                  Lihat Semua Lowongan
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {latestJobs.map((job) => (
                <JobCard key={job.id} job={job} showDistance={false} />
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 7: CALL TO ACTION BERGABUNG */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-primary to-primary-hover text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-cream text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>Komunitas Ketenagakerjaan Rumah Tangga Kota Bandar Lampung</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Siap Menemukan Asisten Rumah Tangga yang Sesuai?
            </h2>

            <p className="text-sm sm:text-base text-cream-100/90 max-w-2xl mx-auto leading-relaxed">
              Bergabunglah bersama ratusan keluarga dan pencari kerja di Bandar Lampung. Proses mudah, transparan, dan mengutamakan rasa aman serta kenyamanan keluarga Anda.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link href="/cari-art">
                <Button
                  variant="accent"
                  size="lg"
                  className="font-bold shadow-lg shadow-black/10 text-neutral-dark"
                >
                  Cari ART Terdekat Sekarang
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white/10 text-white border-white/30 hover:bg-white/20"
                >
                  Daftarkan Akun Baru
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
