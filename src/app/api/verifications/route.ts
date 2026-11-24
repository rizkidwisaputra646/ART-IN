export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
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

    const supabase = createClient();

    // If Admin, can view all from Supabase
    if (roleCookie === 'admin') {
      try {
        const { data: verifDb, error } = await supabase
          .from('verification_requests')
          .select('*, profiles:user_id(full_name, district, phone)')
          .order('created_at', { ascending: false });

        if (!error && verifDb && verifDb.length > 0) {
          const mapped = verifDb.map((d: any) => ({
            id: d.id,
            userId: d.user_id,
            userName: d.profiles?.full_name || 'Pengguna ARTin',
            userRole: d.role,
            userDistrict: d.profiles?.district || 'Bandar Lampung',
            idCardUrl: d.id_card_url,
            selfieUrl: d.selfie_url,
            notes: d.notes,
            status: d.status,
            rejectionReason: d.rejection_reason,
            createdAt: d.created_at,
          }));
          return NextResponse.json({ success: true, data: mapped });
        }
      } catch {}

      const all = getVerificationRequests();
      return NextResponse.json({ success: true, data: all });
    }

    // Otherwise, can only view own verification request
    if (userId) {
      try {
        const { data: verifDb, error } = await supabase
          .from('verification_requests')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (!error && verifDb && verifDb.length > 0) {
          return NextResponse.json({ success: true, data: verifDb });
        }
      } catch {}

      const all = getVerificationRequests();
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
      idCardUrl: idCardUrl || '',
      selfieUrl: selfieUrl || '',
      notes,
    });

    try {
      const supabase = createClient();
      await supabase.from('verification_requests').insert({
        user_id: userId,
        role: userRole,
        id_card_url: idCardUrl,
        selfie_url: selfieUrl,
        notes,
        status: 'pending',
      });

      if (userRole === 'art') {
        await supabase.from('art_profiles').update({ verification_status: 'pending' }).eq('id', userId);
      } else {
        await supabase.from('employer_profiles').update({ verification_status: 'pending' }).eq('id', userId);
      }
    } catch (e) {
      console.error('Supabase verification insert error:', e);
    }

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

    reviewVerificationRequest(requestId, status as VerificationStatus, rejectionReason);

    try {
      const supabase = createClient();
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(requestId);

      if (isUuid) {
        await supabase.from('verification_requests').update({
          status,
          rejection_reason: rejectionReason || null,
          reviewed_at: new Date().toISOString(),
        }).eq('id', requestId);

        // Also propagate verification_status to candidate's profile
        const { data: verifRow } = await supabase
          .from('verification_requests')
          .select('user_id, role')
          .eq('id', requestId)
          .single();

        const targetUserId = verifRow?.user_id;
        if (targetUserId) {
          if (verifRow.role === 'art') {
            await supabase
              .from('art_profiles')
              .update({ verification_status: status })
              .eq('id', targetUserId);
          } else {
            await supabase
              .from('employer_profiles')
              .update({ verification_status: status })
              .eq('id', targetUserId);
          }
        }
      }
    } catch (e) {
      console.error('Supabase verification review error:', e);
    }

    return NextResponse.json({
      success: true,
      message: `Status verifikasi berhasil diperbarui menjadi ${status}.`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Server error' }, { status: 500 });
  }
}
