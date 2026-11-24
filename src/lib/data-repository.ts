import {
  INITIAL_ART_PROFILES,
  INITIAL_JOBS,
  INITIAL_APPLICATIONS,
  INITIAL_VERIFICATIONS,
  INITIAL_REPORTS,
  INITIAL_SKILLS,
} from './mock-data';
import {
  ArtProfile,
  JobVacancy,
  Application,
  VerificationRequest,
  ReportItem,
  ApplicationStatus,
  VerificationStatus,
  ReportStatus,
  JobType,
} from '@/types';
import { calculateHaversineDistance } from './utils';
import { BANDAR_LAMPUNG_DISTRICTS } from './constants';

// In-memory persistent state for browser session & server actions fallback
let artProfiles = [...INITIAL_ART_PROFILES];
let jobVacancies = [...INITIAL_JOBS];
let applications = [...INITIAL_APPLICATIONS];
let verifications = [...INITIAL_VERIFICATIONS];
let reports = [...INITIAL_REPORTS];

export interface SearchArtParams {
  keyword?: string;
  district?: string;
  referenceLat?: number;
  referenceLng?: number;
  maxDistanceKm?: number;
  minExperience?: number;
  maxSalary?: number;
  jobType?: JobType;
  gender?: 'female' | 'male';
  verifiedOnly?: boolean;
  sortBy?: 'nearest' | 'experience' | 'salary_asc' | 'salary_desc' | 'newest';
}

export function searchArtProfiles(params: SearchArtParams): ArtProfile[] {
  let results = [...artProfiles];

  // 1. Text Keyword Filter (matches name, bio, skills, district)
  if (params.keyword && params.keyword.trim() !== '') {
    const q = params.keyword.toLowerCase().trim();
    results = results.filter(
      (a) =>
        a.fullName.toLowerCase().includes(q) ||
        a.bio?.toLowerCase().includes(q) ||
        a.district.toLowerCase().includes(q) ||
        a.skills.some((s) => s.name.toLowerCase().includes(q))
    );
  }

  // 2. Specific District Filter
  if (params.district && params.district.trim() !== '') {
    results = results.filter((a) =>
      a.district.toLowerCase().includes(params.district!.toLowerCase().trim())
    );
  }

  // 3. Gender Filter
  if (params.gender) {
    results = results.filter((a) => a.gender === params.gender);
  }

  // 4. Job Type Filter
  if (params.jobType) {
    results = results.filter((a) =>
      a.preferredJobTypes.includes(params.jobType!)
    );
  }

  // 5. Min Experience Filter
  if (params.minExperience !== undefined && params.minExperience > 0) {
    results = results.filter((a) => a.experienceYears >= params.minExperience!);
  }

  // 6. Max Salary Filter
  if (params.maxSalary !== undefined && params.maxSalary > 0) {
    results = results.filter((a) => a.expectedSalaryMin <= params.maxSalary!);
  }

  // 7. Verified Only Filter
  if (params.verifiedOnly) {
    results = results.filter((a) => a.verificationStatus === 'verified');
  }

  // 8. Location & Distance Calculation (PostGIS logic mirror)
  let refLat = params.referenceLat;
  let refLng = params.referenceLng;

  // If district specified and no direct coords, use district center coords
  if ((!refLat || !refLng) && params.district) {
    const matchedDistrict = BANDAR_LAMPUNG_DISTRICTS.find(
      (d) => d.name.toLowerCase() === params.district!.toLowerCase()
    );
    if (matchedDistrict) {
      refLat = matchedDistrict.latitude;
      refLng = matchedDistrict.longitude;
    }
  }

  // Calculate distance for all candidates that have location consent
  if (refLat !== undefined && refLng !== undefined) {
    results = results.map((art) => {
      if (art.locationConsent && art.latitude && art.longitude) {
        const dist = calculateHaversineDistance(
          refLat!,
          refLng!,
          art.latitude,
          art.longitude
        );
        return { ...art, distanceKm: dist };
      }
      return { ...art, distanceKm: undefined };
    });

    // Apply Max Radius Filter
    if (params.maxDistanceKm && params.maxDistanceKm > 0) {
      results = results.filter(
        (a) => a.distanceKm !== undefined && a.distanceKm <= params.maxDistanceKm!
      );
    }
  }

  // 9. Sorting
  results.sort((a, b) => {
    if (params.sortBy === 'nearest') {
      if (a.distanceKm !== undefined && b.distanceKm !== undefined) {
        return a.distanceKm - b.distanceKm;
      }
      if (a.distanceKm !== undefined) return -1;
      if (b.distanceKm !== undefined) return 1;
      return 0;
    }
    if (params.sortBy === 'experience') {
      return b.experienceYears - a.experienceYears;
    }
    if (params.sortBy === 'salary_asc') {
      return a.expectedSalaryMin - b.expectedSalaryMin;
    }
    if (params.sortBy === 'salary_desc') {
      return b.expectedSalaryMin - a.expectedSalaryMin;
    }
    // Default newest
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Privacy Protection: Never expose latitude/longitude to public results
  return results.map((a) => ({
    ...a,
    latitude: undefined,
    longitude: undefined,
  }));
}

export function getArtById(id: string): ArtProfile | null {
  const art = artProfiles.find((a) => a.id === id);
  if (!art) return null;
  return {
    ...art,
    latitude: undefined,
    longitude: undefined,
  };
}

export interface SearchJobsParams {
  keyword?: string;
  district?: string;
  jobType?: JobType;
  maxSalary?: number;
  status?: string;
  referenceLat?: number;
  referenceLng?: number;
}

export function searchJobVacancies(params: SearchJobsParams): JobVacancy[] {
  let results = [...jobVacancies];

  if (params.status) {
    results = results.filter((j) => j.status === params.status);
  } else {
    results = results.filter((j) => j.status === 'active');
  }

  if (params.keyword && params.keyword.trim() !== '') {
    const q = params.keyword.toLowerCase().trim();
    results = results.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q) ||
        j.district.toLowerCase().includes(q) ||
        j.employerName.toLowerCase().includes(q)
    );
  }

  if (params.district && params.district.trim() !== '') {
    results = results.filter((j) =>
      j.district.toLowerCase().includes(params.district!.toLowerCase().trim())
    );
  }

  if (params.jobType) {
    results = results.filter((j) => j.jobType === params.jobType);
  }

  if (params.maxSalary) {
    results = results.filter((j) => j.salaryMin <= params.maxSalary!);
  }

  // Distance calculation if reference point available
  if (params.referenceLat && params.referenceLng) {
    results = results.map((job) => {
      const districtMatch = BANDAR_LAMPUNG_DISTRICTS.find(
        (d) => d.name.toLowerCase() === job.district.toLowerCase()
      );
      if (districtMatch) {
        const dist = calculateHaversineDistance(
          params.referenceLat!,
          params.referenceLng!,
          districtMatch.latitude,
          districtMatch.longitude
        );
        return { ...job, distanceKm: dist };
      }
      return job;
    });
  }

  results.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return results;
}

