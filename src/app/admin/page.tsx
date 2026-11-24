'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { VerificationBadge, JobTypeBadge } from '@/components/ui/Badge';
import {
  getAdminStats,
  getVerificationRequests,
  reviewVerificationRequest,
  getReports,
  updateReportStatus,
  searchJobVacancies,
  updateJobVacancy,
  searchArtProfiles,
} from '@/lib/data-repository';
import { formatCompactRupiah, formatDateIndo } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import { VerificationRequest, ReportItem, JobVacancy, ArtProfile, VerificationStatus, ReportStatus } from '@/types';
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  Briefcase,
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  Filter,
  Search,
  Lock,
  Activity,
  UserCheck,
  Loader2,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { profile, isLoading: isAuthLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'verifications' | 'jobs' | 'reports' | 'users'>('overview');

  // Admin Data States
  const [stats, setStats] = useState(() => getAdminStats());
  const [verifications, setVerifications] = useState<VerificationRequest[]>(() => getVerificationRequests());
  const [reports, setReports] = useState<ReportItem[]>(() => getReports());
  const [jobs, setJobs] = useState<JobVacancy[]>(() => searchJobVacancies({}));
  const [arts, setArts] = useState<ArtProfile[]>(() => searchArtProfiles({}));

  // Selected verification document for modal inspection
  const [selectedVerif, setSelectedVerif] = useState<VerificationRequest | null>(null);
  const [signedDocUrl, setSignedDocUrl] = useState<string | null>(null);
  const [signedDocLoading, setSignedDocLoading] = useState(false);
  const [reviewNote, setReviewNote] = useState('');

  // Selected report for modal inspection
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [adminReportNote, setAdminReportNote] = useState('');

  // Securely request a time-limited signed URL for private verification documents
  const handleInspectVerificationDoc = async (v: VerificationRequest) => {
    setSelectedVerif(v);
    setSignedDocLoading(true);
    setSignedDocUrl(null);

    try {
      const res = await fetch(`/api/admin/verification-doc?id=${v.id}`);
      const json = await res.json();
      if (json.success && json.signedUrl) {
        setSignedDocUrl(json.signedUrl);
      } else {
        setSignedDocUrl(v.idCardUrl);
      }
    } catch {
      setSignedDocUrl(v.idCardUrl);
    } finally {
      setSignedDocLoading(false);
    }
  };

  // Action handlers
  const handleReviewVerification = (status: VerificationStatus) => {
    if (!selectedVerif) return;
    reviewVerificationRequest(selectedVerif.id, status, reviewNote);
    setVerifications(getVerificationRequests());
    setStats(getAdminStats());
    setSelectedVerif(null);
    setSignedDocUrl(null);
    setReviewNote('');
  };

  const handleResolveReport = (status: ReportStatus) => {
    if (!selectedReport) return;
    updateReportStatus(selectedReport.id, status, adminReportNote);
    setReports(getReports());
    setStats(getAdminStats());
    setSelectedReport(null);
    setAdminReportNote('');
  };

  const handleToggleJob = (jobId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'rejected' : 'active';
    updateJobVacancy(jobId, { status: nextStatus as any });
    setJobs(searchJobVacancies({}));
    setStats(getAdminStats());
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFCFA]">
        <div className="flex items-center gap-2 text-sm text-neutral-secondary font-medium">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span>Memeriksa hak akses administrator...</span>
        </div>
      </div>
    );
  }

  // Strict Role Guard: Only Admins can access Admin Dashboard
  if (!profile || profile.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAFCFA]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="text-center space-y-4 max-w-md bg-white p-8 rounded-3xl border border-neutral-border shadow-card">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-neutral-dark">Akses Ditolak: Khusus Administrator</h2>
            <p className="text-xs text-neutral-secondary leading-relaxed">
              Anda tidak memiliki izin untuk mengakses halaman operasional ini. Sesuai PRD ARTin, akses admin hanya diberikan kepada staf pengelola platform yang berwenang.
            </p>
            <div className="pt-2">
              <Link href="/login">
                <Button variant="primary" size="sm">
                  Masuk dengan Akun Admin
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
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                Panel Administrasi Resmi
              </span>
              <span className="text-xs font-semibold text-neutral-secondary">ARTin Kota Bandar Lampung</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-dark tracking-tight">
              Dashboard Moderasi & Operasional
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-neutral-secondary bg-neutral-light px-3 py-1.5 rounded-xl border border-neutral-border">
              Admin Session Aktif
            </span>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto py-4 border-b border-neutral-border text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-neutral-dark text-white shadow-xs'
                : 'text-neutral-secondary hover:text-neutral-dark hover:bg-neutral-light'
            }`}
          >
            <Activity className="w-4 h-4" />
            Statistik & Ringkasan
          </button>

          <button
            onClick={() => setActiveTab('verifications')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'verifications'
                ? 'bg-neutral-dark text-white shadow-xs'
                : 'text-neutral-secondary hover:text-neutral-dark hover:bg-neutral-light'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            Verifikasi KTP ({verifications.length})
            {stats.pendingVerifications > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                {stats.pendingVerifications}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'jobs'
                ? 'bg-neutral-dark text-white shadow-xs'
                : 'text-neutral-secondary hover:text-neutral-dark hover:bg-neutral-light'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Moderasi Lowongan ({jobs.length})
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'reports'
                ? 'bg-neutral-dark text-white shadow-xs'
                : 'text-neutral-secondary hover:text-neutral-dark hover:bg-neutral-light'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            Laporan Pengguna ({reports.length})
            {stats.pendingReports > 0 && (
              <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                {stats.pendingReports}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'users'
                ? 'bg-neutral-dark text-white shadow-xs'
                : 'text-neutral-secondary hover:text-neutral-dark hover:bg-neutral-light'
            }`}
          >
            <Users className="w-4 h-4" />
            Manajemen Pengguna ({arts.length})
          </button>
        </div>

        {/* TAB 1: OVERVIEW & STATS */}
        {activeTab === 'overview' && (
          <div className="space-y-8 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white rounded-2xl p-5 border border-neutral-border shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-secondary">
                  Total Pengguna Terdaftar
                </span>
                <p className="text-2xl font-black text-neutral-dark mt-2">{stats.totalUsers}</p>
                <span className="text-[11px] text-neutral-secondary">
                  {stats.totalArt} ART • {stats.totalEmployers} Keluarga
                </span>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-neutral-border shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-secondary">
                  Lowongan Aktif
                </span>
                <p className="text-2xl font-black text-primary mt-2">{stats.totalActiveJobs}</p>
                <span className="text-[11px] text-neutral-secondary">Di 20 kecamatan Bandar Lampung</span>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-neutral-border shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                  Verifikasi Menunggu (Pending)
                </span>
                <p className="text-2xl font-black text-amber-600 mt-2">{stats.pendingVerifications}</p>
                <span className="text-[11px] text-neutral-secondary">Perlu pemeriksaan dokumen</span>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-neutral-border shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
                  Laporan Perlu Ditangani
                </span>
                <p className="text-2xl font-black text-rose-600 mt-2">{stats.pendingReports}</p>
                <span className="text-[11px] text-neutral-secondary">Laporan keamanan pengguna</span>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Verification Queue */}
              <div className="bg-white rounded-3xl p-6 border border-neutral-border shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-border">
                  <h3 className="text-base font-bold text-neutral-dark flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-amber-600" />
                    Antrean Verifikasi KTP
                  </h3>
                  <button
                    onClick={() => setActiveTab('verifications')}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    Buka Semua &rarr;
                  </button>
                </div>

                <div className="space-y-3">
                  {verifications.map((v) => (
                    <div
                      key={v.id}
                      className="p-3.5 rounded-2xl bg-neutral-light border border-neutral-border flex items-center justify-between gap-3"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-neutral-dark">{v.userName}</h4>
                        <p className="text-[11px] text-neutral-secondary">
                          Peran: {v.userRole.toUpperCase()} • Kec. {v.userDistrict}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <VerificationBadge status={v.status} size="sm" />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleInspectVerificationDoc(v)}
                          className="text-xs"
                        >
                          Periksa
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reports Queue */}
              <div className="bg-white rounded-3xl p-6 border border-neutral-border shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-border">
                  <h3 className="text-base font-bold text-neutral-dark flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    Pengaduan / Laporan Masuk
                  </h3>
                  <button
                    onClick={() => setActiveTab('reports')}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    Buka Semua &rarr;
                  </button>
                </div>

                <div className="space-y-3">
                  {reports.map((r) => (
                    <div
                      key={r.id}
                      className="p-3.5 rounded-2xl bg-rose-50/40 border border-rose-100 flex items-center justify-between gap-3"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-neutral-dark">{r.category.toUpperCase()}</h4>
                        <p className="text-[11px] text-neutral-secondary line-clamp-1">{r.reason}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedReport(r)}
                        className="text-xs border-rose-200 text-rose-700"
                      >
                        Tinjau
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VERIFICATION MANAGEMENT */}
        {activeTab === 'verifications' && (
          <div className="space-y-6 py-6">
            <h2 className="text-lg font-bold text-neutral-dark">Daftar Pengajuan Verifikasi KTP</h2>

            <div className="space-y-4">
              {verifications.map((v) => (
                <div
                  key={v.id}
                  className="bg-white rounded-2xl p-6 border border-neutral-border shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-neutral-dark">{v.userName}</h3>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-neutral-light text-neutral-secondary border border-neutral-border">
                        Role: {v.userRole}
                      </span>
                      <VerificationBadge status={v.status} size="sm" />
                    </div>
                    <p className="text-xs text-neutral-secondary">
                      Domisili: Kecamatan {v.userDistrict} • Diajukan: {formatDateIndo(v.createdAt)}
                    </p>
                    {v.notes && (
                      <p className="text-xs text-neutral-secondary bg-neutral-light p-2 rounded-lg mt-1">
                        Catatan: "{v.notes}"
                      </p>
                    )}
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<Eye className="w-4 h-4" />}
                    onClick={() => handleInspectVerificationDoc(v)}
                    className="text-xs shrink-0"
                  >
                    Buka Dokumen KTP Secara Aman
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: JOB MODERATION */}
        {activeTab === 'jobs' && (
          <div className="space-y-6 py-6">
            <h2 className="text-lg font-bold text-neutral-dark">Moderasi Lowongan Pekerjaan</h2>

            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl p-6 border border-neutral-border shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <JobTypeBadge jobType={job.jobType} />
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        job.status === 'active' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
                      }`}>
                        {job.status === 'active' ? 'Aktif' : 'Dinonaktifkan / Ditolak'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-neutral-dark">{job.title}</h3>
                    <p className="text-xs text-neutral-secondary">
                      Keluarga: <strong>{job.employerName}</strong> • Kec. {job.district} • {formatCompactRupiah(job.salaryMin)} - {formatCompactRupiah(job.salaryMax)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link href={`/lowongan/${job.id}`}>
                      <Button variant="outline" size="sm" className="text-xs">
                        Lihat
                      </Button>
                    </Link>

                    <Button
                      variant={job.status === 'active' ? 'danger' : 'secondary'}
                      size="sm"
                      onClick={() => handleToggleJob(job.id, job.status)}
                      className="text-xs"
                    >
                      {job.status === 'active' ? 'Nonaktifkan Lowongan' : 'Pulihkan Lowongan'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: REPORTS MANAGEMENT */}
        {activeTab === 'reports' && (
          <div className="space-y-6 py-6">
            <h2 className="text-lg font-bold text-neutral-dark">Pengaduan & Laporan Keamanan</h2>

            <div className="space-y-4">
              {reports.map((r) => (
                <div
                  key={r.id}
                  className="bg-white rounded-2xl p-6 border border-neutral-border shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                        {r.category}
                      </span>
                      <span className="text-xs text-neutral-secondary">
                        Status: <strong className="uppercase">{r.status}</strong>
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-neutral-dark">
                      Pelapor: {r.reporterName} • Terlapor: {r.reportedUserName || r.reportedJobTitle || 'Konten'}
                    </p>
                    <p className="text-xs text-neutral-secondary leading-relaxed bg-neutral-light p-3 rounded-xl">
                      "{r.reason}"
                    </p>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setSelectedReport(r)}
                    className="text-xs shrink-0"
                  >
                    Tindak Lanjuti
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: USERS MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="space-y-6 py-6">
            <h2 className="text-lg font-bold text-neutral-dark">Daftar Pengguna Platform ARTin</h2>

            <div className="space-y-3">
              {arts.map((a) => (
                <div
                  key={a.id}
                  className="bg-white rounded-2xl p-4 border border-neutral-border shadow-xs flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-neutral-border">
                      <Image src={a.avatarUrl} alt={a.fullName} fill className="object-cover" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-neutral-dark">{a.fullName}</h4>
                        <VerificationBadge status={a.verificationStatus} size="sm" showText={false} />
                      </div>
                      <p className="text-xs text-neutral-secondary">
                        Kecamatan {a.district} • {a.experienceYears} Th Pengalaman • Kontak: {a.phone || '-'}
                      </p>
                    </div>
                  </div>

                  <Link href={`/art/${a.id}`}>
                    <Button variant="outline" size="sm" className="text-xs">
                      Buka Profil
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODAL PERIKSA DOKUMEN KTP SECARA AMAN */}
        {selectedVerif && (
          <Modal
            isOpen={!!selectedVerif}
            onClose={() => setSelectedVerif(null)}
            title={`Pemeriksaan Dokumen KTP: ${selectedVerif.userName}`}
            description="Dokumen disimpan dalam private storage terenkripsi dan hanya dapat diakses pemeriksa resmi."
            maxWidth="lg"
          >
            <div className="space-y-4">
              <div className="p-3 bg-cream-50 rounded-xl border border-accent-border/60 text-xs text-neutral-secondary">
                <p>Pemohon: <strong>{selectedVerif.userName}</strong> ({selectedVerif.userRole})</p>
                <p>Domisili: Kecamatan {selectedVerif.userDistrict}, Bandar Lampung</p>
              </div>

              {/* Secure Document Preview with Signed URL */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-dark">
                    Foto KTP Pemohon (Private Storage)
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Signed URL Aktif (Masa Berlaku 15 Menit)
                  </span>
                </div>
                <div className="relative w-full h-56 rounded-2xl overflow-hidden border border-neutral-border bg-neutral-light flex items-center justify-center">
                  {signedDocLoading ? (
                    <div className="flex items-center gap-2 text-xs text-neutral-secondary">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span>Membuat signed token akses dokumen...</span>
                    </div>
                  ) : (
                    <Image
                      src={signedDocUrl || selectedVerif.idCardUrl}
                      alt="Foto KTP"
                      fill
                      className="object-contain p-2"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-secondary mb-1">
                  Catatan Admin / Alasan (Jika Perlu Revisi / Ditolak)
                </label>
                <textarea
                  rows={2}
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  placeholder="Contoh: KTP terbaca jelas dan data telah diverifikasi..."
                  className="w-full bg-neutral-light border border-neutral-border text-neutral-dark rounded-xl p-2.5 text-xs"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedVerif(null)}
                >
                  Tutup
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReviewVerification('requires_revision')}
                    className="text-xs text-amber-700"
                  >
                    Minta Revisi
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleReviewVerification('rejected')}
                    className="text-xs"
                  >
                    Tolak
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleReviewVerification('verified')}
                    className="text-xs font-bold"
                  >
                    Setujui Verifikasi
                  </Button>
                </div>
              </div>
            </div>
          </Modal>
        )}

        {/* MODAL TINDAK LANJUT LAPORAN */}
        {selectedReport && (
          <Modal
            isOpen={!!selectedReport}
            onClose={() => setSelectedReport(null)}
            title="Tindak Lanjut Pengaduan Pengguna"
            description={`Kategori: ${selectedReport.category.toUpperCase()}`}
          >
            <div className="space-y-4">
              <div className="p-3 bg-neutral-light rounded-xl border border-neutral-border text-xs text-neutral-secondary space-y-1">
                <p>Pelapor: <strong>{selectedReport.reporterName}</strong></p>
                <p>Isi Laporan: "{selectedReport.reason}"</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-secondary mb-1">
                  Catatan Tindak Lanjut Admin
                </label>
                <textarea
                  rows={3}
                  value={adminReportNote}
                  onChange={(e) => setAdminReportNote(e.target.value)}
                  placeholder="Catatan tindakan yang telah diambil..."
                  className="w-full bg-neutral-light border border-neutral-border text-neutral-dark rounded-xl p-2.5 text-xs"
                />
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-neutral-border">
                <Button variant="outline" size="sm" onClick={() => setSelectedReport(null)}>
                  Batal
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleResolveReport('rejected')}
                    className="text-xs"
                  >
                    Tolak Laporan
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleResolveReport('resolved')}
                    className="text-xs font-bold"
                  >
                    Selesaikan (Resolved)
                  </Button>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </main>

      <Footer />
    </div>
  );
}
