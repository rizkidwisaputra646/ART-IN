'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
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
import { Application, JobVacancy, JobType, ApplicationStatus, VerificationStatus } from '@/types';
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
  Camera,
  AlertCircle,
} from 'lucide-react';

export default function FamilyDashboardPage() {
  const { profile, isLoading: isAuthLoading, promoteToAdmin, updateProfile } = useAuth();
  const employerId = profile?.id || 'emp-1';

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

  // Profile Editor State
  const [contactPerson, setContactPerson] = useState(profile?.full_name || 'Keluarga');
  const [contactPhone, setContactPhone] = useState(profile?.phone || '');
  const [familyDistrict, setFamilyDistrict] = useState(profile?.district || 'Kedaton');
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

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
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('unverified');
  const [verifRejectionReason, setVerifRejectionReason] = useState<string | null>(null);
  const [verifNotes, setVerifNotes] = useState('');
  const [verifSubmitted, setVerifSubmitted] = useState(false);
  const [idCardFileUrl, setIdCardFileUrl] = useState('');
  const [selfieFileUrl, setSelfieFileUrl] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '/default-avatar.svg');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const supabase = createClient();

  const handleKtpUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const url = reader.result as string;
      setIdCardFileUrl(url);
      try {
        const fileExt = file.name.split('.').pop();
        const filePath = `ktp-${employerId}-${Date.now()}.${fileExt}`;
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
        const filePath = `selfie-${employerId}-${Date.now()}.${fileExt}`;
        await supabase.storage.from('verification-docs').upload(filePath, file);
      } catch {}
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Url = reader.result as string;
      setAvatarUrl(base64Url);

      try {
        const fileExt = file.name.split('.').pop();
        const filePath = `emp-${employerId}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);

        let finalPhotoUrl = base64Url;
        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
          if (publicUrl) {
            finalPhotoUrl = publicUrl;
            setAvatarUrl(publicUrl);
          }
        }

        // Persist avatar to profiles table in Supabase
        await supabase.from('profiles').update({ avatar_url: finalPhotoUrl }).eq('id', employerId);

        // Update AuthContext & localStorage cache immediately
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
        console.warn('Family photo upload sync error:', err);
      }
      setIsUploadingPhoto(false);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!employerId) return;
    async function loadEmployerData() {
      try {
        // Sync profile fields into form
        if (profile?.avatar_url) {
          setAvatarUrl(profile.avatar_url);
        }
        if (profile?.full_name) {
          setContactPerson(profile.full_name);
        }
        if (profile?.phone) {
          setContactPhone(profile.phone);
        }
        if (profile?.district) {
          setFamilyDistrict(profile.district);
        }

        // 1. Load Vacancies
        const { data } = await supabase
          .from('job_vacancies')
          .select('*')
          .eq('employer_id', employerId)
          .order('created_at', { ascending: false });

        if (data && data.length > 0) {
          setVacancies(data.map((j: any) => ({
            id: j.id,
            employerId: j.employer_id,
            employerName: profile?.full_name || 'Keluarga',
            employerVerificationStatus: verificationStatus || 'unverified',
            city: 'Bandar Lampung',
            requiredCount: 1,
            paymentSchedule: 'Bulanan',
            title: j.title,
            description: j.description,
            district: j.district,
            jobType: j.job_type,
            salaryMin: Number(j.salary_min),
            salaryMax: Number(j.salary_max),
            workingHours: j.working_hours,
            workingDays: j.working_days,
            facilities: Array.isArray(j.facilities) ? j.facilities : [],
            requirements: Array.isArray(j.requirements) ? j.requirements : [],
            status: j.status,
            createdAt: j.created_at || new Date().toISOString(),
            updatedAt: j.updated_at || j.created_at || new Date().toISOString(),
          })));
        }

        // 2. Load Employer Profile & Verification Status
        const { data: empProf } = await supabase
          .from('employer_profiles')
          .select('*')
          .eq('id', employerId)
          .single();

        if (empProf?.verification_status) {
          setVerificationStatus(empProf.verification_status);
        }
        if (empProf?.contact_person) {
          setContactPerson(empProf.contact_person);
        }
        if (empProf?.district) {
          setFamilyDistrict(empProf.district);
        }
        if (empProf?.phone) {
          setContactPhone(empProf.phone);
        }

        // 3. Load latest verification request
        const { data: verifRow } = await supabase
          .from('verification_requests')
          .select('*')
          .eq('user_id', employerId)
          .order('created_at', { ascending: false })
          .limit(1);

        if (verifRow && verifRow.length > 0) {
          const latest = verifRow[0];
          if (latest.status === 'pending') {
            setVerifSubmitted(true);
          }
          if (latest.status) {
            setVerificationStatus(latest.status);
          }
          if (latest.rejection_reason) {
            setVerifRejectionReason(latest.rejection_reason);
          }
        }
      } catch (err) {
        console.warn('Error loading employer live data:', err);
      }
    }
    loadEmployerData();
  }, [employerId, profile]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Update profiles table
      await supabase.from('profiles').update({
        full_name: contactPerson,
        phone: contactPhone,
        district: familyDistrict,
        avatar_url: avatarUrl,
      }).eq('id', employerId);

      // 2. Upsert employer_profiles table
      await supabase.from('employer_profiles').upsert({
        id: employerId,
        contact_person: contactPerson,
        phone: contactPhone,
        district: familyDistrict,
      });

      // 3. Update AuthContext & localStorage
      if (updateProfile) {
        updateProfile({
          full_name: contactPerson,
          phone: contactPhone,
          district: familyDistrict,
          avatar_url: avatarUrl,
        });
      }

      setProfileSaveSuccess(true);
      setTimeout(() => setProfileSaveSuccess(false), 2000);
    } catch (err) {
      console.warn('Save family profile error:', err);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Persist directly to Supabase without passing pseudo ID
      const { data: insertedJob, error: jobInsertError } = await supabase
        .from('job_vacancies')
        .insert({
          employer_id: employerId,
          title: newTitle,
          description: newDescription,
          district: newDistrict,
          job_type: newJobType,
          salary_min: Number(newSalaryMin),
          salary_max: Number(newSalaryMax),
          working_hours: newWorkingHours,
          working_days: newWorkingDays,
          facilities: newFacilities.split(',').map((s) => s.trim()),
          requirements: newRequirements.split(',').map((s) => s.trim()),
          status: 'active',
        })
        .select()
        .single();

      if (jobInsertError) {
        console.error('Job vacancy insert error:', jobInsertError);
        alert(`Gagal menyimpan lowongan ke Supabase: ${jobInsertError.message}`);
        return;
      }

      const created: JobVacancy = {
        id: insertedJob.id,
        employerId: insertedJob.employer_id,
        employerName: profile?.full_name || contactPerson || 'Keluarga',
        employerVerificationStatus: verificationStatus,
        city: 'Bandar Lampung',
        requiredCount: 1,
        paymentSchedule: 'Bulanan',
        title: insertedJob.title,
        description: insertedJob.description,
        district: insertedJob.district,
        jobType: insertedJob.job_type,
        salaryMin: Number(insertedJob.salary_min),
        salaryMax: Number(insertedJob.salary_max),
        workingHours: insertedJob.working_hours,
        workingDays: insertedJob.working_days,
        facilities: Array.isArray(insertedJob.facilities) ? insertedJob.facilities : [],
        requirements: Array.isArray(insertedJob.requirements) ? insertedJob.requirements : [],
        status: 'active',
        applicantCount: 0,
        createdAt: insertedJob.created_at || new Date().toISOString(),
        updatedAt: insertedJob.updated_at || new Date().toISOString(),
      };

      setVacancies([created, ...vacancies]);
      setCreateSuccess(true);
      setTimeout(() => {
        setCreateSuccess(false);
        setActiveTab('vacancies');
        setNewTitle('');
        setNewDescription('');
      }, 1500);
    } catch (err: any) {
      console.error('Error creating job vacancy:', err);
      alert(`Terjadi kesalahan saat membuat lowongan: ${err.message}`);
    }
  };

  const handleStatusChange = async (appId: string, newStatus: ApplicationStatus) => {
    updateApplicationStatus(appId, newStatus, statusNote, interviewDate);
    setApplications([...getApplicationsForEmployer(employerId)]);
    if (selectedApp && selectedApp.id === appId) {
      setSelectedApp({ ...selectedApp, status: newStatus });
    }

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(appId);
    if (isUuid) {
      try {
        await supabase.from('applications').update({
          status: newStatus,
          notes_from_employer: statusNote || null,
          interview_scheduled_at: interviewDate || null,
          updated_at: new Date().toISOString(),
        }).eq('id', appId);
      } catch (e) {
        console.warn('Update application error:', e);
      }
    }
  };

  const handleToggleJobStatus = async (jobId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'closed' : 'active';
    updateJobVacancy(jobId, { status: nextStatus as any });
    try {
      await supabase.from('job_vacancies').update({ status: nextStatus }).eq('id', jobId);
    } catch {}
    setVacancies(vacancies.map((j) => (j.id === jobId ? { ...j, status: nextStatus as any } : j)));
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validate active Supabase Auth session
    const { data: { user: authUser } } = await supabase.auth.getUser();
    const effectiveUserId = authUser?.id || (employerId !== 'emp-1' ? employerId : null);

    if (!effectiveUserId) {
      alert('Sesi login Anda belum terhubung dengan Supabase Auth. Silakan masuk terlebih dahulu.');
      return;
    }

    // 2. Ensure profile exists in profiles table (valid columns only)
    try {
      await supabase.from('profiles').upsert({
        id: effectiveUserId,
        role: 'family',
        full_name: profile?.full_name || 'Keluarga Pencari ART',
        email: authUser?.email || '',
        status: 'active',
      });

      await supabase.from('employer_profiles').upsert({
        id: effectiveUserId,
        contact_person: profile?.full_name || 'Keluarga Pencari ART',
        district: newDistrict || 'Kedaton',
        city: 'Bandar Lampung',
        verification_status: 'pending',
      });
    } catch (e) {
      console.warn('Upsert employer profile pre-check:', e);
    }

    // 3. Persist to Supabase verification_requests table
    const { data: insertedData, error: insertError } = await supabase
      .from('verification_requests')
      .insert({
        user_id: effectiveUserId,
        role: 'family',
        id_card_url: idCardFileUrl || '/default-avatar.svg',
        selfie_url: selfieFileUrl || '/default-avatar.svg',
        notes: verifNotes || '',
        status: 'pending',
      })
      .select();

    if (insertError) {
      console.error('Error submitting employer verification to Supabase:', insertError);
      alert(
        `Gagal menyimpan dokumen verifikasi ke Supabase: ${insertError.message}\n\nPastikan script migrasi GRANT permissions (Migration 04) telah dijalankan di SQL Editor Supabase.`
      );
      return;
    }

    // 4. Update employer_profiles table
    try {
      await supabase
        .from('employer_profiles')
        .upsert({
          id: effectiveUserId,
          contact_person: profile?.full_name || 'Keluarga Pencari ART',
          district: newDistrict,
          verification_status: 'pending',
        });
    } catch {}

    // 5. Update local state
    submitVerificationRequest({
      id: insertedData?.[0]?.id,
      userId: effectiveUserId,
      userName: profile?.full_name || 'Keluarga Pencari ART',
      userRole: 'family',
      userDistrict: newDistrict,
      idCardUrl: idCardFileUrl || '/default-avatar.svg',
      selfieUrl: selfieFileUrl || '/default-avatar.svg',
      notes: verifNotes,
    });
    setVerifSubmitted(true);

    // 6. Background sync call
    try {
      await fetch('/api/verifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: effectiveUserId,
          userName: profile?.full_name || 'Keluarga Pencari ART',
          userRole: 'family',
          userDistrict: newDistrict,
          idCardUrl: idCardFileUrl || '/default-avatar.svg',
          selfieUrl: selfieFileUrl || '/default-avatar.svg',
          notes: verifNotes,
        }),
      });
    } catch {}
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

  // If authenticated as Admin, guide to Admin Dashboard
  if (profile?.role === 'admin') {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAFCFA]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="text-center space-y-4 max-w-md bg-white p-8 rounded-3xl border border-neutral-border shadow-card">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-neutral-dark">Anda Masuk Sebagai Administrator</h2>
            <p className="text-xs text-neutral-secondary leading-relaxed">
              Akun Anda memiliki izin penuh Administrator ARTin untuk mengelola antrean verifikasi KTP, lowongan kerja, dan laporan masyarakat.
            </p>
            <div className="pt-2">
              <Link href="/admin">
                <Button variant="primary" size="md" className="font-bold">
                  Buka Dashboard Admin &rarr;
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
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
        {/* Admin Detection Banner */}
        {((profile?.email || '').toLowerCase().includes('admin') || (profile?.full_name || '').toLowerCase().trim() === 'admin') && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
              <div>
                <p className="text-xs font-bold text-emerald-900">Akun Anda Terdaftar sebagai Operator Admin</p>
                <p className="text-[11px] text-emerald-700">Anda dapat langsung beralih ke Admin Dashboard untuk memeriksa dan menyetujui verifikasi KTP serta moderasi platform.</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="primary"
              onClick={async () => {
                if (promoteToAdmin) await promoteToAdmin();
                window.location.href = '/admin';
              }}
              className="text-xs font-bold shrink-0"
            >
              Buka Dashboard Admin &rarr;
            </Button>
          </div>
        )}

        {/* Top Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-border shadow-card mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 border border-primary/20 shadow-sm bg-cream">
                <Image
                  src={avatarUrl && avatarUrl.trim() !== '' ? avatarUrl : '/default-avatar.svg'}
                  alt={contactPerson}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary-light px-2.5 py-0.5 rounded-full">
                    Dashboard Keluarga
                  </span>
                  <VerificationBadge status={verificationStatus} size="sm" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-dark tracking-tight">
                  {contactPerson}
                </h1>
                <p className="text-xs text-neutral-secondary">
                  Kecamatan {familyDistrict}, Kota Bandar Lampung
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
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
                          <Image src={app.artAvatar} alt={app.artName} fill unoptimized className="object-cover" />
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
                      <Image src={app.artAvatar} alt={app.artName} fill unoptimized className="object-cover" />
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
            {/* 1. Profil & Foto Profil Keluarga */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-border shadow-card space-y-6">
              <div className="pb-4 border-b border-neutral-border">
                <h2 className="text-xl font-bold text-neutral-dark">Profil & Foto Keluarga</h2>
                <p className="text-xs text-neutral-secondary mt-1">
                  Atur foto profil dan data kontak penanggung jawab keluarga pemberi kerja di Bandar Lampung.
                </p>
              </div>

              {profileSaveSuccess && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Profil dan foto keluarga berhasil disimpan ke sistem!</span>
                </div>
              )}

              {/* Photo Upload Real */}
              <div className="p-4 bg-cream-50 rounded-2xl border border-accent-border/60 flex flex-col sm:flex-row items-center gap-5">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 border-primary/20 shadow-xs bg-white">
                  <Image
                    src={avatarUrl && avatarUrl.trim() !== '' ? avatarUrl : '/default-avatar.svg'}
                    alt="Foto Profil Keluarga"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 space-y-1.5 text-center sm:text-left">
                  <span className="block text-xs font-bold text-neutral-dark">Foto Profil Asli Keluarga</span>
                  <p className="text-[11px] text-neutral-secondary">
                    Unggah foto asli Anda / keluarga agar profil terlihat terpercaya bagi para ART pelamar.
                  </p>
                  <label className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-primary/40 text-primary text-xs font-bold cursor-pointer hover:bg-primary-light transition-colors mt-1">
                    <Camera className="w-3.5 h-3.5" />
                    <span>{isUploadingPhoto ? 'Memproses Foto...' : 'Pilih / Unggah Foto'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                  </label>
                </div>
              </div>

              {/* Form Data Keluarga */}
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <Input
                  label="Nama Lengkap Penanggung Jawab"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder="Contoh: Ibu Maya Lestari / Bpk. Hendra"
                  required
                />

                <Input
                  label="Nomor WhatsApp / Kontak"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="Contoh: 0812-3456-7890"
                />

                <Select
                  label="Kecamatan Domisili (Bandar Lampung)"
                  value={familyDistrict}
                  onChange={(e) => setFamilyDistrict(e.target.value)}
                >
                  {BANDAR_LAMPUNG_DISTRICTS.map((d) => (
                    <option key={d.name} value={d.name}>
                      Kecamatan {d.name}
                    </option>
                  ))}
                </Select>

                <Button type="submit" variant="primary" className="w-full font-bold">
                  Simpan Perubahan Profil
                </Button>
              </form>
            </div>

            {/* 2. Verifikasi Identitas KTP */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-border shadow-card space-y-6">
              <div className="pb-4 border-b border-neutral-border">
                <h2 className="text-xl font-bold text-neutral-dark">Verifikasi Akun Resmi</h2>
                <p className="text-xs text-neutral-secondary mt-1">
                  Akun yang terverifikasi mendapatkan lencana resmi <strong>Verified</strong> dan menarik lebih banyak pelamar berkualitas di Bandar Lampung.
                </p>
              </div>

              {verificationStatus === 'verified' ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Akun Keluarga Anda Telah Resmi Terverifikasi</span>
                  </div>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    Dokumen KTP penanggung jawab keluarga Anda telah diperiksa dan disetujui oleh tim operasional ARTin. Lencana resmi <strong>Verified</strong> kini aktif pada profil keluarga dan lowongan pekerjaan Anda.
                  </p>
                  {verifRejectionReason && (
                    <p className="text-xs text-emerald-800 bg-white/70 p-2.5 rounded-xl border border-emerald-300/50 mt-1">
                      Catatan Verifikator: &ldquo;{verifRejectionReason}&rdquo;
                    </p>
                  )}
                </div>
              ) : verifSubmitted || verificationStatus === 'pending' ? (
                <div className="p-5 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 font-bold text-amber-800">
                    <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                    <span>Dokumen Verifikasi Sedang Ditinjau Admin</span>
                  </div>
                  <p className="leading-relaxed">
                    Admin ARTin sedang memeriksa keaslian KTP Anda dalam 1x24 jam. Dokumen disimpan secara terproteksi di private storage.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleVerificationSubmit} className="space-y-4">
                  {(verificationStatus === 'requires_revision' || verificationStatus === 'rejected') && (
                    <div className="p-4 bg-rose-50 border border-rose-200 text-rose-900 rounded-2xl text-xs space-y-1">
                      <div className="flex items-center gap-2 font-bold text-rose-800">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>Verifikasi Memerlukan Revisi / Ditolak</span>
                      </div>
                      <p>
                        Catatan Admin: <strong>&ldquo;{verifRejectionReason || 'Silakan unggah kembali foto KTP yang lebih jelas dan sesuai.'}&rdquo;</strong>
                      </p>
                      <p className="text-rose-700 text-[11px] pt-1">
                        Silakan unggah ulang foto dokumen KTP Anda di bawah ini untuk ditinjau kembali oleh tim moderasi.
                      </p>
                    </div>
                  )}

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
                      onChange={handleKtpUpload}
                      className="w-full text-xs text-neutral-secondary file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary-light file:text-primary hover:file:bg-primary/20 cursor-pointer"
                    />
                    {idCardFileUrl && (
                      <p className="text-[11px] text-emerald-700 font-bold mt-1">✓ Berkas KTP berhasil dipilih</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-secondary mb-1">
                      Foto Selfie dengan KTP (Opsional)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSelfieUpload}
                      className="w-full text-xs text-neutral-secondary file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary-light file:text-primary hover:file:bg-primary/20 cursor-pointer"
                    />
                    {selfieFileUrl && (
                      <p className="text-[11px] text-emerald-700 font-bold mt-1">✓ Berkas selfie berhasil dipilih</p>
                    )}
                  </div>

                  <Textarea
                    label="Catatan Tambahan untuk Admin (Opsional)"
                    rows={3}
                    placeholder="Contoh: KTP domisili Sukarame, siap diverifikasi melalui telepon..."
                    value={verifNotes}
                    onChange={(e) => setVerifNotes(e.target.value)}
                  />

                  <Button type="submit" variant="primary" className="w-full font-bold">
                    {verificationStatus === 'requires_revision' || verificationStatus === 'rejected'
                      ? 'Kirim Ulang Dokumen Verifikasi'
                      : 'Ajukan Verifikasi Identitas'}
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
