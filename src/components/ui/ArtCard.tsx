import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArtProfile } from '@/types';
import { VerificationBadge, AvailabilityBadge, DistanceBadge, JobTypeBadge } from './Badge';
import { Button } from './Button';
import { formatCompactRupiah } from '@/lib/utils';
import { MapPin, Briefcase, Sparkles, ChevronRight } from 'lucide-react';

interface ArtCardProps {
  art: ArtProfile;
  showDistance?: boolean;
}

export function ArtCard({ art, showDistance = true }: ArtCardProps) {
  return (
    <div className="group bg-white rounded-2xl border border-neutral-border/90 hover:border-primary/40 shadow-card hover:shadow-hover transition-all duration-300 flex flex-col justify-between overflow-hidden">
      <div>
        {/* Header: Photo & Quick Status */}
        <div className="p-5 pb-3">
          <div className="flex items-start gap-4">
            {/* Avatar Photo */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 bg-neutral-light border border-neutral-border/80 shadow-sm group-hover:scale-102 transition-transform">
              <Image
                src={art.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80'}
                alt={art.fullName}
                fill
                sizes="(max-width: 640px) 64px, 80px"
                className="object-cover"
              />
            </div>

            {/* Basic Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap mb-1">
                <VerificationBadge status={art.verificationStatus} size="sm" />
                <AvailabilityBadge status={art.availabilityStatus} />
              </div>

              <Link href={`/art/${art.id}`} className="block">
                <h3 className="text-base sm:text-lg font-bold text-neutral-dark truncate group-hover:text-primary transition-colors">
                  {art.fullName}
                </h3>
              </Link>

              {/* Location & Experience */}
              <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-neutral-secondary mt-1">
                <span className="flex items-center gap-1 font-medium text-neutral-dark">
                  <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>Kec. {art.district}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-neutral-muted shrink-0" />
                  <span>{art.experienceYears > 0 ? `${art.experienceYears} Th Pengalaman` : 'Kandidat Baru'}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Distance Badge if available */}
        {showDistance && art.distanceKm !== undefined && (
          <div className="px-5 pb-2">
            <DistanceBadge distanceKm={art.distanceKm} />
          </div>
        )}

        {/* Bio Excerpt */}
        {art.bio && (
          <div className="px-5 py-1">
            <p className="text-xs text-neutral-secondary line-clamp-2 leading-relaxed">
              {art.bio}
            </p>
          </div>
        )}

        {/* Skills Pills */}
        <div className="px-5 py-3">
          <div className="flex flex-wrap gap-1.5">
            {art.skills && art.skills.slice(0, 3).map((skill) => (
              <span
                key={skill.id || skill.name}
                className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-neutral-light text-neutral-dark border border-neutral-border/70"
              >
                <Sparkles className="w-3 h-3 text-accent" />
                <span>{skill.name}</span>
              </span>
            ))}
            {art.skills && art.skills.length > 3 && (
              <span className="text-[11px] font-medium px-2 py-1 rounded-lg bg-cream text-neutral-secondary border border-accent-border/50">
                +{art.skills.length - 3} lainnya
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer: Salary Expectation & Action */}
      <div className="p-4 px-5 bg-neutral-light/60 border-t border-neutral-border/80 flex items-center justify-between gap-3">
        <div>
          <span className="block text-[10px] uppercase font-bold tracking-wider text-neutral-secondary">
            Ekspektasi Gaji
          </span>
          <span className="text-sm font-bold text-primary">
            {formatCompactRupiah(art.expectedSalaryMin)} - {formatCompactRupiah(art.expectedSalaryMax)}
            <span className="text-[10px] font-normal text-neutral-secondary">/bln</span>
          </span>
        </div>

        <Link href={`/art/${art.id}`}>
          <Button
            size="sm"
            variant="outline"
            rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
            className="border-primary/40 text-primary hover:bg-primary hover:text-white"
          >
            Detail
          </Button>
        </Link>
      </div>
    </div>
  );
}
