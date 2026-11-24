export type UserRole = 'family' | 'art' | 'admin';

export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected' | 'requires_revision';

export type AvailabilityStatus = 'available' | 'busy' | 'not_available';

export type JobType = 'full_time' | 'part_time' | 'live_in' | 'live_out';

export type ApplicationStatus = 'pending' | 'reviewing' | 'interview' | 'accepted' | 'rejected' | 'withdrawn';

export type ReportCategory = 'penipuan' | 'lowongan_palsu' | 'profil_mencurigakan' | 'kontak_disalahgunakan' | 'pelecehan' | 'lainnya';

export type ReportStatus = 'open' | 'reviewing' | 'resolved' | 'rejected';

export interface Skill {
  id: string;
  name: string;
  category: string;
  icon?: string;
  level?: 'dasar' | 'menengah' | 'ahli';
}

export interface WorkExperience {
  id: string;
  artId: string;
  title: string;
  employerName?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
  referenceContact?: string;
  referenceConsent: boolean;
}

export interface ArtProfile {
  id: string;
  fullName: string;
  avatarUrl: string;
  gender: 'female' | 'male';
  birthDate?: string;
  age: number;
  city: string;
  district: string;
  addressSummary?: string;
  bio: string;
  experienceYears: number;
  preferredJobTypes: JobType[];
  expectedSalaryMin: number;
  expectedSalaryMax: number;
  availabilityStatus: AvailabilityStatus;
  workSchedule?: string;
  verificationStatus: VerificationStatus;
  locationConsent: boolean;
  latitude?: number; // Only used internally server-side or mock, never exposed in public cards
  longitude?: number;
  distanceKm?: number; // Calculated relative to search point
  skills: Skill[];
  workExperiences?: WorkExperience[];
  phone?: string; // Only shown when user has permission / contacted
  email?: string;
  ratingAverage?: number;
  completedJobsCount?: number;
  createdAt: string;
}

export interface EmployerProfile {
  id: string;
  fullName: string;
  contactPerson?: string;
  avatarUrl?: string;
  phone: string;
  email: string;
  city: string;
  district: string;
  workAddressSummary?: string;
  workAddress?: string; // Private
  verificationStatus: VerificationStatus;
  createdAt: string;
}

export interface JobVacancy {
  id: string;
  employerId: string;
  employerName: string;
  employerAvatar?: string;
  employerVerificationStatus: VerificationStatus;
  title: string;
  description: string;
  jobType: JobType;
  city: string;
  district: string;
  workAddressSummary?: string;
  requiredCount: number;
  salaryMin: number;
  salaryMax: number;
  paymentSchedule: 'Harian' | 'Mingguan' | 'Bulanan';
  workingHours: string;
  workingDays: string;
  facilities: string[];
  requirements: string[];
  startDate?: string;
  status: 'draft' | 'pending_moderation' | 'active' | 'closed' | 'rejected';
  applicantCount?: number;
  distanceKm?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  employerId: string;
  employerName: string;
  employerDistrict: string;
  salaryMin: number;
  salaryMax: number;
  artId: string;
  artName: string;
  artAvatar: string;
  artDistrict: string;
  artExperienceYears: number;
  artVerificationStatus: VerificationStatus;
  artPhone?: string;
  coverLetter?: string;
  status: ApplicationStatus;
  notesFromEmployer?: string;
  interviewScheduledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VerificationRequest {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  userDistrict: string;
  idCardUrl: string;
  selfieUrl: string;
  certificateUrls?: string[];
  notes?: string;
  status: VerificationStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  createdAt: string;
}

export interface ReportItem {
  id: string;
  reporterId: string;
  reporterName: string;
  reportedUserId?: string;
  reportedUserName?: string;
  reportedJobId?: string;
  reportedJobTitle?: string;
  category: ReportCategory;
  reason: string;
  evidenceUrls?: string[];
  status: ReportStatus;
  adminNotes?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  createdAt: string;
}

export interface DistrictLocation {
  name: string;
  latitude: number;
  longitude: number;
}
