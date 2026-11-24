import React from 'react';
import Link from 'next/link';
import { JobVacancy } from '@/types';
import { VerificationBadge, JobTypeBadge, DistanceBadge } from './Badge';
import { Button } from './Button';
import { formatCompactRupiah, formatDateIndo } from '@/lib/utils';
import { MapPin, Clock, Calendar, CheckCircle, ChevronRight, UserCheck } from 'lucide-react';

interface JobCardProps {
  job: JobVacancy;
  showDistance?: boolean;
}

export function JobCard({ job, showDistance = true }: JobCardProps) {
  return (
    <div className="group bg-white rounded-2xl border border-neutral-border/90 hover:border-primary/40 shadow-card hover:shadow-hover transition-all duration-300 flex flex-col justify-between overflow-hidden">
      <div className="p-5 md:p-6 pb-3">
        {/* Top meta: Date & Job type */}
        <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
          <div className="flex items-center gap-2">
            <JobTypeBadge jobType={job.jobType} />
            {job.status === 'active' ? (
              <span className="inline-flex items-center text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Aktif
              </span>
            ) : (
              <span className="inline-flex items-center text-[11px] font-semibold text-neutral-secondary bg-neutral-100 px-2 py-0.5 rounded-full border border-neutral-200">
                Ditutup
              </span>
            )}
          </div>
          <span className="text-xs text-neutral-secondary flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-neutral-muted" />
            {formatDateIndo(job.createdAt)}
          </span>
        </div>

        {/* Title */}
        <Link href={`/lowongan/${job.id}`}>
          <h3 className="text-lg font-bold text-neutral-dark group-hover:text-primary transition-colors line-clamp-1">
            {job.title}
          </h3>
        </Link>

        {/* Employer info */}
        <div className="flex items-center gap-2 mt-2 text-xs text-neutral-secondary">
          <span className="font-semibold text-neutral-dark flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-primary" />
            {job.employerName}
          </span>
          <VerificationBadge status={job.employerVerificationStatus} size="sm" showText={false} />
          <span>•</span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-neutral-muted" />
            Kec. {job.district}
          </span>
        </div>

        {/* Distance Badge if applicable */}
        {showDistance && job.distanceKm !== undefined && (
          <div className="mt-2.5">
            <DistanceBadge distanceKm={job.distanceKm} />
          </div>
        )}

        {/* Description snippet */}
        <p className="text-xs text-neutral-secondary mt-3 line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {/* Working Hours & Requirements */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-secondary mt-3 pt-3 border-t border-neutral-border/60">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-neutral-muted" />
            <span>{job.workingHours}</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>{job.workingDays}</span>
          </div>
        </div>
      </div>

      {/* Footer: Salary & Action */}
      <div className="p-4 px-5 md:px-6 bg-neutral-light/60 border-t border-neutral-border/80 flex items-center justify-between gap-3">
        <div>
          <span className="block text-[10px] uppercase font-bold tracking-wider text-neutral-secondary">
            Gaji Ditawarkan
          </span>
          <span className="text-sm font-bold text-primary">
            {formatCompactRupiah(job.salaryMin)} - {formatCompactRupiah(job.salaryMax)}
            <span className="text-[10px] font-normal text-neutral-secondary">/{job.paymentSchedule.toLowerCase()}</span>
          </span>
        </div>

        <Link href={`/lowongan/${job.id}`}>
          <Button
            size="sm"
            variant="primary"
            rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
          >
            Lihat Lowongan
          </Button>
        </Link>
      </div>
    </div>
  );
}
