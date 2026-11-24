'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { VerificationBadge, AvailabilityBadge, JobTypeBadge } from '@/components/ui/Badge';
import {
  getArtById,
  getApplicationsForArt,
  updateApplicationStatus,
  updateArtProfile,
  submitVerificationRequest,
  searchJobVacancies,
} from '@/lib/data-repository';
import { formatCompactRupiah, formatRupiah, formatDateIndo, createWhatsAppUrl } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import { BANDAR_LAMPUNG_DISTRICTS } from '@/lib/constants';
import { Application, ArtProfile, AvailabilityStatus, JobType } from '@/types';
import {
  LayoutDashboard,
  FileText,
  User,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Briefcase,
  Sparkles,
  Phone,
  MessageCircle,
  ToggleLeft,
  ToggleRight,
  Info,
  Calendar,
  AlertCircle,
  Search,
  Lock,
  Loader2,
  Camera,
  UploadCloud,
} from 'lucide-react';

export default function ArtDashboardPage() {
  const { profile, isLoading: isAuthLoading, updateProfile } = useAuth();
  const artId = profile?.role === 'art' ? profile.id : (profile?.id || 'art-user');

  const defaultArtProfile: ArtProfile = {
    id: artId,
    fullName: profile?.full_name || 'Calon Asisten Rumah Tangga',
    avatarUrl: profile?.avatar_url || '/default-avatar.svg',
    gender: 'female',
    age: 28,
    city: 'Bandar Lampung',
    district: profile?.district || 'Kedaton',
    bio: 'Calon asisten rumah tangga siap bekerja dan membantu kebutuhan rumah tangga keluarga Anda.',
    experienceYears: 0,
    preferredJobTypes: ['full_time', 'live_out'],
    expectedSalaryMin: 1500000,
    expectedSalaryMax: 2500000,
    availabilityStatus: 'available',
    workSchedule: 'Pulang Pergi (08:00 - 17:00 WIB)',
    verificationStatus: 'unverified',
    locationConsent: false,
    phone: profile?.phone || '',
    email: profile?.email || '',
    skills: [],
    workExperiences: [],
    createdAt: new Date().toISOString(),
  };

  const initialArt = (artId ? getArtById(artId) : null) || defaultArtProfile;

  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'edit_profile' | 'verification' | 'location'>('overview');

  // Profile Form States
  const [artData, setArtData] = useState<ArtProfile>(initialArt);
  const [fullName, setFullName] = useState(artData.fullName);
  const [avatarUrl, setAvatarUrl] = useState(artData.avatarUrl || '/default-avatar.svg');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [idCardFileUrl, setIdCardFileUrl] = useState('');
  const [selfieFileUrl, setSelfieFileUrl] = useState('');
  const [district, setDistrict] = useState(artData.district);
  const [addressSummary, setAddressSummary] = useState(artData.addressSummary || '');
  const [bio, setBio] = useState(artData.bio || '');
  const [experienceYears, setExperienceYears] = useState(artData.experienceYears);
  const [expectedSalaryMin, setExpectedSalaryMin] = useState(artData.expectedSalaryMin);
  const [expectedSalaryMax, setExpectedSalaryMax] = useState(artData.expectedSalaryMax);
  const [availabilityStatus, setAvailabilityStatus] = useState<AvailabilityStatus>(artData.availabilityStatus);
  const [locationConsent, setLocationConsent] = useState(artData.locationConsent);
  const [workSchedule, setWorkSchedule] = useState(artData.workSchedule || 'Pulang Pergi (08:00 - 17:00 WIB)');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Applications
  const [applications, setApplications] = useState<Application[]>(() => getApplicationsForArt(artId));

  // Verification Form
  const [verifNotes, setVerifNotes] = useState('');
  const [verifSubmitted, setVerifSubmitted] = useState(false);

  const supabase = createClient();

  // Load live data from Supabase
  useEffect(() => {
    if (!artId || artId === 'art-user') return;

    async function loadArtFromSupabase() {
      try {
        // 1. Fetch user profile from profiles table
        const { data: profRow } = await supabase
          .from('profiles')
          .select('id, full_name, phone, email, avatar_url')
          .eq('id', artId)
          .single();

        // 2. Fetch ART details from art_profiles table
        const { data: artProfileRow } = await supabase
          .from('art_profiles')
          .select('*')
          .eq('id', artId)
          .single();

        if (profRow || artProfileRow) {
          setArtData((prev) => ({
            ...prev,
            fullName: profRow?.full_name || prev.fullName,
            avatarUrl: profRow?.avatar_url || prev.avatarUrl,
            district: artProfileRow?.district || prev.district,
            addressSummary: artProfileRow?.address_summary || prev.addressSummary,
            bio: artProfileRow?.bio || prev.bio,
            experienceYears: artProfileRow?.experience_years ?? prev.experienceYears,
            expectedSalaryMin: Number(artProfileRow?.expected_salary_min || prev.expectedSalaryMin),
            expectedSalaryMax: Number(artProfileRow?.expected_salary_max || prev.expectedSalaryMax),
            availabilityStatus: artProfileRow?.availability_status || prev.availabilityStatus,
            workSchedule: artProfileRow?.work_schedule || prev.workSchedule,
            verificationStatus: artProfileRow?.verification_status || prev.verificationStatus,
            locationConsent: artProfileRow?.location_consent ?? prev.locationConsent,
          }));

          if (profRow?.full_name) setFullName(profRow.full_name);
          if (profRow?.avatar_url) setAvatarUrl(profRow.avatar_url);
          if (artProfileRow?.district) setDistrict(artProfileRow.district);
          if (artProfileRow?.bio) setBio(artProfileRow.bio);
          if (artProfileRow?.experience_years != null) setExperienceYears(artProfileRow.experience_years);
          if (artProfileRow?.expected_salary_min != null) setExpectedSalaryMin(Number(artProfileRow.expected_salary_min));
          if (artProfileRow?.expected_salary_max != null) setExpectedSalaryMax(Number(artProfileRow.expected_salary_max));
          if (artProfileRow?.availability_status) setAvailabilityStatus(artProfileRow.availability_status);
          if (artProfileRow?.work_schedule) setWorkSchedule(artProfileRow.work_schedule);
          if (artProfileRow?.location_consent != null) setLocationConsent(artProfileRow.location_consent);
        }

        // 3. Fetch latest verification request
        const { data: verifRow } = await supabase
          .from('verification_requests')
          .select('*')
          .eq('user_id', artId)
          .order('created_at', { ascending: false })
          .limit(1);

        if (verifRow && verifRow.length > 0) {
          const latest = verifRow[0];
          if (latest.status === 'pending') {
            setVerifSubmitted(true);
          }
          if (latest.status) {
            setArtData((prev) => ({ ...prev, verificationStatus: latest.status }));
          }
        }
      } catch (err) {
        console.error('Error fetching ART live data from Supabase:', err);
      }
    }

    loadArtFromSupabase();
  }, [artId]);

  // Keep avatar in sync with AuthProfile
  useEffect(() => {
    if (profile?.avatar_url && (!avatarUrl || avatarUrl === '/default-avatar.svg')) {
      setAvatarUrl(profile.avatar_url);
      setArtData((prev) => ({ ...prev, avatarUrl: profile.avatar_url || prev.avatarUrl }));
    }
  }, [profile?.avatar_url]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Url = reader.result as string;
      setAvatarUrl(base64Url);
      setArtData((prev) => ({ ...prev, avatarUrl: base64Url }));

      try {
        const fileExt = file.name.split('.').pop();
        const filePath = `${artId}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);

        let finalPhotoUrl = base64Url;
        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
          if (publicUrl) {
            finalPhotoUrl = publicUrl;
            setAvatarUrl(publicUrl);
            setArtData((prev) => ({ ...prev, avatarUrl: publicUrl }));
          }
        }

        // Persist avatar_url to profiles table in Supabase
        await supabase.from('profiles').update({ avatar_url: finalPhotoUrl }).eq('id', artId);

        // Update AuthContext & localStorage immediately
        if (updateProfile) {
          updateProfile({ avatar_url: finalPhotoUrl });
        }
        const saved = localStorage.getItem('artin_user_profile');
        if (saved) {
          const p = JSON.parse(saved);
          p.avatar_url = finalPhotoUrl;
          localStorage.setItem('artin_user_profile', JSON.stringify(p));
        }
      } catch (err) {
        console.warn('Photo upload sync error:', err);
      }
      setIsUploadingPhoto(false);
    };
    reader.readAsDataURL(file);
  };

  const handleKtpUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const url = reader.result as string;
      setIdCardFileUrl(url);
      try {
        const fileExt = file.name.split('.').pop();
        const filePath = `ktp-${artId}-${Date.now()}.${fileExt}`;
        await supabase.storage.from('verification-docs').upload(filePath, file);
      } catch {}
    };
    reader.readAsDataURL(file);
  };

  const handleSelfieUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const url = reader.result as string;
      setSelfieFileUrl(url);
      try {
        const fileExt = file.name.split('.').pop();
        const filePath = `selfie-${artId}-${Date.now()}.${fileExt}`;
        await supabase.storage.from('verification-docs').upload(filePath, file);
      } catch {}
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    updateArtProfile(artId, {
      fullName,
      avatarUrl,
      district,
      addressSummary,
      bio,
      experienceYears: Number(experienceYears),
      expectedSalaryMin: Number(expectedSalaryMin),
      expectedSalaryMax: Number(expectedSalaryMax),
      availabilityStatus,
      locationConsent,
      workSchedule,
    });

    try {
      await supabase.from('profiles').update({
        full_name: fullName,
        avatar_url: avatarUrl,
      }).eq('id', artId);

      await supabase.from('art_profiles').upsert({
        id: artId,
        district,
        address_summary: addressSummary,
        bio,
        experience_years: Number(experienceYears),
        expected_salary_min: Number(expectedSalaryMin),
        expected_salary_max: Number(expectedSalaryMax),
        availability_status: availabilityStatus,
        location_consent: locationConsent,
        work_schedule: workSchedule,
      });
    } catch {}

    setArtData({
      ...artData,
      fullName,
      avatarUrl,
      district,
      addressSummary,
      bio,
      experienceYears: Number(experienceYears),
      expectedSalaryMin: Number(expectedSalaryMin),
      expectedSalaryMax: Number(expectedSalaryMax),
      availabilityStatus,
      locationConsent,
      workSchedule,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleWithdrawApplication = (appId: string) => {
    if (confirm('Apakah Anda yakin ingin membatalkan lamaran pekerjaan ini?')) {
      const res = updateApplicationStatus(appId, 'withdrawn');
      if (res.success) {
        setApplications([...getApplicationsForArt(artId)]);
      } else {
        alert(res.message);
      }
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validate active Supabase Auth session
    const { data: { user: authUser } } = await supabase.auth.getUser();
    const effectiveUserId = authUser?.id || (profile?.id !== 'art-user' ? profile?.id : null);

    if (!effectiveUserId) {
      alert('Sesi login Anda belum terhubung dengan Supabase Auth. Silakan login atau buat akun terlebih dahulu.');
      return;
    }

    // 2. Ensure profile exists in profiles table (valid columns only)
    try {
      await supabase.from('profiles').upsert({
        id: effectiveUserId,
        role: 'art',
        full_name: fullName || 'ART Pelamar',
        email: authUser?.email || '',
        status: 'active',
      });

      await supabase.from('art_profiles').upsert({
        id: effectiveUserId,
        district: district || 'Kedaton',
        city: 'Bandar Lampung',
        verification_status: 'pending',
      });
    } catch (e) {
      console.warn('Upsert profile pre-check:', e);
    }

    // 3. Persist to Supabase verification_requests table
    const { data: insertedData, error: insertError } = await supabase
      .from('verification_requests')
      .insert({
        user_id: effectiveUserId,
        role: 'art',
        id_card_url: idCardFileUrl || '/default-avatar.svg',
        selfie_url: selfieFileUrl || avatarUrl || '/default-avatar.svg',
        notes: verifNotes || '',
        status: 'pending',
      })
      .select();

    if (insertError) {
      console.error('Error submitting verification to Supabase:', insertError);
      alert(
        `Gagal menyimpan dokumen verifikasi ke Supabase: ${insertError.message}\n\nPastikan script migrasi GRANT permissions (Migration 04) telah dijalankan di SQL Editor Supabase.`
      );
      return;
    }

    // 4. Update art_profiles table
    try {
      await supabase
        .from('art_profiles')
        .upsert({
          id: effectiveUserId,
          district: district,
          verification_status: 'pending',
        });
    } catch {}

    // 5. Update local state and in-memory fallback
    submitVerificationRequest({
      id: insertedData?.[0]?.id,
      userId: effectiveUserId,
      userName: fullName,
      userRole: 'art',
      userDistrict: district,
      idCardUrl: idCardFileUrl || '/default-avatar.svg',
      selfieUrl: selfieFileUrl || avatarUrl || '/default-avatar.svg',
      notes: verifNotes,
    });
    setVerifSubmitted(true);
    setArtData((prev) => ({ ...prev, verificationStatus: 'pending' }));

    // 6. Call API endpoint for background sync
    try {
      await fetch('/api/verifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: effectiveUserId,
          userName: fullName,
          userRole: 'art',
          userDistrict: district,
          idCardUrl: idCardFileUrl || '/default-avatar.svg',
          selfieUrl: selfieFileUrl || avatarUrl || '/default-avatar.svg',
          notes: verifNotes,
        }),
      });
    } catch {}
  };

  // Recent jobs for quick apply
  const recentJobs = searchJobVacancies({ status: 'active' }).slice(0, 3);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFCFA]">
        <div className="flex items-center gap-2 text-sm text-neutral-secondary font-medium">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span>Memeriksa hak akses calon ART...</span>
        </div>
      </div>
    );
  }

  // Strict Role Guard: Only ART can access ART Dashboard
  if (!profile || profile.role !== 'art') {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAFCFA]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="text-center space-y-4 max-w-md bg-white p-8 rounded-3xl border border-neutral-border shadow-card">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-neutral-dark">Akses Dibatasi: Khusus Akun ART</h2>
            <p className="text-xs text-neutral-secondary leading-relaxed">
              Halaman ini diperuntukkan bagi calon Asisten Rumah Tangga untuk memantau lamaran dan mengelola profil kerja. Silakan masuk dengan akun ART Anda.
            </p>
            <div className="pt-2">
              <Link href="/login">
                <Button variant="primary" size="sm">
                  Masuk sebagai Calon ART
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
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-border shadow-card mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 border border-primary/20 shadow-sm">
                <Image src={artData.avatarUrl} alt={fullName} fill unoptimized className="object-cover" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider text-accent bg-accent-light px-2.5 py-0.5 rounded-full border border-accent-border">
                    Dashboard ART
                  </span>
                  <VerificationBadge status={artData.verificationStatus} size="sm" />
                  <AvailabilityBadge status={availabilityStatus} />
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-neutral-dark tracking-tight">
                  {fullName}
                </h1>
                <p className="text-xs text-neutral-secondary">
                  Kecamatan {district}, Bandar Lampung • {experienceYears} Tahun Pengalaman
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/lowongan">
                <Button variant="primary" size="sm" leftIcon={<Search className="w-4 h-4" />}>
                  Cari Lowongan Baru
                </Button>
              </Link>
              <Link href={`/art/${artId}`}>
                <Button variant="outline" size="sm">
                  Lihat Profil Publik
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto py-3 border-b border-neutral-border text-xs font-semibold mb-6">
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
            onClick={() => setActiveTab('applications')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'applications'
                ? 'bg-primary text-white shadow-xs'
                : 'text-neutral-secondary hover:text-neutral-dark hover:bg-neutral-light'
            }`}
          >
            <FileText className="w-4 h-4" />
            Lamaran Saya ({applications.length})
          </button>

          <button
            onClick={() => setActiveTab('edit_profile')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'edit_profile'
                ? 'bg-primary text-white shadow-xs'
                : 'text-neutral-secondary hover:text-neutral-dark hover:bg-neutral-light'
            }`}
          >
            <User className="w-4 h-4" />
            Edit Profil & Gaji
          </button>

          <button
            onClick={() => setActiveTab('verification')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'verification'
                ? 'bg-primary text-white shadow-xs'
                : 'text-neutral-secondary hover:text-neutral-dark hover:bg-neutral-light'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Verifikasi Identitas
          </button>

          <button
            onClick={() => setActiveTab('location')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'location'
                ? 'bg-primary text-white shadow-xs'
                : 'text-neutral-secondary hover:text-neutral-dark hover:bg-neutral-light'
            }`}
          >
            <MapPin className="w-4 h-4" />
            Pengaturan Jarak & Lokasi
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white rounded-2xl p-5 border border-neutral-border shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-secondary">
                  Kelengkapan Profil
                </span>
                <p className="text-2xl font-black text-primary mt-2">95%</p>
                <span className="text-[11px] text-emerald-700 font-semibold">Siap menerima tawaran kerja</span>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-neutral-border shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-secondary">
                  Status Verifikasi KTP
                </span>
                <div className="mt-2">
                  <VerificationBadge status={artData.verificationStatus} />
                </div>
                <span className="text-[11px] text-neutral-secondary mt-1 block">Telah diverifikasi Admin</span>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-neutral-border shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-secondary">
                  Lamaran Aktif
                </span>
                <p className="text-2xl font-black text-neutral-dark mt-2">
                  {applications.filter((a) => !['rejected', 'withdrawn'].includes(a.status)).length}
                </p>
                <span className="text-[11px] text-neutral-secondary">Dipantau oleh keluarga</span>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-neutral-border shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-secondary">
                  Izin Lokasi Jarak
                </span>
                <p className={`text-base font-bold mt-2 ${locationConsent ? 'text-emerald-700' : 'text-neutral-secondary'}`}>
                  {locationConsent ? '✓ Diaktifkan' : '✕ Dinonaktifkan'}
                </p>
                <span className="text-[11px] text-neutral-secondary">Membantu keluarga melihat estimasi km</span>
              </div>
            </div>

            {/* Applications & Quick Vacancy Discovery */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left: My Applications */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-neutral-border shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-border">
                  <h3 className="text-base font-bold text-neutral-dark flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    Status Lamaran Terakhir
                  </h3>
                  <button
                    onClick={() => setActiveTab('applications')}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    Lihat Semua &rarr;
                  </button>
                </div>

                <div className="space-y-3">
                  {applications.slice(0, 3).map((app) => (
                    <div
                      key={app.id}
                      className="p-4 rounded-2xl bg-neutral-light border border-neutral-border space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-neutral-dark">{app.jobTitle}</h4>
                          <p className="text-[11px] text-neutral-secondary">
                            Pemberi Kerja: <strong>{app.employerName}</strong> ({app.employerDistrict})
                          </p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          app.status === 'interview'
                            ? 'bg-purple-100 text-purple-800'
                            : app.status === 'reviewing'
                            ? 'bg-sky-100 text-sky-800'
                            : app.status === 'accepted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {app.status.toUpperCase()}
                        </span>
                      </div>

                      {app.interviewScheduledAt && (
                        <div className="p-2 rounded-xl bg-purple-50 text-purple-900 border border-purple-200 text-xs flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-purple-600 shrink-0" />
                          <span>Jadwal Wawancara: <strong>{formatDateIndo(app.interviewScheduledAt)}</strong></span>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1 text-xs">
                        <span className="text-neutral-secondary">
                          Diajukan pada {formatDateIndo(app.createdAt)}
                        </span>
                        <Link href={`/lowongan/${app.jobId}`} className="text-primary font-bold hover:underline">
                          Lihat Lowongan
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Lowongan Rekomendasi di Bandar Lampung */}
              <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-neutral-border shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-border">
                  <h3 className="text-base font-bold text-neutral-dark flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-accent" />
                    Lowongan Baru Terbuka
                  </h3>
                  <Link href="/lowongan" className="text-xs font-bold text-primary hover:underline">
                    Semua Lowongan &rarr;
                  </Link>
                </div>

                <div className="space-y-3">
                  {recentJobs.map((job) => (
                    <div
                      key={job.id}
                      className="p-3.5 rounded-2xl bg-[#FAFCFA] border border-neutral-border space-y-1.5"
                    >
                      <h4 className="text-xs font-bold text-neutral-dark line-clamp-1">{job.title}</h4>
                      <p className="text-[11px] text-neutral-secondary">
                        Kec. {job.district} • {formatCompactRupiah(job.salaryMin)} - {formatCompactRupiah(job.salaryMax)}
                      </p>
                      <Link href={`/lowongan/${job.id}`} className="inline-block text-[11px] font-bold text-primary hover:underline pt-1">
                        Lamar Pekerjaan Ini &rarr;
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MY APPLICATIONS LIST */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-neutral-dark">Riwayat Lamaran Pekerjaan Anda</h2>

            <div className="space-y-4">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-2xl p-6 border border-neutral-border shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        app.status === 'interview'
                          ? 'bg-purple-50 text-purple-800 border border-purple-200'
                          : app.status === 'reviewing'
                          ? 'bg-sky-50 text-sky-800 border border-sky-200'
                          : app.status === 'accepted'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : app.status === 'rejected'
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        Status: {app.status.toUpperCase()}
                      </span>
                      <span className="text-xs text-neutral-secondary">
                        Dikirim: {formatDateIndo(app.createdAt)}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-neutral-dark">{app.jobTitle}</h3>
                    <p className="text-xs text-neutral-secondary">
                      Keluarga: <strong>{app.employerName}</strong> • Kecamatan {app.employerDistrict} • Gaji: {formatCompactRupiah(app.salaryMin)} - {formatCompactRupiah(app.salaryMax)}
                    </p>

                    {app.notesFromEmployer && (
                      <div className="p-3 rounded-xl bg-neutral-light border border-neutral-border/80 text-xs text-neutral-dark space-y-1">
                        <span className="font-semibold block text-[11px] text-neutral-secondary">Catatan dari Keluarga:</span>
                        <p>{app.notesFromEmployer}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link href={`/lowongan/${app.jobId}`}>
                      <Button variant="outline" size="sm" className="text-xs">
                        Lihat Lowongan
                      </Button>
                    </Link>

                    {app.status === 'pending' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleWithdrawApplication(app.id)}
                        className="text-xs text-rose-600 hover:bg-rose-50"
                      >
                        Batalkan Lamaran
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: EDIT PROFILE & GAJI */}
        {activeTab === 'edit_profile' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-border shadow-card space-y-6">
              <div className="pb-4 border-b border-neutral-border">
                <h2 className="text-xl font-bold text-neutral-dark">Edit Data Profil & Ekspektasi Kerja</h2>
                <p className="text-xs text-neutral-secondary mt-1">
                  Perbarui informasi agar keluarga dapat mengetahui pengalaman dan ketersediaan Anda dengan akurat.
                </p>
              </div>

              {saveSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span className="font-bold">Perubahan profil Anda berhasil disimpan!</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4">
                {/* Photo Upload Real */}
                <div className="p-4 bg-cream-50 rounded-2xl border border-accent-border/60 flex flex-col sm:flex-row items-center gap-5">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 border-primary/20 shadow-xs bg-white">
                    <Image
                      src={avatarUrl && avatarUrl.trim() !== '' ? avatarUrl : '/default-avatar.svg'}
                      alt="Foto Profil"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-1.5 text-center sm:text-left">
                    <span className="block text-xs font-bold text-neutral-dark">Foto Profil Asli (Calon ART)</span>
                    <p className="text-[11px] text-neutral-secondary">
                      Unggah foto asli Anda yang rapi dan sopan untuk meningkatkan kepercayaan keluarga di Bandar Lampung.
                    </p>
                    <label className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-primary/40 text-primary text-xs font-bold cursor-pointer hover:bg-primary-light transition-colors mt-1">
                      <Camera className="w-3.5 h-3.5" />
                      <span>{isUploadingPhoto ? 'Memproses Foto...' : 'Pilih / Unggah Foto Real'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoUpload}
                      />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Nama Lengkap"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />

                  <Select
                    label="Status Ketersediaan Bekerja"
                    value={availabilityStatus}
                    onChange={(e: any) => setAvailabilityStatus(e.target.value)}
                  >
                    <option value="available">Siap Bekerja (Tersedia)</option>
                    <option value="busy">Sedang Bekerja (Sibuk)</option>
                    <option value="not_available">Tidak Tersedia</option>
                  </Select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Kecamatan Domisili"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                  >
                    {BANDAR_LAMPUNG_DISTRICTS.map((d) => (
                      <option key={d.name} value={d.name}>
                        Kecamatan {d.name}
                      </option>
                    ))}
                  </Select>

                  <Input
                    label="Pengalaman Kerja (Tahun)"
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                  />
                </div>

                <Input
                  label="Area Domisili Umum (Tanpa Alamat Rumah Presisi)"
                  placeholder="Contoh: Kedaton, dekat RS Advent atau Jl. ZA Pagar Alam"
                  value={addressSummary}
                  onChange={(e) => setAddressSummary(e.target.value)}
                  helperText="Hanya nama area umum yang akan dilihat publik demi privasi Anda."
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Ekspektasi Gaji Min (Rp/Bulan)"
                    type="number"
                    value={expectedSalaryMin}
                    onChange={(e) => setExpectedSalaryMin(Number(e.target.value))}
                  />

                  <Input
                    label="Ekspektasi Gaji Max (Rp/Bulan)"
                    type="number"
                    value={expectedSalaryMax}
                    onChange={(e) => setExpectedSalaryMax(Number(e.target.value))}
                  />
                </div>

                <Input
                  label="Pilihan Jam / Sistem Kerja"
                  placeholder="Contoh: Pulang Pergi (08.00 - 17.00 WIB) atau Menginap"
                  value={workSchedule}
                  onChange={(e) => setWorkSchedule(e.target.value)}
                />

                <Textarea
                  label="Deskripsi Diri & Keahlian (Bio)"
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Ceritakan keahlian Anda, misalnya masakan yang dikuasai, cara merawat anak, menyetrika rapi, dll..."
                />

                <div className="pt-4 flex justify-end">
                  <Button type="submit" variant="primary" className="font-bold">
                    Simpan Perubahan Profil
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 4: VERIFIKASI IDENTITAS */}
        {activeTab === 'verification' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-border shadow-card space-y-6">
              <div className="pb-4 border-b border-neutral-border">
                <div className="flex items-center gap-2 mb-1">
                  <VerificationBadge status={artData.verificationStatus} />
                </div>
                <h2 className="text-xl font-bold text-neutral-dark">Pengajuan Verifikasi KTP</h2>
                <p className="text-xs text-neutral-secondary mt-1">
                  Tanda verified meningkatkan kepercayaan keluarga hingga 4 kali lipat di Bandar Lampung.
                </p>
              </div>

              {artData.verificationStatus === 'verified' ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Akun Anda Telah Resmi Terverifikasi</span>
                  </div>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    Dokumen KTP Anda telah diperiksa dan disetujui oleh tim operasional ARTin Bandar Lampung. Lencana <strong>Verified</strong> kini tampil pada kartu profil Anda saat keluarga mencari ART.
                  </p>
                </div>
              ) : verifSubmitted || artData.verificationStatus === 'pending' ? (
                <div className="p-5 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 font-bold text-amber-800">
                    <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                    <span>Pengajuan Verifikasi Sedang Ditinjau Admin</span>
                  </div>
                  <p className="leading-relaxed">
                    Dokumen identitas Anda telah masuk ke sistem antrean verifikasi ARTin dan sedang diperiksa oleh staf pemeriksa.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleVerificationSubmit} className="space-y-4">
                  <div className="p-4 rounded-2xl bg-cream-50 border border-accent-border/70 text-xs text-neutral-secondary space-y-1">
                    <span className="font-bold text-neutral-dark block">Ketentuan Dokumen KTP</span>
                    <p>
                      Pastikan tulisan pada KTP terbaca jelas dan tidak buram. Foto selfie memegang identitas diri harus menunjukkan wajah Anda dengan jelas.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-secondary mb-1">
                      Foto KTP Asli (Dokumen Pribadi)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleKtpUpload}
                      className="w-full text-xs text-neutral-secondary file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary-light file:text-primary hover:file:bg-primary/20 cursor-pointer"
                    />
                    {idCardFileUrl && (
                      <p className="text-[11px] text-emerald-700 font-bold mt-1">✓ Berkas KTP berhasil dipilih</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-secondary mb-1">
                      Foto Selfie Memegang KTP Asli
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSelfieUpload}
                      className="w-full text-xs text-neutral-secondary file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary-light file:text-primary hover:file:bg-primary/20 cursor-pointer"
                    />
                    {selfieFileUrl && (
                      <p className="text-[11px] text-emerald-700 font-bold mt-1">✓ Foto selfie berhasil dipilih</p>
                    )}
                  </div>

                  <Textarea
                    label="Catatan atau Keterangan Tambahan untuk Admin (Opsional)"
                    rows={3}
                    placeholder="Contoh: KTP Kota Bandar Lampung, nomor telepon dapat dihubungi melalui WhatsApp..."
                    value={verifNotes}
                    onChange={(e) => setVerifNotes(e.target.value)}
                  />

                  <Button type="submit" variant="primary" className="w-full font-bold">
                    Kirim Dokumen Verifikasi
                  </Button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: PENGATURAN JARAK & PRIVASI */}
        {activeTab === 'location' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-border shadow-card space-y-6">
              <div className="pb-4 border-b border-neutral-border">
                <h2 className="text-xl font-bold text-neutral-dark">Pengaturan Lokasi & Persetujuan Jarak</h2>
                <p className="text-xs text-neutral-secondary mt-1">
                  Atur persetujuan perhitungan jarak garis lurus untuk pencarian oleh keluarga di Bandar Lampung.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-light border border-neutral-border space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="block text-sm font-bold text-neutral-dark">
                      Persetujuan Penggunaan Data Lokasi
                    </span>
                    <span className="block text-xs text-neutral-secondary mt-0.5 max-w-sm">
                      Mengizinkan platform ARTin menghitung estimasi jarak (dalam km) antara domisili Anda dengan calon majikan.
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const next = !locationConsent;
                      setLocationConsent(next);
                      updateArtProfile(artId, { locationConsent: next });
                    }}
                    className={`p-2 rounded-2xl border transition-all ${
                      locationConsent
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-neutral-secondary border-neutral-border'
                    }`}
                  >
                    {locationConsent ? (
                      <span className="text-xs font-bold px-2 py-0.5">Aktif</span>
                    ) : (
                      <span className="text-xs font-semibold px-2 py-0.5">Nonaktif</span>
                    )}
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-cream-50 border border-accent-border/70 text-xs text-neutral-secondary space-y-2">
                <div className="flex items-center gap-2 font-bold text-neutral-dark">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span>Jaminan Privasi Alamat Rumah</span>
                </div>
                <p className="leading-relaxed">
                  Sesuai PRD ARTin, koordinat GPS presisi dan alamat rumah Anda <strong>tidak pernah dipublikasikan</strong> secara terbuka. Keluarga hanya dapat melihat nama kecamatan (misal: "Kecamatan Kedaton") dan jarak perkiraan dalam kilometer (misal: "2.4 km dari lokasi Anda").
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
