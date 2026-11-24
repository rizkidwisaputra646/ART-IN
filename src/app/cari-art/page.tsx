'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { ArtCard } from '@/components/ui/ArtCard';
import { DistanceFilter } from '@/components/ui/DistanceFilter';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { searchArtProfiles } from '@/lib/data-repository';
import { BANDAR_LAMPUNG_DISTRICTS, SKILL_CATEGORIES } from '@/lib/constants';
import { ArtProfile, JobType } from '@/types';
import {
  Search,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  MapPin,
  X,
  UserCheck,
  ChevronDown,
  Loader2,
  Server,
} from 'lucide-react';

function CariArtContent() {
  const searchParams = useSearchParams();

  // Search & Filter States
  const [keyword, setKeyword] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [radiusKm, setRadiusKm] = useState(0);
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [minExperience, setMinExperience] = useState(0);
  const [maxSalary, setMaxSalary] = useState(0);
  const [selectedSkillCategory, setSelectedSkillCategory] = useState('');
  const [selectedJobType, setSelectedJobType] = useState<JobType | ''>('');
  const [gender, setGender] = useState<'female' | 'male' | ''>('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'nearest' | 'experience' | 'salary_asc' | 'salary_desc' | 'newest'>('nearest');

  // Server Results & Loading State
  const [searchResults, setSearchResults] = useState<ArtProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mobile Filter Drawer State
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Initialize from URL search parameters
  useEffect(() => {
    const k = searchParams.get('keyword');
    const d = searchParams.get('kecamatan');
    const c = searchParams.get('kategori');

    if (k) setKeyword(k);
    if (d) setSelectedDistrict(d);
    if (c) setSelectedSkillCategory(c);
  }, [searchParams]);

  const handleUseGps = (coords: { lat: number; lng: number }) => {
    setGpsCoords(coords);
    if (radiusKm === 0) setRadiusKm(10); // Default to 10 km when GPS activated
    setSortBy('nearest');
  };

  const handleResetFilters = () => {
    setKeyword('');
    setSelectedDistrict('');
    setRadiusKm(0);
    setGpsCoords(null);
    setMinExperience(0);
    setMaxSalary(0);
    setSelectedSkillCategory('');
    setSelectedJobType('');
    setGender('');
    setVerifiedOnly(false);
    setSortBy('nearest');
  };

  // Perform Server-Authoritative Search Query
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const params = new URLSearchParams();
    if (keyword.trim()) params.set('keyword', keyword.trim());
    else if (selectedSkillCategory) params.set('keyword', selectedSkillCategory);

    if (selectedDistrict) params.set('district', selectedDistrict);
    if (gpsCoords) {
      params.set('lat', gpsCoords.lat.toString());
      params.set('lng', gpsCoords.lng.toString());
    }
    if (radiusKm > 0) params.set('radius', radiusKm.toString());
    if (minExperience > 0) params.set('minExperience', minExperience.toString());
    if (maxSalary > 0) params.set('maxSalary', maxSalary.toString());
    if (selectedJobType) params.set('jobType', selectedJobType);
    if (gender) params.set('gender', gender);
    if (verifiedOnly) params.set('verifiedOnly', 'true');
    params.set('sortBy', sortBy);

    fetch(`/api/art/search?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        if (isMounted) {
          if (json.success && Array.isArray(json.data)) {
            setSearchResults(json.data);
          } else {
            // Fallback to local repository if API response fails
            setSearchResults(
              searchArtProfiles({
                keyword: keyword.trim() ? keyword : (selectedSkillCategory || undefined),
                district: selectedDistrict || undefined,
                referenceLat: gpsCoords?.lat,
                referenceLng: gpsCoords?.lng,
                maxDistanceKm: radiusKm > 0 ? radiusKm : undefined,
                minExperience: minExperience > 0 ? minExperience : undefined,
                maxSalary: maxSalary > 0 ? maxSalary : undefined,
                jobType: selectedJobType || undefined,
                gender: gender || undefined,
                verifiedOnly,
                sortBy,
              })
            );
          }
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setSearchResults(
            searchArtProfiles({
              keyword: keyword.trim() ? keyword : (selectedSkillCategory || undefined),
              district: selectedDistrict || undefined,
              referenceLat: gpsCoords?.lat,
              referenceLng: gpsCoords?.lng,
              maxDistanceKm: radiusKm > 0 ? radiusKm : undefined,
              minExperience: minExperience > 0 ? minExperience : undefined,
              maxSalary: maxSalary > 0 ? maxSalary : undefined,
              jobType: selectedJobType || undefined,
              gender: gender || undefined,
              verifiedOnly,
              sortBy,
            })
          );
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [
    keyword,
    selectedDistrict,
    radiusKm,
    gpsCoords,
    minExperience,
    maxSalary,
    selectedSkillCategory,
    selectedJobType,
    gender,
    verifiedOnly,
    sortBy,
  ]);

  const activeFilterCount = [
    selectedDistrict,
    radiusKm > 0,
    gpsCoords,
    minExperience > 0,
    maxSalary > 0,
    selectedSkillCategory,
    selectedJobType,
    gender,
    verifiedOnly,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFCFA]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title & Search Bar */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary-light px-2.5 py-0.5 rounded-full">
                  Marketplace ART
                </span>
                <span className="text-xs font-semibold text-neutral-secondary">Kota Bandar Lampung</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-dark tracking-tight">
                Pencarian Asisten Rumah Tangga
              </h1>
            </div>

            {/* Mobile Filter Trigger Button */}
            <div className="md:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMobileFilterOpen(true)}
                leftIcon={<SlidersHorizontal className="w-4 h-4 text-primary" />}
                className="w-full"
              >
                Filter Pencarian {activeFilterCount > 0 && `(${activeFilterCount})`}
              </Button>
            </div>
          </div>

          {/* Keyword Search Input & Sorter Bar */}
          <div className="bg-white rounded-2xl p-3 border border-neutral-border shadow-xs flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-secondary" />
              <input
                type="text"
                placeholder="Cari berdasarkan nama, keahlian (memasak, anak, lansia), atau area..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-neutral-light rounded-xl border border-transparent focus:border-primary focus:bg-white focus:outline-none transition-colors"
              />
              {keyword && (
                <button
                  onClick={() => setKeyword('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-secondary hover:text-neutral-dark"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-between sm:justify-start">
              <span className="text-xs font-semibold text-neutral-secondary whitespace-nowrap">
                Urutkan:
              </span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-neutral-light border border-neutral-border text-neutral-dark rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
              >
                <option value="nearest">Jarak Terdekat</option>
                <option value="experience">Pengalaman Terbanyak</option>
                <option value="salary_asc">Gaji: Terendah ke Tertinggi</option>
                <option value="salary_desc">Gaji: Tertinggi ke Terendah</option>
                <option value="newest">Paling Baru Terdaftar</option>
              </select>
            </div>
          </div>

          {/* Active Filter Chips */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="font-semibold text-neutral-secondary">Filter Aktif:</span>
              {selectedDistrict && (
                <span className="inline-flex items-center gap-1 bg-primary-light text-primary-dark font-medium px-2.5 py-1 rounded-full border border-primary/20">
                  Kec. {selectedDistrict}
                  <button onClick={() => setSelectedDistrict('')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {radiusKm > 0 && (
                <span className="inline-flex items-center gap-1 bg-accent-light text-amber-900 font-medium px-2.5 py-1 rounded-full border border-accent-border">
                  Maks. {radiusKm} km
                  <button onClick={() => setRadiusKm(0)}><X className="w-3 h-3" /></button>
                </span>
              )}
              {gpsCoords && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 font-medium px-2.5 py-1 rounded-full border border-emerald-200">
                  GPS Aktif
                  <button onClick={() => setGpsCoords(null)}><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedSkillCategory && (
                <span className="inline-flex items-center gap-1 bg-neutral-100 text-neutral-dark font-medium px-2.5 py-1 rounded-full border border-neutral-border">
                  Keahlian: {selectedSkillCategory}
                  <button onClick={() => setSelectedSkillCategory('')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedJobType && (
                <span className="inline-flex items-center gap-1 bg-neutral-100 text-neutral-dark font-medium px-2.5 py-1 rounded-full border border-neutral-border">
                  {selectedJobType}
                  <button onClick={() => setSelectedJobType('')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {verifiedOnly && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 font-medium px-2.5 py-1 rounded-full border border-emerald-200">
                  Hanya Terverifikasi
                  <button onClick={() => setVerifiedOnly(false)}><X className="w-3 h-3" /></button>
                </span>
              )}

              <button
                onClick={handleResetFilters}
                className="text-primary hover:underline font-bold text-xs ml-2 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Semua
              </button>
            </div>
          )}
        </div>

        {/* 2-Column Layout: Sidebar Filters + Main Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* DESKTOP SIDEBAR FILTER */}
          <aside className="hidden lg:block lg:col-span-4 space-y-6">
            {/* Distance and Location PostGIS Component */}
            <DistanceFilter
              selectedDistrict={selectedDistrict}
              onDistrictChange={setSelectedDistrict}
              radiusKm={radiusKm}
              onRadiusChange={setRadiusKm}
              onUseGps={handleUseGps}
              isGpsActive={!!gpsCoords}
            />

            {/* Additional Criteria Filters Card */}
            <div className="bg-white rounded-2xl border border-neutral-border p-5 space-y-5 shadow-sm">
              <h4 className="text-sm font-bold text-neutral-dark flex items-center gap-2 pb-3 border-b border-neutral-border/80">
                <Filter className="w-4 h-4 text-primary" />
                <span>Kriteria Kandidat</span>
              </h4>

              {/* Verified Filter Switch */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="block text-xs font-bold text-neutral-dark">Hanya Terverifikasi</span>
                  <span className="block text-[11px] text-neutral-secondary">Sudah lolos verifikasi KTP admin</span>
                </div>
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-primary focus:ring-primary border-neutral-border cursor-pointer"
                />
              </div>

              {/* Skill Category Selector */}
              <div>
                <label className="block text-xs font-semibold text-neutral-secondary mb-1.5">
                  Kategori Keahlian Utama
                </label>
                <select
                  value={selectedSkillCategory}
                  onChange={(e) => setSelectedSkillCategory(e.target.value)}
                  className="w-full bg-neutral-light border border-neutral-border text-neutral-dark rounded-xl px-3 py-2 text-xs font-medium focus:border-primary outline-none"
                >
                  <option value="">Semua Kategori</option>
                  <option value="Pembersihan">Pembersihan Rumah</option>
                  <option value="Memasak">Memasak Nusantara</option>
                  <option value="Balita">Pengasuhan Balita</option>
                  <option value="Lansia">Pendampingan Lansia</option>
                  <option value="Menyetrika">Cuci & Setrika Rapi</option>
                  <option value="Tanaman">Perawatan Kebun & Tanaman</option>
                  <option value="Motor">Bisa Mengendarai Motor</option>
                </select>
              </div>

              {/* Job Type Selector */}
              <div>
                <label className="block text-xs font-semibold text-neutral-secondary mb-1.5">
                  Sistem / Preferensi Kerja
                </label>
                <select
                  value={selectedJobType}
                  onChange={(e: any) => setSelectedJobType(e.target.value)}
                  className="w-full bg-neutral-light border border-neutral-border text-neutral-dark rounded-xl px-3 py-2 text-xs font-medium focus:border-primary outline-none"
                >
                  <option value="">Semua Tipe Kerja</option>
                  <option value="live_out">Pulang Pergi (Live-out)</option>
                  <option value="live_in">Menginap (Live-in)</option>
                  <option value="full_time">Penuh Waktu</option>
                  <option value="part_time">Paruh Waktu</option>
                </select>
              </div>

              {/* Minimum Experience */}
              <div>
                <label className="block text-xs font-semibold text-neutral-secondary mb-1.5">
                  Pengalaman Minimum: {minExperience === 0 ? 'Semua' : `${minExperience} Tahun`}
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[0, 1, 3, 5].map((yr) => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => setMinExperience(yr)}
                      className={`text-xs py-1.5 rounded-lg border font-semibold transition-all ${
                        minExperience === yr
                          ? 'bg-primary text-white border-primary'
                          : 'bg-neutral-light text-neutral-secondary hover:bg-white'
                      }`}
                    >
                      {yr === 0 ? 'Bebas' : `${yr}+ Th`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gender Preference */}
              <div>
                <label className="block text-xs font-semibold text-neutral-secondary mb-1.5">
                  Jenis Kelamin
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { label: 'Semua', val: '' },
                    { label: 'Wanita', val: 'female' },
                    { label: 'Pria', val: 'male' },
                  ].map((g) => (
                    <button
                      key={g.label}
                      type="button"
                      onClick={() => setGender(g.val as any)}
                      className={`text-xs py-1.5 rounded-lg border font-semibold transition-all ${
                        gender === g.val
                          ? 'bg-primary text-white border-primary'
                          : 'bg-neutral-light text-neutral-secondary hover:bg-white'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="w-full text-xs text-neutral-secondary hover:text-neutral-dark"
              >
                Reset Semua Filter
              </Button>
            </div>
          </aside>

          {/* MAIN RESULTS COLUMN */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-border/60">
              <span className="text-xs sm:text-sm font-bold text-neutral-dark flex items-center gap-2">
                Menampilkan <span className="text-primary font-black">{searchResults.length}</span> kandidat ART
                {selectedDistrict && ` di Kec. ${selectedDistrict}`}
                {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />}
              </span>
              <span className="text-[11px] font-semibold text-neutral-secondary bg-neutral-light px-2.5 py-1 rounded-full border border-neutral-border flex items-center gap-1.5">
                <Server className="w-3 h-3 text-primary" />
                <span>Jarak Terhitung Server (PostGIS)</span>
              </span>
            </div>

            {/* Candidate Cards Grid */}
            {isLoading ? (
              <div className="p-16 text-center bg-white rounded-3xl border border-neutral-border shadow-xs space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                <p className="text-xs font-semibold text-neutral-dark">
                  Memproses pencarian dan menghitung jarak terdekat di server...
                </p>
                <p className="text-[11px] text-neutral-secondary">
                  Menjaga kerahasiaan alamat rumah dan koordinat presisi kandidat.
                </p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {searchResults.map((art) => (
                  <ArtCard key={art.id} art={art} showDistance={true} />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="bg-white rounded-3xl p-10 text-center border border-neutral-border shadow-xs space-y-4">
                <div className="w-16 h-16 rounded-full bg-cream-100 flex items-center justify-center text-accent mx-auto">
                  <MapPin className="w-8 h-8" />
                </div>
                <div className="max-w-md mx-auto space-y-1">
                  <h3 className="text-base font-bold text-neutral-dark">
                    Tidak Ditemukan Kandidat ART yang Sesuai
                  </h3>
                  <p className="text-xs text-neutral-secondary leading-relaxed">
                    Kriteria filter yang Anda pilih saat ini belum memiliki kandidat yang cocok di wilayah tersebut. Coba perlebar radius jarak atau reset filter.
                  </p>
                </div>
                <Button variant="primary" size="sm" onClick={handleResetFilters}>
                  Reset Filter Pencarian
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* MOBILE FILTER MODAL / DRAWER */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-neutral-dark/60 backdrop-blur-xs p-0 sm:p-4">
            <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 space-y-6 shadow-dropdown animate-in slide-in-from-bottom">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-border">
                <h3 className="text-base font-bold text-neutral-dark flex items-center gap-2">
                  <Filter className="w-4 h-4 text-primary" />
                  Filter Pencarian ART
                </h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg hover:bg-neutral-light"
                >
                  <X className="w-5 h-5 text-neutral-secondary" />
                </button>
              </div>

              <DistanceFilter
                selectedDistrict={selectedDistrict}
                onDistrictChange={setSelectedDistrict}
                radiusKm={radiusKm}
                onRadiusChange={setRadiusKm}
                onUseGps={handleUseGps}
                isGpsActive={!!gpsCoords}
              />

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button
                  variant="outline"
                  size="md"
                  onClick={handleResetFilters}
                  className="w-full text-xs"
                >
                  Reset
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full text-xs font-bold"
                >
                  Terapkan Filter ({searchResults.length})
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function CariArtPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Memuat pencarian ART...</div>}>
      <CariArtContent />
    </Suspense>
  );
}
