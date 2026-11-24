import { NextRequest, NextResponse } from 'next/server';
import { applyForJob, getApplicationsForArt, getApplicationsForEmployer, updateApplicationStatus } from '@/lib/data-repository';
import { ApplicationStatus } from '@/types';

/**
 * Server API Endpoint for Job Applications & Workflow Transitions
 * Endpoint: /api/applications
 * 
 * Enforces PRD Business Rules:
 * 1. Single active application per job per ART candidate.
 * 2. Closed vacancies cannot receive new applications.
 * 3. Withdrawal only permitted when status is pending or reviewing.
 */

// GET: Retrieve applications for logged-in user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const artId = searchParams.get('artId');
    const employerId = searchParams.get('employerId');

    if (artId) {
      const apps = getApplicationsForArt(artId);
      return NextResponse.json({ success: true, data: apps });
    }

    if (employerId) {
      const apps = getApplicationsForEmployer(employerId);
      return NextResponse.json({ success: true, data: apps });
    }

    return NextResponse.json({ success: false, error: 'Parameter artId atau employerId diperlukan.' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Server error' }, { status: 500 });
  }
}

// POST: Submit a new application
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { artId, jobId, coverLetter } = body;

    if (!artId || !jobId) {
      return NextResponse.json(
        { success: false, error: 'artId dan jobId wajib diisi.' },
        { status: 400 }
      );
    }

    const result = applyForJob(artId, jobId, coverLetter || '');

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.message }, { status: 422 });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      data: result.application,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Server error' }, { status: 500 });
  }
}

// PATCH: Update status (Accept, Reject, Interview, Withdraw)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { applicationId, status, notes, interviewScheduledAt } = body;

    if (!applicationId || !status) {
      return NextResponse.json(
        { success: false, error: 'applicationId dan status wajib disertakan.' },
        { status: 400 }
      );
    }

    const res = updateApplicationStatus(
      applicationId,
      status as ApplicationStatus,
      notes,
      interviewScheduledAt
    );

    if (!res.success) {
      return NextResponse.json({ success: false, error: res.message }, { status: 422 });
    }

    return NextResponse.json({ success: true, message: res.message });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Server error' }, { status: 500 });
  }
}
