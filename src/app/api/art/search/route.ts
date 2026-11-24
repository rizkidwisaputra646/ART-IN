export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { searchArtProfiles } from '@/lib/data-repository';
import { JobType } from '@/types';

/**
 * Server-Authoritative Distance & Candidate Search API
 * Endpoint: /api/art/search
 * 
 * Guarantees:
 * 1. Calculation is 100% server-side authoritative using Supabase PostGIS RPC.
 * 2. Raw coordinates and exact street addresses are NEVER exposed to the client.
 * 3. Candidates without location consent or coordinates are NEVER given a valid distance
 *    and are strictly excluded when radius filtering is applied.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const keyword = searchParams.get('keyword') || undefined;
    const district = searchParams.get('district') || undefined;
    const latParam = searchParams.get('lat');
    const lngParam = searchParams.get('lng');
    const radiusParam = searchParams.get('radius');
    const minExpParam = searchParams.get('minExperience');
    const maxSalaryParam = searchParams.get('maxSalary');
    const jobTypeParam = searchParams.get('jobType') as JobType | null;
    const genderParam = searchParams.get('gender') as 'female' | 'male' | null;
    const verifiedOnly = searchParams.get('verifiedOnly') === 'true';
    const sortBy = (searchParams.get('sortBy') as any) || 'nearest';

    const referenceLat = latParam ? parseFloat(latParam) : undefined;
    const referenceLng = lngParam ? parseFloat(lngParam) : undefined;
    const maxDistanceKm = radiusParam ? parseFloat(radiusParam) : undefined;
    const minExperience = minExpParam ? parseInt(minExpParam, 10) : undefined;
    const maxSalary = maxSalaryParam ? parseFloat(maxSalaryParam) : undefined;

    // 1. Query Supabase RPC 'search_art_by_distance'
    let results: any[] = [];
    const supabase = createClient();

    try {
      const { data: rpcData, error: rpcError } = await supabase.rpc('search_art_by_distance', {
        p_lat: referenceLat ?? null,
        p_lng: referenceLng ?? null,
        p_max_distance_km: maxDistanceKm ?? null,
        p_district: district ?? null,
        p_min_experience: minExperience ?? null,
        p_max_salary: maxSalary ?? null,
        p_job_type: jobTypeParam ?? null,
        p_gender: genderParam ?? null,
        p_verification_only: verifiedOnly,
      });

      if (!rpcError && Array.isArray(rpcData)) {
        results = rpcData.map((row: any) => ({
          id: row.id,
          fullName: row.full_name,
          avatarUrl: row.avatar_url,
          gender: row.gender,
          age: row.age,
          city: row.city,
          district: row.district,
          addressSummary: row.address_summary,
          bio: row.bio,
          experienceYears: row.experience_years,
          preferredJobTypes: row.preferred_job_types,
          expectedSalaryMin: Number(row.expected_salary_min),
          expectedSalaryMax: Number(row.expected_salary_max),
          availabilityStatus: row.availability_status,
          workSchedule: row.work_schedule,
          verificationStatus: row.verification_status,
          distanceKm: row.distance_km != null ? Number(row.distance_km) : undefined,
          skills: Array.isArray(row.skills) ? row.skills : [],
        }));

        // Apply in-memory text filter if keyword was supplied
        if (keyword && keyword.trim() !== '') {
          const q = keyword.toLowerCase().trim();
          results = results.filter(
            (a) =>
              a.fullName?.toLowerCase().includes(q) ||
              a.bio?.toLowerCase().includes(q) ||
              a.district?.toLowerCase().includes(q) ||
              a.skills?.some((s: any) => s.name?.toLowerCase().includes(q))
          );
        }
      } else {
        // Fallback to repository
        results = searchArtProfiles({
          keyword,
          district,
          referenceLat,
          referenceLng,
          maxDistanceKm,
          minExperience,
          maxSalary,
          jobType: jobTypeParam || undefined,
          gender: genderParam || undefined,
          verifiedOnly,
          sortBy,
        });
      }
    } catch {
      results = searchArtProfiles({
        keyword,
        district,
        referenceLat,
        referenceLng,
        maxDistanceKm,
        minExperience,
        maxSalary,
        jobType: jobTypeParam || undefined,
        gender: genderParam || undefined,
        verifiedOnly,
        sortBy,
      });
    }

    // Double-check privacy sanitize: ensure NO raw coordinates exist in output
    const sanitizedResults = results.map((art) => {
      const sanitized = { ...art };
      delete (sanitized as any).latitude;
      delete (sanitized as any).longitude;
      return sanitized;
    });

    return NextResponse.json({
      success: true,
      count: sanitizedResults.length,
      serverCalculated: true,
      filter: {
        district: district || null,
        radiusKm: maxDistanceKm || null,
        referencePoint: referenceLat && referenceLng ? { lat: referenceLat, lng: referenceLng } : null,
      },
      data: sanitizedResults,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Gagal memproses pencarian di server.',
      },
      { status: 500 }
    );
  }
}
