import { NextRequest, NextResponse } from 'next/server';
import { getVerificationRequests, submitVerificationRequest, reviewVerificationRequest } from '@/lib/data-repository';
import { VerificationStatus } from '@/types';

/**
 * Server API Endpoint for Verification Requests
 * Endpoint: /api/verifications
 */

export async function GET(request: NextRequest) {
  try {
    const roleCookie = request.cookies.get('artin_role')?.value;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const all = getVerificationRequests();

    // If Admin, can view all
    if (roleCookie === 'admin') {
      return NextResponse.json({ success: true, data: all });
    }

    // Otherwise, can only view own verification request
    if (userId) {
      const filtered = all.filter((v) => v.userId === userId);
      return NextResponse.json({ success: true, data: filtered });
    }

    return NextResponse.json({ success: false, error: 'Akses ditolak.' }, { status: 403 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, userName, userRole, userDistrict, idCardUrl, selfieUrl, notes } = body;

    if (!userId || !userName || !userRole || !userDistrict) {
      return NextResponse.json(
        { success: false, error: 'Data formulir verifikasi belum lengkap.' },
        { status: 400 }
      );
    }

    const created = submitVerificationRequest({
      userId,
      userName,
      userRole,
      userDistrict,
      idCardUrl: idCardUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500',
      selfieUrl: selfieUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500',
      notes,
    });

    return NextResponse.json({
      success: true,
      message: 'Pengajuan verifikasi berhasil dikirim dan akan diperiksa oleh admin.',
      data: created,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Only Admin can review verifications
    const roleCookie = request.cookies.get('artin_role')?.value;
    if (roleCookie !== 'admin') {
      return NextResponse.json({ success: false, error: 'Hanya admin yang berwenang memeriksa verifikasi.' }, { status: 403 });
    }

    const body = await request.json();
    const { requestId, status, rejectionReason } = body;

    if (!requestId || !status) {
      return NextResponse.json({ success: false, error: 'requestId dan status wajib diisi.' }, { status: 400 });
    }

    const ok = reviewVerificationRequest(requestId, status as VerificationStatus, rejectionReason);
    if (!ok) {
      return NextResponse.json({ success: false, error: 'Pengajuan verifikasi tidak ditemukan.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Status verifikasi berhasil diperbarui menjadi ${status}.`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Server error' }, { status: 500 });
  }
}
