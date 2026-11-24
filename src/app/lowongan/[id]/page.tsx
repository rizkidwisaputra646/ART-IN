'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { VerificationBadge, JobTypeBadge } from '@/components/ui/Badge';
import { getJobById, applyForJob, submitReport } from '@/lib/data-repository';
import { formatCompactRupiah, formatRupiah, formatDateIndo, createWhatsAppUrl } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import {
  MapPin,
  Clock,
  Calendar,
  Briefcase,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
  UserCheck,
  MessageCircle,
  AlertCircle,
  FileText,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';

export default function DetailLowonganPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const job = getJobById(id);
  const { user, profile } = useAuth();

  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyResult, setApplyResult] = useState<{ success: boolean; message: string } | null>(null);

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAFCFA]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="text-center space-y-4 max-w-md">
            <h2 className="text-xl font-bold text-neutral-dark">Lowongan Tidak Ditemukan</h2>
            <p className="text-xs text-neutral-secondary">
              Lowongan ini mungkin sudah ditutup atau tidak aktif lagi.
            </p>
            <Link href="/lowongan">
              <Button variant="primary" size="sm">
                Lihat Lowongan Lainnya
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setApplyLoading(true);

    const artId = profile?.role === 'art' ? profile.id : 'art-1';

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artId,
          jobId: job.id,
          coverLetter,
        }),
      });
      const json = await res.json();

      setApplyLoading(false);
      if (json.success) {
        setApplyResult({ success: true, message: json.message });
        setTimeout(() => {
          setApplyModalOpen(false);
          setApplyResult(null);
          setCoverLetter('');
        }, 2500);
      } else {
        setApplyResult({ success: false, message: json.error || 'Gagal mengajukan lamaran.' });
      }
    } catch {
      // Fallback
      const res = applyForJob(artId, job.id, coverLetter);
      setApplyLoading(false);
      setApplyResult(res);
      if (res.success) {
        setTimeout(() => {
          setApplyModalOpen(false);
          setApplyResult(null);
          setCoverLetter('');
        }, 2500);
      }
    }
  };

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reporterId: profile?.id || 'guest',
          reporterName: profile?.full_name || 'Tamu Pengguna',
          reportedJobId: job.id,
          reportedJobTitle: job.title,
          category: 'lowongan_palsu',
          reason: reportReason,
        }),
      });
    } catch {
      submitReport({
        reporterId: profile?.id || 'guest',
        reporterName: profile?.full_name || 'Tamu Pengguna',
        reportedJobId: job.id,
        reportedJobTitle: job.title,
        category: 'lowongan_palsu',
        reason: reportReason,
      });
    }

    setReportSuccess(true);
    setTimeout(() => {
      setReportModalOpen(false);
      setReportSuccess(false);
      setReportReason('');
    }, 2000);
  };

  const waMessage = `Halo ${job.employerName}, saya melihat lowongan Anda di ARTin dengan judul "${job.title}". Apakah lowongan ini masih tersedia?`;
  const waUrl = createWhatsAppUrl('081271234567', waMessage);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFCFA]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            href="/lowongan"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-secondary hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Daftar Lowongan</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Job Details */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-border shadow-card space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <JobTypeBadge jobType={job.jobType} />
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Status: Lowongan Aktif
                </span>
                <span className="text-xs text-neutral-secondary ml-auto">
                  Dipublikasikan: {formatDateIndo(job.createdAt)}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-neutral-dark tracking-tight">
                {job.title}
              </h1>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-neutral-secondary pt-2 border-t border-neutral-border">
                <div className="flex items-center gap-1.5 font-bold text-neutral-dark">
                  <UserCheck className="w-4 h-4 text-primary" />
                  <span>{job.employerName}</span>
                  <VerificationBadge status={job.employerVerificationStatus} size="sm" showText={false} />
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-neutral-muted" />
                  <span>Kecamatan {job.district}, Bandar Lampung</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-neutral-muted" />
                  <span>{job.workingHours}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-border shadow-card space-y-4">
              <h2 className="text-base font-bold text-neutral-dark pb-3 border-b border-neutral-border">
                Deskripsi Pekerjaan
              </h2>
              <p className="text-xs sm:text-sm text-neutral-secondary leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-border shadow-card space-y-4">
              <h2 className="text-base font-bold text-neutral-dark pb-3 border-b border-neutral-border">
                Persyaratan Calon ART
              </h2>
              <div className="space-y-2">
                {job.requirements.map((req, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-dark">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Facilities & Working Schedule */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-border shadow-card space-y-4">
              <h2 className="text-base font-bold text-neutral-dark pb-3 border-b border-neutral-border">
                Fasilitas & Jadwal Kerja
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-neutral-light border border-neutral-border space-y-2">
                  <span className="text-xs font-bold text-neutral-dark block">Jadwal & Hari Kerja</span>
                  <p className="text-xs text-neutral-secondary">Hari: <strong>{job.workingDays}</strong></p>
                  <p className="text-xs text-neutral-secondary">Jam Kerja: <strong>{job.workingHours}</strong></p>
                  <p className="text-xs text-neutral-secondary">Sistem Pembayaran: <strong>{job.paymentSchedule}</strong></p>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-light border border-neutral-border space-y-2">
                  <span className="text-xs font-bold text-neutral-dark block">Fasilitas yang Diberikan</span>
                  <ul className="text-xs text-neutral-secondary space-y-1">
                    {job.facilities.map((fac, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span>{fac}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Action Sidebar */}
          <div className="lg:col-span-4 space-y-6 sticky top-28">
            <div className="bg-white rounded-3xl p-6 border border-neutral-border shadow-card space-y-5">
              <div>
                <span className="block text-[10px] uppercase font-bold tracking-wider text-neutral-secondary">
                  Gaji Ditawarkan
                </span>
                <span className="text-xl font-black text-primary">
                  {formatRupiah(job.salaryMin)} - {formatRupiah(job.salaryMax)}
                  <span className="text-xs font-normal text-neutral-secondary"> /bulan</span>
                </span>
              </div>

              <div className="space-y-3 pt-2 border-t border-neutral-border">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => setApplyModalOpen(true)}
                  leftIcon={<FileText className="w-5 h-5" />}
                  className="w-full font-bold shadow-md shadow-primary/20"
                >
                  Ajukan Lamaran
                </Button>

                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <Button
                    variant="outline"
                    size="md"
                    leftIcon={<MessageCircle className="w-4 h-4 text-[#25D366]" />}
                    className="w-full border-neutral-border hover:bg-neutral-light text-xs font-semibold"
                  >
                    Tanya via WhatsApp
                  </Button>
                </a>
              </div>

              <div className="p-3.5 bg-neutral-light rounded-2xl border border-neutral-border text-[11px] text-neutral-secondary space-y-1.5">
                <span className="font-bold text-neutral-dark block">Keamanan Perekrutan</span>
                <p>
                  Keluarga pemberi kerja telah diverifikasi. Jangan mentransfer uang pendaftaran apapun kepada pihak mana pun.
                </p>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setReportModalOpen(true)}
                  className="text-xs text-neutral-muted hover:text-rose-600 inline-flex items-center gap-1 font-medium"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Laporkan Lowongan Palsu
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL AJUKAN LAMARAN */}
        <Modal
          isOpen={applyModalOpen}
          onClose={() => setApplyModalOpen(false)}
          title="Ajukan Lamaran Pekerjaan"
          description={`Kirim lamaran resmi untuk lowongan: ${job.title}`}
        >
          {applyResult ? (
            <div className={`p-4 rounded-2xl text-xs space-y-2 text-center ${applyResult.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
              <p className="font-bold">{applyResult.message}</p>
            </div>
          ) : (
            <form onSubmit={handleApply} className="space-y-4">
              <div className="p-3 bg-neutral-light rounded-xl border border-neutral-border text-xs text-neutral-secondary">
                <p>
                  Lamaran akan dikirim menggunakan data profil ART Anda: <strong>{profile?.full_name || 'Siti Rahayu (Simulasi ART)'}</strong>
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-secondary mb-1">
                  Surat Pengantar / Catatan untuk Keluarga (Opsional)
                </label>
                <textarea
                  rows={4}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Perkenalkan diri Anda singkat, ceritakan pengalaman yang relevan, dan kesediaan jam kerja Anda..."
                  className="w-full bg-neutral-light border border-neutral-border text-neutral-dark rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setApplyModalOpen(false)}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={applyLoading}
                >
                  Kirim Lamaran Sekarang
                </Button>
              </div>
            </form>
          )}
        </Modal>

        {/* MODAL LAPOR LOWONGAN */}
        <Modal
          isOpen={reportModalOpen}
          onClose={() => setReportModalOpen(false)}
          title="Laporkan Lowongan Kerja"
          description="Laporan Anda akan diperiksa langsung oleh admin moderator ARTin."
        >
          {reportSuccess ? (
            <div className="py-6 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="text-sm font-bold text-neutral-dark">Laporan Terkirim</h4>
              <p className="text-xs text-neutral-secondary">Terima kasih atas laporan Anda.</p>
            </div>
          ) : (
            <form onSubmit={handleReport} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-secondary mb-1">
                  Alasan Pelaporan
                </label>
                <textarea
                  required
                  rows={4}
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="Contoh: Nomor kontak meminta transfer uang, atau gaji tidak sesuai..."
                  className="w-full bg-neutral-light border border-neutral-border text-neutral-dark rounded-xl p-3 text-xs"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setReportModalOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" variant="danger" size="sm">
                  Laporkan
                </Button>
              </div>
            </form>
          )}
        </Modal>
      </main>

      <Footer />
    </div>
  );
}
