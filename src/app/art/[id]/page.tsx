'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { VerificationBadge, AvailabilityBadge, JobTypeBadge } from '@/components/ui/Badge';
import { getArtById, submitReport, getJobById, searchJobVacancies } from '@/lib/data-repository';
import { formatCompactRupiah, formatRupiah, createWhatsAppUrl } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import {
  MapPin,
  Briefcase,
  Calendar,
  Sparkles,
  Phone,
  MessageCircle,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowLeft,
  User,
  Heart,
  Share2,
} from 'lucide-react';

export default function ArtDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const art = getArtById(id);
  const { profile } = useAuth();

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [reportCategory, setReportCategory] = useState('profil_mencurigakan');
  const [reportReason, setReportReason] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);
  const [offerSuccess, setOfferSuccess] = useState(false);

  if (!art) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAFCFA]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="text-center space-y-4 max-w-md">
            <h2 className="text-xl font-bold text-neutral-dark">Profil ART Tidak Ditemukan</h2>
            <p className="text-xs text-neutral-secondary">
              Kandidat yang Anda cari mungkin sudah tidak aktif atau data URL tidak sesuai.
            </p>
            <Link href="/cari-art">
              <Button variant="primary" size="sm">
                Kembali ke Pencarian ART
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Pre-filled courteous WhatsApp message
  const waMessage = `Halo ${art.gender === 'female' ? 'Mbak' : 'Mas'} ${art.fullName}, saya melihat profil Anda melalui platform ARTin. Apakah saat ini Anda masih tersedia untuk bekerja di wilayah Bandar Lampung?`;
  const waUrl = createWhatsAppUrl(art.phone || '081234567890', waMessage);

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReport({
      reporterId: profile?.id || 'guest',
      reporterName: profile?.full_name || 'Tamu Pengguna',
      reportedUserId: art.id,
      reportedUserName: art.fullName,
      category: reportCategory as any,
      reason: reportReason,
    });
    setReportSuccess(true);
    setTimeout(() => {
      setReportModalOpen(false);
      setReportSuccess(false);
      setReportReason('');
    }, 2000);
  };

  const familyJobs = searchJobVacancies({ status: 'active' });

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFCFA]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/cari-art"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-secondary hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Pencarian ART</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT / MAIN COLUMN: Profile Details */}
          <div className="lg:col-span-8 space-y-8">
            {/* Header Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-border shadow-card">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden shrink-0 border-2 border-primary/20 shadow-md">
                  <Image
                    src={art.avatarUrl}
                    alt={art.fullName}
                    fill
                    priority
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <VerificationBadge status={art.verificationStatus} />
                    <AvailabilityBadge status={art.availabilityStatus} />
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-black text-neutral-dark tracking-tight">
                    {art.fullName}
                  </h1>

                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-neutral-secondary">
                    <span className="flex items-center gap-1 font-semibold text-neutral-dark">
                      <MapPin className="w-4 h-4 text-primary shrink-0" />
                      Kecamatan {art.district}, Bandar Lampung
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4 text-neutral-muted shrink-0" />
                      {art.experienceYears > 0 ? `${art.experienceYears} Tahun Pengalaman` : 'Kandidat Baru'}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4 text-neutral-muted shrink-0" />
                      {art.gender === 'female' ? 'Wanita' : 'Pria'}, {art.age} Tahun
                    </span>
                  </div>

                  {/* General area notice without exact address */}
                  <div className="pt-2">
                    <span className="text-[11px] text-neutral-secondary bg-neutral-light px-3 py-1 rounded-lg border border-neutral-border/80">
                      Area Domisili: {art.addressSummary || `Kecamatan ${art.district}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* About / Bio Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-border shadow-card space-y-4">
              <h2 className="text-lg font-bold text-neutral-dark flex items-center gap-2 pb-3 border-b border-neutral-border/80">
                <User className="w-4 h-4 text-primary" />
                <span>Tentang Kandidat</span>
              </h2>
              <p className="text-sm text-neutral-secondary leading-relaxed whitespace-pre-line">
                {art.bio}
              </p>
            </div>

            {/* Skills & Competencies */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-border shadow-card space-y-4">
              <h2 className="text-lg font-bold text-neutral-dark flex items-center gap-2 pb-3 border-b border-neutral-border/80">
                <Sparkles className="w-4 h-4 text-accent" />
                <span>Keterampilan & Kemahiran</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {art.skills.map((skill) => (
                  <div
                    key={skill.id || skill.name}
                    className="p-3.5 rounded-2xl bg-neutral-light border border-neutral-border/80 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-xs font-bold text-neutral-dark">{skill.name}</span>
                    </div>
                    {skill.level && (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-white border border-neutral-border text-primary">
                        {skill.level}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Work History / Experience */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-border shadow-card space-y-6">
              <h2 className="text-lg font-bold text-neutral-dark flex items-center gap-2 pb-3 border-b border-neutral-border/80">
                <Briefcase className="w-4 h-4 text-primary" />
                <span>Riwayat Pengalaman Kerja</span>
              </h2>

              {art.workExperiences && art.workExperiences.length > 0 ? (
                <div className="space-y-6 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-neutral-border">
                  {art.workExperiences.map((exp) => (
                    <div key={exp.id} className="relative pl-8 space-y-2">
                      <div className="absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-primary ring-4 ring-primary-light" />
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="text-sm font-bold text-neutral-dark">{exp.title}</h4>
                        <span className="text-xs text-neutral-secondary font-medium">
                          {exp.startDate} - {exp.endDate || 'Sekarang'}
                        </span>
                      </div>
                      {exp.employerName && (
                        <p className="text-xs font-semibold text-primary">{exp.employerName}</p>
                      )}
                      <p className="text-xs text-neutral-secondary leading-relaxed">
                        {exp.description}
                      </p>

                      {exp.referenceConsent && exp.referenceContact && (
                        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Referensi Majikan Sebelumnya Telah Disetujui untuk Dihubungi</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-neutral-secondary">
                  Kandidat belum menambahkan riwayat pengalaman formal terperinci.
                </p>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Contact & Action Sidebar */}
          <div className="lg:col-span-4 space-y-6 sticky top-28">
            {/* Action Box */}
            <div className="bg-white rounded-3xl p-6 border border-neutral-border shadow-card space-y-5">
              <div>
                <span className="block text-[10px] uppercase font-bold tracking-wider text-neutral-secondary">
                  Ekspektasi Gaji
                </span>
                <span className="text-xl font-black text-primary">
                  {formatRupiah(art.expectedSalaryMin)} - {formatRupiah(art.expectedSalaryMax)}
                  <span className="text-xs font-normal text-neutral-secondary"> /bulan</span>
                </span>
              </div>

              <div className="space-y-2 pt-2 border-t border-neutral-border text-xs text-neutral-secondary">
                <div className="flex justify-between">
                  <span>Jadwal / Jam Kerja:</span>
                  <span className="font-semibold text-neutral-dark">{art.workSchedule || 'Pulang Pergi'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Preferensi Sistem:</span>
                  <div className="flex gap-1">
                    {art.preferredJobTypes.map((t) => (
                      <JobTypeBadge key={t} jobType={t} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Button */}
              <div className="space-y-2.5 pt-2">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <Button
                    variant="primary"
                    size="lg"
                    leftIcon={<MessageCircle className="w-5 h-5 text-white" />}
                    className="w-full bg-[#25D366] hover:bg-[#20BA5A] border-none text-white font-bold shadow-sm"
                  >
                    Hubungi via WhatsApp
                  </Button>
                </a>

                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setOfferModalOpen(true)}
                  className="w-full border-primary/40 text-primary hover:bg-primary-light"
                >
                  Tawarkan Lowongan Saya
                </Button>
              </div>

              {/* Safety & Courtesy Tips */}
              <div className="p-3.5 bg-neutral-light rounded-2xl border border-neutral-border/80 text-[11px] text-neutral-secondary space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-neutral-dark">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span>Panduan Keamanan Wawancara</span>
                </div>
                <p>
                  Gunakan template pesan santun. Selalu lakukan verifikasi KTP fisik saat wawancara pertama di rumah keluarga.
                </p>
              </div>

              {/* Report profile link */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setReportModalOpen(true)}
                  className="text-xs text-neutral-muted hover:text-rose-600 inline-flex items-center gap-1 font-medium"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Laporkan Profil Ini
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL LAPORKAN PROFIL */}
        <Modal
          isOpen={reportModalOpen}
          onClose={() => setReportModalOpen(false)}
          title="Laporkan Profil Kandidat"
          description={`Pengaduan ini akan diproses secara rahasia oleh tim admin ARTin.`}
        >
          {reportSuccess ? (
            <div className="py-6 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-neutral-dark">Laporan Berhasil Dikirim</h4>
              <p className="text-xs text-neutral-secondary">
                Terima kasih atas kepedulian Anda menjaga keamanan platform ARTin. Tim kami akan meninjau laporan ini.
              </p>
            </div>
          ) : (
            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-secondary mb-1">
                  Kategori Pelanggaran
                </label>
                <select
                  value={reportCategory}
                  onChange={(e) => setReportCategory(e.target.value)}
                  className="w-full bg-neutral-light border border-neutral-border text-neutral-dark rounded-xl px-3 py-2 text-xs"
                >
                  <option value="profil_mencurigakan">Profil Mencurigakan / Data Palsu</option>
                  <option value="penipuan">Indikasi Penipuan</option>
                  <option value="kontak_disalahgunakan">Kontak WhatsApp Tidak Valid</option>
                  <option value="pelecehan">Perilaku Tidak Sopan</option>
                  <option value="lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-secondary mb-1">
                  Keterangan Kejadian / Bukti
                </label>
                <textarea
                  required
                  rows={4}
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="Jelaskan alasan laporan Anda dengan objektif..."
                  className="w-full bg-neutral-light border border-neutral-border text-neutral-dark rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setReportModalOpen(false)}
                >
                  Batal
                </Button>
                <Button type="submit" variant="danger" size="sm">
                  Kirim Laporan
                </Button>
              </div>
            </form>
          )}
        </Modal>

        {/* MODAL TAWARKAN LOWONGAN */}
        <Modal
          isOpen={offerModalOpen}
          onClose={() => setOfferModalOpen(false)}
          title="Tawarkan Lowongan Pekerjaan"
          description={`Pilih lowongan keluarga Anda yang ingin ditawarkan kepada ${art.fullName}.`}
        >
          {offerSuccess ? (
            <div className="py-6 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-neutral-dark">Penawaran Berhasil Dikirim</h4>
              <p className="text-xs text-neutral-secondary">
                Undangan wawancara telah disampaikan kepada {art.fullName}. Anda dapat memantau kelanjutannya di dashboard keluarga.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-neutral-secondary">
                Pilih lowongan aktif Anda di Kota Bandar Lampung:
              </p>
              <div className="space-y-2">
                {familyJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-3.5 rounded-xl border border-neutral-border hover:border-primary bg-neutral-light hover:bg-white transition-all cursor-pointer flex items-center justify-between"
                    onClick={() => {
                      setOfferSuccess(true);
                      setTimeout(() => {
                        setOfferModalOpen(false);
                        setOfferSuccess(false);
                      }, 2000);
                    }}
                  >
                    <div>
                      <h4 className="text-xs font-bold text-neutral-dark">{job.title}</h4>
                      <p className="text-[11px] text-neutral-secondary">
                        Kec. {job.district} • {formatCompactRupiah(job.salaryMin)} - {formatCompactRupiah(job.salaryMax)}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs">
                      Pilih
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Modal>
      </main>

      <Footer />
    </div>
  );
}
