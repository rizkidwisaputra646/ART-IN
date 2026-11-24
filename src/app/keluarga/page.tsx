'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { VerificationBadge, JobTypeBadge } from '@/components/ui/Badge';
import {
  searchJobVacancies,
  getApplicationsForEmployer,
  createJobVacancy,
  updateApplicationStatus,
  updateJobVacancy,
  submitVerificationRequest,
} from '@/lib/data-repository';
import { formatCompactRupiah, formatRupiah, formatDateIndo, createWhatsAppUrl } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import { BANDAR_LAMPUNG_DISTRICTS } from '@/lib/constants';
import { Application, JobVacancy, JobType, ApplicationStatus } from '@/types';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  PlusCircle,
  Clock,
  Calendar,
  MapPin,
  CheckCircle2,
  XCircle,
  MessageCircle,
  Eye,
  ShieldCheck,
  Building,
  Settings,
  Sparkles,
  Search,
  Lock,
  Loader2,
} from 'lucide-react';

export default function FamilyDashboardPage() {
  const { profile, isLoading: isAuthLoading } = useAuth();
  const employerId = profile?.role === 'family' ? profile.id : 'emp-1';

  // Tabs: overview | vacancies | applicants | create | settings
  const [activeTab, setActiveTab] = useState<'overview' | 'vacancies' | 'applicants' | 'create' | 'settings'>('overview');

  // Data
  const [vacancies, setVacancies] = useState<JobVacancy[]>(() =>
    searchJobVacancies({}).filter((j) => j.employerId === employerId || employerId === 'emp-1')
  );
  const [applications, setApplications] = useState<Application[]>(() =>
    getApplicationsForEmployer(employerId)
  );

  // Selected applicant modal
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [interviewDate, setInterviewDate] = useState('');
  const [statusNote, setStatusNote] = useState('');

  // New Job Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDistrict, setNewDistrict] = useState(BANDAR_LAMPUNG_DISTRICTS[0].name);
  const [newJobType, setNewJobType] = useState<JobType>('live_out');
  const [newSalaryMin, setNewSalaryMin] = useState(2000000);
  const [newSalaryMax, setNewSalaryMax] = useState(2500000);
  const [newWorkingHours, setNewWorkingHours] = useState('08:00 - 16:00 WIB');
  const [newWorkingDays, setNewWorkingDays] = useState('Senin - Sabtu');
  const [newFacilities, setNewFacilities] = useState('Makan Siang Disediakan, Uang Bensin Transport');
  const [newRequirements, setNewRequirements] = useState('Wanita usia 25-45 tahun, Memiliki KTP asli, Pengalaman minimal 1 tahun');
  const [createSuccess, setCreateSuccess] = useState(false);

  // Verification request form state
  const [verifNotes, setVerifNotes] = useState('');
  const [verifSubmitted, setVerifSubmitted] = useState(false);

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    const created = createJobVacancy(
      employerId,
      profile?.full_name || 'Ibu Maya Lestari',
      {
        title: newTitle,
        description: newDescription,
        district: newDistrict,
        jobType: newJobType,
        salaryMin: Number(newSalaryMin),
        salaryMax: Number(newSalaryMax),
        workingHours: newWorkingHours,
        workingDays: newWorkingDays,
        facilities: newFacilities.split(',').map((s) => s.trim()),
        requirements: newRequirements.split(',').map((s) => s.trim()),
      }
    );

    setVacancies([created, ...vacancies]);
    setCreateSuccess(true);
    setTimeout(() => {
      setCreateSuccess(false);
      setActiveTab('vacancies');
      setNewTitle('');
      setNewDescription('');
    }, 1500);
  };

  const handleStatusChange = (appId: string, newStatus: ApplicationStatus) => {
    updateApplicationStatus(appId, newStatus, statusNote, interviewDate);
    setApplications([...getApplicationsForEmployer(employerId)]);
    if (selectedApp && selectedApp.id === appId) {
      setSelectedApp({ ...selectedApp, status: newStatus });
    }
  };

  const handleToggleJobStatus = (jobId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'closed' : 'active';
    updateJobVacancy(jobId, { status: nextStatus as any });
    setVacancies(vacancies.map((j) => (j.id === jobId ? { ...j, status: nextStatus as any } : j)));
  };

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitVerificationRequest({
      userId: employerId,
      userName: profile?.full_name || 'Ibu Maya Lestari',
      userRole: 'family',
      userDistrict: newDistrict,
      idCardUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500',
      selfieUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500',
      notes: verifNotes,
    });
    setVerifSubmitted(true);
  };

  const activeVacanciesCount = vacancies.filter((v) => v.status === 'active').length;
  const pendingAppsCount = applications.filter((a) => a.status === 'pending').length;

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFCFA]">
        <div className="flex items-center gap-2 text-sm text-neutral-secondary font-medium">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span>Memeriksa hak akses keluarga...</span>
        </div>
      </div>
    );
  }

  // Strict Role Guard: Only Families can access Family Dashboard
  if (!profile || profile.role !== 'family') {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAFCFA]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="text-center space-y-4 max-w-md bg-white p-8 rounded-3xl border border-neutral-border shadow-card">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-neutral-dark">Akses Dibatasi: Khusus Akun Keluarga</h2>
            <p className="text-xs text-neutral-secondary leading-relaxed">
              Halaman ini diperuntukkan bagi keluarga pemberi kerja yang mengelola lowongan dan pelamar. Silakan masuk dengan akun keluarga Anda.
            </p>
            <div className="pt-2">
              <Link href="/login">
                <Button variant="primary" size="sm">
                  Masuk sebagai Keluarga
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFCFA]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-neutral-border">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary-light px-2.5 py-0.5 rounded-full">
                Dashboard Keluarga
              </span>
              <span className="text-xs text-neutral-secondary">Kota Bandar Lampung</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-dark tracking-tight">
              {profile?.full_name || 'Ibu Maya Lestari'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/cari-art">
              <Button variant="outline" size="sm" leftIcon={<Search className="w-4 h-4 text-primary" />}>
                Cari ART Terdekat
              </Button>
            </Link>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<PlusCircle className="w-4 h-4" />}
              onClick={() => setActiveTab('create')}
            >
              Pasang Lowongan Baru
            </Button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto py-4 border-b border-neutral-border text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-primary text-white shadow-xs'
                : 'text-neutral-secondary hover:text-neutral-dark hover:bg-neutral-light'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Ringkasan
          </button>

          <button
            onClick={() => setActiveTab('vacancies')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'vacancies'
                ? 'bg-primary text-white shadow-xs'
                : 'text-neutral-secondary hover:text-neutral-dark hover:bg-neutral-light'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Lowongan Saya ({vacancies.length})
          </button>

          <button
            onClick={() => setActiveTab('applicants')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'applicants'
                ? 'bg-primary text-white shadow-xs'
                : 'text-neutral-secondary hover:text-neutral-dark hover:bg-neutral-light'
            }`}
          >
            <Users className="w-4 h-4" />
            Pelamar Masuk ({applications.length})
            {pendingAppsCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-accent text-neutral-dark text-[10px] font-bold flex items-center justify-center">
                {pendingAppsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'create'
                ? 'bg-primary text-white shadow-xs'
                : 'text-neutral-secondary hover:text-neutral-dark hover:bg-neutral-light'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            Buat Lowongan
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'bg-primary text-white shadow-xs'
                : 'text-neutral-secondary hover:text-neutral-dark hover:bg-neutral-light'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Verifikasi & Profil
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 py-6">
            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white rounded-2xl p-5 border border-neutral-border shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-secondary">
                  Lowongan Aktif
                </span>
                <p className="text-2xl font-black text-primary mt-2">{activeVacanciesCount}</p>
                <span className="text-[11px] text-neutral-secondary">Menerima lamaran baru</span>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-neutral-border shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-secondary">
                  Total Pelamar Masuk
                </span>
                <p className="text-2xl font-black text-neutral-dark mt-2">{applications.length}</p>
                <span className="text-[11px] text-emerald-700 font-semibold">{pendingAppsCount} menunggu ditinjau</span>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-neutral-border shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-secondary">
                  Tahap Wawancara
                </span>
                <p className="text-2xl font-black text-amber-600 mt-2">
                  {applications.filter((a) => a.status === 'interview').length}
                </p>
                <span className="text-[11px] text-neutral-secondary">Jadwal tatap muka aktif</span>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-neutral-border shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-secondary">
                  Status Verifikasi
                </span>
                <div className="mt-2">
                  <VerificationBadge status="verified" />
                </div>
                <span className="text-[11px] text-neutral-secondary mt-1 block">KTP terverifikasi</span>
              </div>
            </div>

            {/* Quick Section: Pelamar Terbaru & Lowongan Aktif */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left: Recent Applicants */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-neutral-border shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-border">
                  <h3 className="text-base font-bold text-neutral-dark flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    Pelamar Terbaru
                  </h3>
                  <button
                    onClick={() => setActiveTab('applicants')}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    Lihat Semua &rarr;
                  </button>
                </div>

                <div className="space-y-3">
                  {applications.slice(0, 3).map((app) => (
                    <div
                      key={app.id}
                      className="p-4 rounded-2xl bg-neutral-light border border-neutral-border flex items-center justify-between gap-3 hover:border-primary transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-neutral-border">
                          <Image src={app.artAvatar} alt={app.artName} fill className="object-cover" />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-neutral-dark">{app.artName}</h4>
                          <p className="text-[11px] text-neutral-secondary">
                            Kec. {app.artDistrict} • {app.artExperienceYears} Th Pengalaman
                          </p>
                          <span className="text-[10px] font-semibold text-primary">{app.jobTitle}</span>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedApp(app)}
                        className="text-xs"
                      >
                        Tinjau
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Active Vacancies */}
              <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-neutral-border shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-border">
                  <h3 className="text-base font-bold text-neutral-dark flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-primary" />
                    Lowongan Anda
                  </h3>
                  <button
                    onClick={() => setActiveTab('create')}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    + Pasang Lowongan
                  </button>
                </div>

                <div className="space-y-3">
                  {vacancies.slice(0, 3).map((job) => (
                    <div
                      key={job.id}
                      className="p-4 rounded-2xl bg-[#FAFCFA] border border-neutral-border space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-neutral-dark line-clamp-1">{job.title}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          job.status === 'active' ? 'bg-emerald-50 text-emerald-800' : 'bg-neutral-200 text-neutral-700'
                        }`}>
                          {job.status === 'active' ? 'Aktif' : 'Ditutup'}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-secondary">
                        Kec. {job.district} • {formatCompactRupiah(job.salaryMin)} - {formatCompactRupiah(job.salaryMax)}
                      </p>
                      <div className="flex items-center justify-between pt-1 text-[11px]">
                        <span className="font-semibold text-primary">{job.applicantCount || 0} Pelamar</span>
                        <Link href={`/lowongan/${job.id}`} className="hover:underline text-neutral-dark font-medium">
                          Buka Halaman &rarr;
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VACANCIES LIST & MANAGEMENT */}
        {activeTab === 'vacancies' && (
          <div className="space-y-6 py-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-neutral-dark">Daftar Lowongan Pekerjaan Anda</h2>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<PlusCircle className="w-4 h-4" />}
                onClick={() => setActiveTab('create')}
              >
                Buat Lowongan Baru
              </Button>
            </div>

            <div className="space-y-4">
              {vacancies.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl p-6 border border-neutral-border shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <JobTypeBadge jobType={job.jobType} />
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        job.status === 'active'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                      }`}>
                        {job.status === 'active' ? 'Status: Aktif' : 'Status: Ditutup'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-neutral-dark">{job.title}</h3>
                    <p className="text-xs text-neutral-secondary">
                      Kecamatan {job.district} • {job.workingHours} • Gaji: {formatRupiah(job.salaryMin)} - {formatRupiah(job.salaryMax)}
                    </p>
                    <p className="text-xs text-neutral-secondary line-clamp-1">{job.description}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link href={`/lowongan/${job.id}`}>
                      <Button variant="outline" size="sm" leftIcon={<Eye className="w-3.5 h-3.5" />}>
                        Pratinjau
                      </Button>
                    </Link>

                    <Button
                      variant={job.status === 'active' ? 'outline' : 'secondary'}
                      size="sm"
                      onClick={() => handleToggleJobStatus(job.id, job.status)}
                      className="text-xs"
                    >
                      {job.status === 'active' ? 'Tutup Lowongan' : 'Aktifkan Kembali'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: APPLICANTS MANAGEMENT */}
        {activeTab === 'applicants' && (
          <div className="space-y-6 py-6">
            <h2 className="text-lg font-bold text-neutral-dark">Daftar Pelamar Lowongan</h2>

            <div className="space-y-4">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-2xl p-6 border border-neutral-border shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-neutral-border">
                      <Image src={app.artAvatar} alt={app.artName} fill className="object-cover" />
                    </div>

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-neutral-dark">{app.artName}</h3>
                        <VerificationBadge status={app.artVerificationStatus} size="sm" />
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          app.status === 'pending'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : app.status === 'reviewing'
                            ? 'bg-sky-50 text-sky-800 border border-sky-200'
                            : app.status === 'interview'
                            ? 'bg-purple-50 text-purple-800 border border-purple-200'
                            : app.status === 'accepted'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}>
                          Status: {app.status.toUpperCase()}
                        </span>
                      </div>

                      <p className="text-xs text-neutral-secondary">
                        Kecamatan {app.artDistrict} • {app.artExperienceYears} Tahun Pengalaman • Melamar untuk: <strong>{app.jobTitle}</strong>
                      </p>

                      {app.coverLetter && (
                        <p className="text-xs text-neutral-secondary bg-neutral-light p-3 rounded-xl border border-neutral-border/60 line-clamp-2">
                          "{app.coverLetter}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions & Status Control */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <a
                      href={createWhatsAppUrl(app.artPhone || '081234567890', `Halo ${app.artName}, kami dari keluarga tertarik dengan lamaran Anda di ARTin.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        size="sm"
                        variant="primary"
                        leftIcon={<MessageCircle className="w-4 h-4 text-white" />}
                        className="bg-[#25D366] hover:bg-[#20BA5A] border-none text-white text-xs font-bold"
                      >
                        WhatsApp
                      </Button>
                    </a>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedApp(app)}
                      className="text-xs border-primary/40 text-primary"
                    >
                      Kelola Status
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: BUAT LOWONGAN FORM */}
        {activeTab === 'create' && (
          <div className="max-w-3xl mx-auto py-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-border shadow-card space-y-6">
              <div className="pb-4 border-b border-neutral-border">
                <h2 className="text-xl font-bold text-neutral-dark">Buat Lowongan Pekerjaan ART Baru</h2>
                <p className="text-xs text-neutral-secondary mt-1">
                  Cantumkan rincian tugas dan kompensasi secara transparan agar calon ART dapat melamar dengan mantap.
                </p>
              </div>

              {createSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span className="font-bold">Lowongan pekerjaan berhasil dipublikasikan di ARTin Bandar Lampung!</span>
                </div>
              )}

              <form onSubmit={handleCreateJob} className="space-y-4">
                <Input
                  label="Judul Lowongan"
                  required
                  placeholder="Contoh: Dicari ART Pulang Pergi untuk Bersih-Bersih Rumah di Sukarame"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Kecamatan Pekerjaan"
                    value={newDistrict}
                    onChange={(e) => setNewDistrict(e.target.value)}
                  >
                    {BANDAR_LAMPUNG_DISTRICTS.map((d) => (
                      <option key={d.name} value={d.name}>
                        Kecamatan {d.name}
                      </option>
                    ))}
                  </Select>

                  <Select
                    label="Tipe Sistem Kerja"
                    value={newJobType}
                    onChange={(e: any) => setNewJobType(e.target.value)}
                  >
                    <option value="live_out">Pulang Pergi (Live-out)</option>
                    <option value="live_in">Menginap (Live-in)</option>
                    <option value="full_time">Penuh Waktu (Full-time)</option>
                    <option value="part_time">Paruh Waktu (Part-time)</option>
                  </Select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Gaji Minimal (Rp/Bulan)"
                    type="number"
                    required
                    value={newSalaryMin}
                    onChange={(e) => setNewSalaryMin(Number(e.target.value))}
                  />

                  <Input
                    label="Gaji Maksimal (Rp/Bulan)"
                    type="number"
                    required
                    value={newSalaryMax}
                    onChange={(e) => setNewSalaryMax(Number(e.target.value))}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Jam Kerja Harian"
                    required
                    placeholder="Contoh: 08:00 - 16:00 WIB"
                    value={newWorkingHours}
                    onChange={(e) => setNewWorkingHours(e.target.value)}
                  />

                  <Input
                    label="Hari Kerja"
                    required
                    placeholder="Contoh: Senin - Sabtu (Minggu Libur)"
                    value={newWorkingDays}
                    onChange={(e) => setNewWorkingDays(e.target.value)}
                  />
                </div>

                <Textarea
                  label="Deskripsi Lengkap Pekerjaan"
                  required
                  rows={4}
                  placeholder="Jelaskan kebutuhan rumah Anda: jumlah kamar, tugas memasak, menyetrika, keberadaan hewan peliharaan, dll..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />

                <Input
                  label="Fasilitas (Pisahkan dengan koma)"
                  placeholder="Makan Siang, Uang Transport, Bonus Hari Raya"
                  value={newFacilities}
                  onChange={(e) => setNewFacilities(e.target.value)}
                />

                <Input
                  label="Persyaratan Kandidat (Pisahkan dengan koma)"
                  placeholder="Wanita, Usia 25-45 tahun, Memiliki KTP, Pengalaman min. 1 tahun"
                  value={newRequirements}
                  onChange={(e) => setNewRequirements(e.target.value)}
                />

                <div className="pt-4 flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab('vacancies')}
                  >
                    Batal
                  </Button>
                  <Button type="submit" variant="primary" className="font-bold">
                    Publikasikan Lowongan Sekarang
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 5: VERIFICATION & PROFILE SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto py-6 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-border shadow-card space-y-6">
              <div className="pb-4 border-b border-neutral-border">
                <h2 className="text-xl font-bold text-neutral-dark">Verifikasi Akun Keluarga</h2>
                <p className="text-xs text-neutral-secondary mt-1">
                  Akun yang terverifikasi mendapatkan lencana resmi dan menarik lebih banyak pelamar berkualitas di Bandar Lampung.
                </p>
              </div>

              {verifSubmitted ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Dokumen Verifikasi Berhasil Diunggah!</span>
                  </div>
                  <p>
                    Admin ARTin akan memeriksa keaslian KTP Anda dalam 1x24 jam. Dokumen disimpan secara terproteksi di private storage.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleVerificationSubmit} className="space-y-4">
                  <div className="p-4 rounded-2xl bg-cream-50 border border-accent-border/60 text-xs text-neutral-secondary space-y-1">
                    <span className="font-bold text-neutral-dark block">Jaminan Keamanan Dokumen</span>
                    <p>
                      KTP dan data pribadi Anda dilindungi enkripsi. Hanya admin pemeriksa yang berhak mengakses file verifikasi.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-secondary mb-1">
                      Foto KTP Asli Penanggung Jawab Keluarga
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full text-xs text-neutral-secondary file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary-light file:text-primary hover:file:bg-primary/20 cursor-pointer"
                    />
                  </div>

                  <Textarea
                    label="Catatan Tambahan untuk Admin (Opsional)"
                    rows={3}
                    placeholder="Contoh: KTP domisili Sukarame, siap diverifikasi melalui telepon..."
                    value={verifNotes}
                    onChange={(e) => setVerifNotes(e.target.value)}
                  />

                  <Button type="submit" variant="primary" className="w-full font-bold">
                    Ajukan Verifikasi Identitas
                  </Button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* MODAL KELOLA STATUS LAMARAN */}
        {selectedApp && (
          <Modal
            isOpen={!!selectedApp}
            onClose={() => setSelectedApp(null)}
            title={`Kelola Lamaran: ${selectedApp.artName}`}
            description={`Lowongan: ${selectedApp.jobTitle}`}
          >
            <div className="space-y-4">
              <div className="p-3 bg-neutral-light rounded-xl border border-neutral-border text-xs text-neutral-secondary space-y-1">
                <p>Status Saat Ini: <strong className="text-neutral-dark uppercase">{selectedApp.status}</strong></p>
                <p>Domisili: Kec. {selectedApp.artDistrict} • Kontak: {selectedApp.artPhone || '-'}</p>
                {selectedApp.coverLetter && (
                  <p className="italic pt-1">"{selectedApp.coverLetter}"</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-secondary mb-1">
                  Ubah Tahap Lamaran:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={selectedApp.status === 'reviewing' ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => handleStatusChange(selectedApp.id, 'reviewing')}
                    className="text-xs"
                  >
                    Sedang Ditinjau
                  </Button>

                  <Button
                    type="button"
                    variant={selectedApp.status === 'interview' ? 'accent' : 'outline'}
                    size="sm"
                    onClick={() => handleStatusChange(selectedApp.id, 'interview')}
                    className="text-xs"
                  >
                    Undang Wawancara
                  </Button>

                  <Button
                    type="button"
                    variant={selectedApp.status === 'accepted' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleStatusChange(selectedApp.id, 'accepted')}
                    className="text-xs"
                  >
                    Terima Bekerja
                  </Button>

                  <Button
                    type="button"
                    variant={selectedApp.status === 'rejected' ? 'danger' : 'outline'}
                    size="sm"
                    onClick={() => handleStatusChange(selectedApp.id, 'rejected')}
                    className="text-xs text-rose-600"
                  >
                    Tolak Lamaran
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-secondary mb-1">
                  Catatan untuk Kandidat / Jadwal Wawancara
                </label>
                <textarea
                  rows={3}
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="Contoh: Jadwal wawancara hari Sabtu pukul 10.00 di Sukarame..."
                  className="w-full bg-neutral-light border border-neutral-border text-neutral-dark rounded-xl p-3 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="primary" size="sm" onClick={() => setSelectedApp(null)}>
                  Selesai
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </main>

      <Footer />
    </div>
  );
}
