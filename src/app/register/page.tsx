'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { useAuth } from '@/lib/auth-context';
import { UserRole } from '@/types';
import { BANDAR_LAMPUNG_DISTRICTS } from '@/lib/constants';
import { User, Mail, Lock, Phone, MapPin, Users, Briefcase, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [role, setRole] = useState<UserRole>('family');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState(BANDAR_LAMPUNG_DISTRICTS[0].name);
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      setError('Anda harus menyetujui Ketentuan Layanan dan Kebijakan Privasi ARTin.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await register({
        email,
        password,
        fullName,
        role,
        phone,
        district,
      });

      if (role === 'family') {
        router.push('/keluarga');
      } else {
        router.push('/art');
      }
    } catch (err: any) {
      setError(err?.message || 'Pendaftaran gagal. Silakan coba kembali.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFCFA]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-lg space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-dark tracking-tight">
              Daftar Akun ARTin
            </h1>
            <p className="text-xs sm:text-sm text-neutral-secondary">
              Pilih peran Anda dan mulai temukan kemudahan layanan rumah tangga di Bandar Lampung.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-border shadow-card space-y-6">
            {/* Role Selector Tabs */}
            <div>
              <label className="block text-xs font-semibold text-neutral-secondary mb-2 uppercase tracking-wider">
                Daftar Sebagai:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('family')}
                  className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    role === 'family'
                      ? 'border-primary bg-primary-light/50 ring-2 ring-primary/20'
                      : 'border-neutral-border hover:bg-neutral-light'
                  }`}
                >
                  <Users className={`w-5 h-5 mt-0.5 ${role === 'family' ? 'text-primary' : 'text-neutral-muted'}`} />
                  <div>
                    <h3 className="text-sm font-bold text-neutral-dark">Keluarga</h3>
                    <p className="text-[11px] text-neutral-secondary mt-0.5">Membutuhkan bantuan ART di rumah</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('art')}
                  className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    role === 'art'
                      ? 'border-accent bg-accent-light/50 ring-2 ring-accent/20'
                      : 'border-neutral-border hover:bg-neutral-light'
                  }`}
                >
                  <Briefcase className={`w-5 h-5 mt-0.5 ${role === 'art' ? 'text-accent' : 'text-neutral-muted'}`} />
                  <div>
                    <h3 className="text-sm font-bold text-neutral-dark">Calon ART</h3>
                    <p className="text-[11px] text-neutral-secondary mt-0.5">Mencari pekerjaan rumah tangga</p>
                  </div>
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nama Lengkap"
                required
                placeholder={role === 'family' ? 'Contoh: Maya Anggraini' : 'Contoh: Siti Rahmawati'}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                leftIcon={<User className="w-4 h-4" />}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Email"
                  type="email"
                  required
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<Mail className="w-4 h-4" />}
                />

                <Input
                  label="Nomor WhatsApp"
                  required
                  placeholder="0812xxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  leftIcon={<Phone className="w-4 h-4" />}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Select
                  label="Kecamatan Domisili"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                >
                  {BANDAR_LAMPUNG_DISTRICTS.map((d) => (
                    <option key={d.name} value={d.name}>
                      Kecamatan {d.name}
                    </option>
                  ))}
                </Select>

                <Input
                  label="Kata Sandi"
                  type="password"
                  required
                  placeholder="Minimal 8 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftIcon={<Lock className="w-4 h-4" />}
                />
              </div>

              {/* Consent check */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-neutral-secondary">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 rounded border-neutral-border text-primary focus:ring-primary"
                  />
                  <span>
                    Saya menyetujui{' '}
                    <Link href="/syarat-ketentuan" className="font-semibold text-primary hover:underline">
                      Syarat & Ketentuan
                    </Link>{' '}
                    serta{' '}
                    <Link href="/kebijakan-privasi" className="font-semibold text-primary hover:underline">
                      Kebijakan Privasi
                    </Link>{' '}
                    ARTin Kota Bandar Lampung.
                  </span>
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isLoading}
                className="w-full mt-4 font-bold"
              >
                Daftar Sebagai {role === 'family' ? 'Keluarga' : 'Calon ART'}
              </Button>
            </form>

            <div className="pt-4 border-t border-neutral-border text-center text-xs text-neutral-secondary">
              Sudah memiliki akun?{' '}
              <Link href="/login" className="font-bold text-primary hover:underline">
                Masuk di Sini
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
