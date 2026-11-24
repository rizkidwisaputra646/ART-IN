import { NextRequest, NextResponse } from 'next/server';
import { getReports, submitReport, updateReportStatus } from '@/lib/data-repository';
import { ReportStatus } from '@/types';

/**
 * Server API Endpoint for User Reporting & Moderation
 * Endpoint: /api/reports
 */

export async function GET(request: NextRequest) {
  try {
    const roleCookie = request.cookies.get('artin_role')?.value;
    if (roleCookie !== 'admin') {
      return NextResponse.json({ success: false, error: 'Akses laporan terbatas untuk administrator.' }, { status: 403 });
    }

    const reports = getReports();
    return NextResponse.json({ success: true, data: reports });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reporterId, reporterName, reportedUserId, reportedUserName, reportedJobId, reportedJobTitle, category, reason } = body;

    if (!reason || !category) {
      return NextResponse.json({ success: false, error: 'Kategori dan alasan pelaporan wajib diisi.' }, { status: 400 });
    }

    const created = submitReport({
      reporterId: reporterId || 'guest',
      reporterName: reporterName || 'Pengguna Platform',
      reportedUserId,
      reportedUserName,
      reportedJobId,
      reportedJobTitle,
      category,
      reason,
    });

    return NextResponse.json({
      success: true,
      message: 'Laporan Anda telah diterima dan akan ditindaklanjuti oleh tim admin ARTin.',
      data: created,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const roleCookie = request.cookies.get('artin_role')?.value;
    if (roleCookie !== 'admin') {
      return NextResponse.json({ success: false, error: 'Hanya admin yang berwenang memperbarui laporan.' }, { status: 403 });
    }

    const body = await request.json();
    const { reportId, status, adminNotes } = body;

    if (!reportId || !status) {
      return NextResponse.json({ success: false, error: 'reportId dan status wajib disertakan.' }, { status: 400 });
    }

    const ok = updateReportStatus(reportId, status as ReportStatus, adminNotes);
    if (!ok) {
      return NextResponse.json({ success: false, error: 'Laporan tidak ditemukan.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Status laporan berhasil diperbarui menjadi ${status}.`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Server error' }, { status: 500 });
  }
}
