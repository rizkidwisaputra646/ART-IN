'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/lib/auth-context';
import { UserRole } from '@/types';
import { Mail, Lock, UserCheck, Shield, Sparkles, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, switchRole } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email);
      if (email.toLowerCase().includes('admin')) {
        router.push('/admin');
      } else if (email.toLowerCase().includes('art')) {
        router.push('/art');
      } else {
        router.push('/keluarga');
      }
    } catch (err: any) {
      setError(err?.message || 'Gagal masuk. Silakan periksa kembali email atau password Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (role: UserRole) => {
    switchRole(role);
    if (role === 'admin') router.push('/admin');
    else if (role === 'art') router.push('/art');
    else router.push('/keluarga');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFCFA]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cream border border-primary/20 shadow-xs mb-2">
              <Image src="/logo.png" alt="Logo ARTin" width={36} height={36} className="object-contain" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-dark tracking-tight">
              Selamat Datang Kembali
            </h1>
            <p className="text-xs sm:text-sm text-neutral-secondary">
              Masuk ke akun ARTin Anda untuk mengelola lowongan atau profil kerja.
            </p>
          </div>

          {/* Quick Demo Switcher Card */}
          <div className="bg-cream-100 rounded-2xl p-4 border border-accent-border/80 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-dark">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>Akses Cepat Pengujian (Role Switcher)</span>
            </div>
            <p className="text-[11px] text-neutral-secondary leading-tight">
              Klik salah satu profil simulasi untuk langsung mencoba fitur:
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickLogin('family')}
                className="p-2 rounded-xl bg-white border border-neutral-border hover:border-primary text-center hover:bg-primary-light transition-all text-xs font-semibold text-neutral-dark"
              >
                Keluarga
                <span className="block text-[10px] text-neutral-secondary font-normal">Ibu Maya</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('art')}
                className="p-2 rounded-xl bg-white border border-neutral-border hover:border-primary text-center hover:bg-primary-light transition-all text-xs font-semibold text-neutral-dark"
              >
                Calon ART
                <span className="block text-[10px] text-neutral-secondary font-normal">Siti Rahayu</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="p-2 rounded-xl bg-white border border-neutral-border hover:border-primary text-center hover:bg-primary-light transition-all text-xs font-semibold text-neutral-dark"
              >
                Admin
                <span className="block text-[10px] text-neutral-secondary font-normal">Moderator</span>
              </button>
            </div>
          </div>

          {/* Standard Login Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-border shadow-card space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Alamat Email"
                type="email"
                required
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
              />

              <Input
                label="Kata Sandi"
                type="password"
                required
                placeholder="Minimal 8 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
              />

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-neutral-secondary">
                  <input type="checkbox" className="rounded border-neutral-border text-primary focus:ring-primary" />
                  <span>Ingat saya</span>
                </label>
                <a href="#" className="font-semibold text-primary hover:underline">
                  Lupa sandi?
                </a>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isLoading}
                className="w-full mt-2 font-bold"
              >
                Masuk ke Akun
              </Button>
            </form>

            <div className="pt-4 border-t border-neutral-border text-center text-xs text-neutral-secondary">
              Belum memiliki akun?{' '}
              <Link href="/register" className="font-bold text-primary hover:underline">
                Daftar Sekarang
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
