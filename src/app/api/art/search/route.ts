import { NextRequest, NextResponse } from 'next/server';
import { searchArtProfiles } from '@/lib/data-repository';
import { JobType } from '@/types';

/**
 * Server-Authoritative Distance & Candidate Search API
 * Endpoint: /api/art/search
 * 
 * Guarantees:
 * 1. Calculation is 100% server-side authoritative.
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

    // Execute server-authoritative query
    const results = searchArtProfiles({
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
