import { ArtProfile, EmployerProfile, JobVacancy, Application, VerificationRequest, ReportItem, Skill } from '@/types';

/**
 * Master Skills Metadata (Used for UI categories & filtering)
 * Note: These align with the skills master table in Supabase (20261124000002_seed_skills.sql).
 */
export const INITIAL_SKILLS: Skill[] = [
  { id: 'sk-1', name: 'Pembersihan Rumah Menyeluruh', category: 'Kebersihan', level: 'ahli' },
  { id: 'sk-2', name: 'Memasak Masakan Nusantara', category: 'Kuliner', level: 'ahli' },
  { id: 'sk-3', name: 'Perawatan & Pengasuhan Balita', category: 'Pengasuhan', level: 'ahli' },
  { id: 'sk-4', name: 'Pendampingan Lansia', category: 'Pengasuhan', level: 'menengah' },
  { id: 'sk-5', name: 'Mencuci & Menyetrika Rapi', category: 'Kebersihan', level: 'ahli' },
  { id: 'sk-6', name: 'Perawatan Tanaman & Kebun', category: 'Pekarangan', level: 'menengah' },
  { id: 'sk-7', name: 'Belanja Kebutuhan Dapur', category: 'Rumah Tangga', level: 'ahli' },
  { id: 'sk-8', name: 'Bisa Mengendarai Motor', category: 'Mobilitas', level: 'ahli' },
  { id: 'sk-9', name: 'Memasak Menu Khusus/Diet', category: 'Kuliner', level: 'dasar' },
  { id: 'sk-10', name: 'Pertolongan Pertama (P3K)', category: 'Kesehatan', level: 'menengah' },
];

/**
 * Production Initial Data Stores:
 * All user data, jobs, applications, and verification requests are strictly empty.
 * Real data is loaded dynamically from Supabase database.
 */
export const INITIAL_ART_PROFILES: ArtProfile[] = [];
export const INITIAL_EMPLOYER_PROFILES: EmployerProfile[] = [];
export const INITIAL_JOBS: JobVacancy[] = [];
export const INITIAL_APPLICATIONS: Application[] = [];
export const INITIAL_VERIFICATIONS: VerificationRequest[] = [];
export const INITIAL_REPORTS: ReportItem[] = [];
