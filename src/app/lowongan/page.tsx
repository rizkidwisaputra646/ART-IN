'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { JobCard } from '@/components/ui/JobCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { searchJobVacancies } from '@/lib/data-repository';
import { BANDAR_LAMPUNG_DISTRICTS } from '@/lib/constants';
import { JobType } from '@/types';
import { Search, MapPin, Briefcase, Filter, X, RotateCcw } from 'lucide-react';

function LowonganContent() {
  const searchParams = useSearchParams();

  const [keyword, setKeyword] = useState('');
  const [district, setDistrict] = useState('');
  const [jobType, setJobType] = useState<JobType | ''>('');
  const [maxSalary, setMaxSalary] = useState(0);

  const jobs = useMemo(() => {
    return searchJobVacancies({
      keyword: keyword.trim() ? keyword : undefined,
      district: district || undefined,
      jobType: jobType ? jobType : undefined,
      maxSalary: maxSalary > 0 ? maxSalary : undefined,
      status: 'active',
    });
  }, [keyword, district, jobType, maxSalary]);

  const handleReset = () => {
    setKeyword('');
    setDistrict('');
    setJobType('');
    setMaxSalary(0);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFCFA]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-accent bg-accent-light px-2.5 py-0.5 rounded-full border border-accent-border">
                Lowongan Kerja Rumah Tangga
              </span>
              <span className="text-xs font-semibold text-neutral-secondary">Kota Bandar Lampung</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-dark tracking-tight">
              Daftar Lowongan Pekerjaan ART
            </h1>
            <p className="text-xs sm:text-sm text-neutral-secondary mt-1">
              Temukan lowongan pekerjaan rumah tangga terpercaya dari keluarga di berbagai kecamatan Bandar Lampung.
            </p>
          </div>

          {/* Search and Filters Bar */}
          <div className="bg-white rounded-2xl p-4 border border-neutral-border shadow-xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              {/* Keyword Search */}
              <div className="sm:col-span-5 relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-secondary" />
                <input
                  type="text"
                  placeholder="Cari lowongan (pengasuh, cuci, masak)..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-neutral-light rounded-xl border border-neutral-border focus:border-primary focus:bg-white focus:outline-none"
                />
              </div>

              {/* District Filter */}
              <div className="sm:col-span-4">
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full py-2.5 px-3 text-xs bg-neutral-light rounded-xl border border-neutral-border text-neutral-dark focus:border-primary focus:outline-none"
                >
                  <option value="">Semua Kecamatan</option>
                  {BANDAR_LAMPUNG_DISTRICTS.map((d) => (
                    <option key={d.name} value={d.name}>
                      Kecamatan {d.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Job Type Filter */}
              <div className="sm:col-span-3">
                <select
                  value={jobType}
                  onChange={(e: any) => setJobType(e.target.value)}
                  className="w-full py-2.5 px-3 text-xs bg-neutral-light rounded-xl border border-neutral-border text-neutral-dark focus:border-primary focus:outline-none"
                >
                  <option value="">Semua Tipe Kerja</option>
                  <option value="live_out">Pulang Pergi</option>
                  <option value="live_in">Menginap</option>
                  <option value="full_time">Penuh Waktu</option>
                  <option value="part_time">Paruh Waktu</option>
                </select>
              </div>
            </div>

            {(keyword || district || jobType) && (
              <div className="flex items-center justify-between pt-2 border-t border-neutral-border/60 text-xs text-neutral-secondary">
                <span>Ditemukan <strong>{jobs.length}</strong> lowongan kerja aktif</span>
                <button
                  onClick={handleReset}
                  className="text-primary hover:underline font-bold flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset Filter
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Jobs Grid */}
        {jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} showDistance={false} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-10 text-center border border-neutral-border shadow-xs space-y-4">
            <div className="w-16 h-16 rounded-full bg-cream-100 flex items-center justify-center text-accent mx-auto">
              <Briefcase className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-base font-bold text-neutral-dark">
                Tidak Ada Lowongan yang Sesuai
              </h3>
              <p className="text-xs text-neutral-secondary">
                Belum ada lowongan pekerjaan dengan kriteria tersebut. Coba pilih kecamatan lain atau reset pencarian.
              </p>
            </div>
            <Button variant="primary" size="sm" onClick={handleReset}>
              Reset Filter
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function LowonganPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Memuat lowongan...</div>}>
      <LowonganContent />
    </Suspense>
  );
}
