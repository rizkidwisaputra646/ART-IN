import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, Clock, AlertCircle, MapPin } from 'lucide-react';
import { VerificationStatus, AvailabilityStatus, JobType } from '@/types';
import { JOB_TYPE_LABELS } from '@/lib/constants';

interface VerificationBadgeProps {
  status: VerificationStatus;
  size?: 'sm' | 'md';
  showText?: boolean;
  className?: string;
}

export function VerificationBadge({
  status,
  size = 'md',
  showText = true,
  className,
}: VerificationBadgeProps) {
  if (status === 'verified') {
    return (
      <span
        title="Identitas Terverifikasi oleh Tim ARTin"
        className={cn(
          'inline-flex items-center gap-1 font-semibold rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80',
          size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1',
          className
        )}
      >
        <CheckCircle2 className={size === 'sm' ? 'w-3.5 h-3.5 text-emerald-600' : 'w-4 h-4 text-emerald-600'} />
        {showText && <span>Terverifikasi</span>}
      </span>
    );
  }

  if (status === 'pending') {
    return (
      <span
        title="Dokumen sedang diperiksa Admin"
        className={cn(
          'inline-flex items-center gap-1 font-medium rounded-full bg-amber-50 text-amber-800 border border-amber-200',
          size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1',
          className
        )}
      >
        <Clock className={size === 'sm' ? 'w-3 h-3 text-amber-600' : 'w-3.5 h-3.5 text-amber-600'} />
        {showText && <span>Menunggu Verifikasi</span>}
      </span>
    );
  }

  if (status === 'requires_revision') {
    return (
      <span
        title="Perlu Perbaikan Dokumen"
        className={cn(
          'inline-flex items-center gap-1 font-medium rounded-full bg-orange-50 text-orange-800 border border-orange-200',
          size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1',
          className
        )}
      >
        <AlertCircle className={size === 'sm' ? 'w-3 h-3 text-orange-600' : 'w-3.5 h-3.5 text-orange-600'} />
        {showText && <span>Perlu Revisi</span>}
      </span>
    );
  }

  return (
    <span
      title="Belum Melakukan Verifikasi KTP"
      className={cn(
        'inline-flex items-center gap-1 font-normal rounded-full bg-neutral-100 text-neutral-secondary border border-neutral-border',
        size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2 py-0.5',
        className
      )}
    >
      {showText && <span>Belum Terverifikasi</span>}
    </span>
  );
}

export function AvailabilityBadge({
  status,
  className,
}: {
  status: AvailabilityStatus;
  className?: string;
}) {
  const configs = {
    available: {
      text: 'Siap Bekerja',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500',
    },
    busy: {
      text: 'Sedang Bekerja',
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      dot: 'bg-amber-500',
    },
    not_available: {
      text: 'Tidak Tersedia',
      color: 'bg-neutral-100 text-neutral-secondary border-neutral-200',
      dot: 'bg-neutral-400',
    },
  };

  const item = configs[status] || configs.available;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border',
        item.color,
        className
      )}
    >
      <span className={cn('w-2 h-2 rounded-full', item.dot)} />
      {item.text}
    </span>
  );
}

export function DistanceBadge({
  distanceKm,
  className,
}: {
  distanceKm?: number;
  className?: string;
}) {
  if (distanceKm === undefined || distanceKm === null) return null;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-accent-light text-amber-900 border border-accent-border',
        className
      )}
    >
      <MapPin className="w-3.5 h-3.5 text-accent" />
      <span>{distanceKm} km dari lokasi Anda</span>
    </span>
  );
}

export function JobTypeBadge({
  jobType,
  className,
}: {
  jobType: JobType;
  className?: string;
}) {
  const label = JOB_TYPE_LABELS[jobType] || jobType;
  return (
    <span
      className={cn(
        'inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-md bg-neutral-light text-neutral-dark border border-neutral-border',
        className
      )}
    >
      {label}
    </span>
  );
}