export function getJobById(id: string): JobVacancy | null {
  return jobVacancies.find((j) => j.id === id) || null;
}

// Applications management
export function applyForJob(
  artId: string,
  jobId: string,
  coverLetter: string
): { success: boolean; message: string; application?: Application } {
  const job = jobVacancies.find((j) => j.id === jobId);
  if (!job) {
    return { success: false, message: 'Lowongan pekerjaan tidak ditemukan.' };
  }

  if (job.status !== 'active') {
    return { success: false, message: 'Lowongan ini telah ditutup atau tidak aktif.' };
  }

  const art = artProfiles.find((a) => a.id === artId);
  if (!art) {
    return { success: false, message: 'Profil ART tidak ditemukan.' };
  }

  // Check business rule: Single active application per job for an ART
  const existingApp = applications.find(
    (app) =>
      app.jobId === jobId &&
      app.artId === artId &&
      !['rejected', 'withdrawn'].includes(app.status)
  );

  if (existingApp) {
    return {
      success: false,
      message: 'Anda sudah memiliki lamaran aktif untuk lowongan ini.',
    };
  }

  const newApp: Application = {
    id: `app-${Date.now()}`,
    jobId: job.id,
    jobTitle: job.title,
    employerId: job.employerId,
    employerName: job.employerName,
    employerDistrict: job.district,
    salaryMin: job.salaryMin,
    salaryMax: job.salaryMax,
    artId: art.id,
    artName: art.fullName,
    artAvatar: art.avatarUrl,
    artDistrict: art.district,
    artExperienceYears: art.experienceYears,
    artVerificationStatus: art.verificationStatus,
    artPhone: art.phone,
    coverLetter,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  applications.unshift(newApp);

  // Increment applicant count
  job.applicantCount = (job.applicantCount || 0) + 1;

  return {
    success: true,
    message: 'Lamaran pekerjaan berhasil dikirim ke keluarga pemberi kerja.',
    application: newApp,
  };
}

export function getApplicationsForEmployer(employerId: string): Application[] {
  return applications.filter((app) => app.employerId === employerId);
}

export function getApplicationsForArt(artId: string): Application[] {
  return applications.filter((app) => app.artId === artId);
}

export function updateApplicationStatus(
  appId: string,
  status: ApplicationStatus,
  notes?: string,
  interviewScheduledAt?: string
): { success: boolean; message: string } {
  const app = applications.find((a) => a.id === appId);
  if (!app) return { success: false, message: 'Lamaran tidak ditemukan.' };

  // PRD Business Rule: ART can only withdraw when status is pending or reviewing
  if (status === 'withdrawn') {
    if (!['pending', 'reviewing'].includes(app.status)) {
      return {
        success: false,
        message: 'Lamaran tidak dapat dibatalkan karena sudah masuk tahap wawancara atau telah disetujui/ditolak.',
      };
    }
  }

  app.status = status;
  app.updatedAt = new Date().toISOString();
  if (notes !== undefined) app.notesFromEmployer = notes;
  if (interviewScheduledAt) app.interviewScheduledAt = interviewScheduledAt;

  return { success: true, message: `Status lamaran berhasil diperbarui menjadi ${status}.` };
}

// Vacancies management for Employer
export function createJobVacancy(
  employerId: string,
  employerName: string,
  data: Partial<JobVacancy>
): JobVacancy {
  const newJob: JobVacancy = {
    id: `job-${Date.now()}`,
    employerId,
    employerName,
    employerVerificationStatus: 'unverified',
    title: data.title || 'Lowongan ART Baru',
    description: data.description || '',
    jobType: data.jobType || 'full_time',
    city: 'Bandar Lampung',
    district: data.district || 'Kedaton',
    workAddressSummary: data.workAddressSummary || `Kecamatan ${data.district || 'Kedaton'}`,
    requiredCount: data.requiredCount || 1,
    salaryMin: data.salaryMin || 1800000,
    salaryMax: data.salaryMax || 2500000,
    paymentSchedule: data.paymentSchedule || 'Bulanan',
    workingHours: data.workingHours || '08:00 - 16:00 WIB',
    workingDays: data.workingDays || 'Senin - Sabtu',
    facilities: data.facilities || ['Makan Siang', 'Uang Transport'],
    requirements: data.requirements || ['Pengalaman kerja minimal 1 tahun', 'Jujur dan rajin'],
    status: 'active',
    applicantCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  jobVacancies.unshift(newJob);
  return newJob;
}

export function updateJobVacancy(jobId: string, data: Partial<JobVacancy>): boolean {
  const job = jobVacancies.find((j) => j.id === jobId);
  if (!job) return false;

  Object.assign(job, data, { updatedAt: new Date().toISOString() });
  return true;
}

// Verification management
export function getVerificationRequests(): VerificationRequest[] {
  return [...verifications];
}

export function reviewVerificationRequest(
  requestId: string,
  status: VerificationStatus,
  rejectionReason?: string
): boolean {
  const req = verifications.find((v) => v.id === requestId);
  if (!req) return false;

  req.status = status;
  req.reviewedBy = 'Admin ARTin';
  req.reviewedAt = new Date().toISOString();
  if (rejectionReason) req.rejectionReason = rejectionReason;

  // Update status on profile as well
  const art = artProfiles.find((a) => a.id === req.userId);
  if (art) {
    art.verificationStatus = status;
  }

  return true;
}

export function submitVerificationRequest(data: {
  id?: string;
  userId: string;
  userName: string;
  userRole: 'family' | 'art';
  userDistrict: string;
  idCardUrl: string;
  selfieUrl: string;
  notes?: string;
}): VerificationRequest {
  const newReq: VerificationRequest = {
    id: data.id || `verif-${Date.now()}`,
    userId: data.userId,
    userName: data.userName,
    userRole: data.userRole,
    userDistrict: data.userDistrict,
    idCardUrl: data.idCardUrl,
    selfieUrl: data.selfieUrl,
    notes: data.notes,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  verifications.unshift(newReq);
  return newReq;
}

// Reports & Moderation
export function getReports(): ReportItem[] {
  return [...reports];
}

export function submitReport(data: {
  reporterId: string;
  reporterName: string;
  reportedUserId?: string;
  reportedUserName?: string;
  reportedJobId?: string;
  reportedJobTitle?: string;
  category: any;
  reason: string;
}): ReportItem {
  const newReport: ReportItem = {
    id: `rep-${Date.now()}`,
    reporterId: data.reporterId,
    reporterName: data.reporterName,
    reportedUserId: data.reportedUserId,
    reportedUserName: data.reportedUserName,
    reportedJobId: data.reportedJobId,
    reportedJobTitle: data.reportedJobTitle,
    category: data.category,
    reason: data.reason,
    status: 'open',
    createdAt: new Date().toISOString(),
  };

  reports.unshift(newReport);
  return newReport;
}

export function updateReportStatus(
  reportId: string,
  status: ReportStatus,
  adminNotes?: string
): boolean {
  const rep = reports.find((r) => r.id === reportId);
  if (!rep) return false;

  rep.status = status;
  if (adminNotes) rep.adminNotes = adminNotes;
  rep.resolvedBy = 'Admin ARTin';
  rep.resolvedAt = new Date().toISOString();

  return true;
}

// ART Profile update for logged in ART
export function updateArtProfile(artId: string, data: Partial<ArtProfile>): boolean {
  const art = artProfiles.find((a) => a.id === artId);
  if (!art) return false;

  Object.assign(art, data);
  return true;
}

// Admin Stats Overview
export function getAdminStats() {
  const totalArt = artProfiles.length;
  const totalEmployers = 0;
  const totalUsers = totalArt + totalEmployers;
  const totalActiveJobs = jobVacancies.filter((j) => j.status === 'active').length;
  const totalApplications = applications.length;
  const pendingVerifications = verifications.filter((v) => v.status === 'pending').length;
  const pendingReports = reports.filter((r) => r.status === 'open' || r.status === 'reviewing').length;

  return {
    totalUsers,
    totalArt,
    totalEmployers,
    totalActiveJobs,
    totalApplications,
    pendingVerifications,
    pendingReports,
  };
}
