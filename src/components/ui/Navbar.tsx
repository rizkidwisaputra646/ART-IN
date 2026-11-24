'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button } from './Button';
import { Menu, X, User, LogOut, LayoutDashboard, Shield, Briefcase, Search } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile, logout } = useAuth();

  const navLinks = [
    { href: '/cari-art', label: 'Cari ART' },
    { href: '/lowongan', label: 'Lowongan Kerja' },
    { href: '/cara-kerja', label: 'Cara Kerja' },
    { href: '/tentang', label: 'Tentang ARTin' },
  ];

  const getDashboardHref = () => {
    if (!profile) return '/login';
    if (profile.role === 'admin') return '/admin';
    if (profile.role === 'family') return '/keluarga';
    return '/art';
  };

  const getRoleLabel = () => {
    if (!profile) return '';
    if (profile.role === 'admin') return 'Admin';
    if (profile.role === 'family') return 'Keluarga';
    return 'ART';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-border/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-xl overflow-hidden shadow-sm border border-primary/20 bg-cream group-hover:scale-105 transition-transform">
              <Image
                src="/logo.png"
                alt="Logo ARTin"
                fill
                priority
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-primary font-sans leading-none">
                ART<span className="text-accent">in</span>
              </span>
              <span className="text-[10px] font-semibold text-neutral-secondary uppercase tracking-widest mt-0.5">
                Bandar Lampung
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-primary bg-primary-light/60'
                      : 'text-neutral-secondary hover:text-primary hover:bg-neutral-light'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* User Auth CTAs */}
          <div className="hidden md:flex items-center gap-3">
            {user && profile ? (
              <div className="flex items-center gap-3">
                <Link href={getDashboardHref()}>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<LayoutDashboard className="w-4 h-4 text-primary" />}
                    className="border-primary/30 text-primary hover:bg-primary-light"
                  >
                    <span>Dashboard ({getRoleLabel()})</span>
                  </Button>
                </Link>

                <div className="flex items-center gap-2 pl-2 border-l border-neutral-border">
                  <div className="w-8 h-8 rounded-full bg-cream-200 border border-accent-border flex items-center justify-center text-xs font-bold text-neutral-dark overflow-hidden">
                    {profile.avatar_url ? (
                      <Image
                        src={profile.avatar_url}
                        alt={profile.full_name}
                        width={32}
                        height={32}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      profile.full_name?.charAt(0).toUpperCase() || 'U'
                    )}
                  </div>
                  <button
                    onClick={() => logout()}
                    title="Keluar Akun"
                    className="p-2 text-neutral-secondary hover:text-rose-600 rounded-lg hover:bg-neutral-light transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Masuk
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm" className="shadow-sm">
                    Daftar Sekarang
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-neutral-dark hover:bg-neutral-light focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-border bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-primary bg-primary-light'
                      : 'text-neutral-secondary hover:text-primary hover:bg-neutral-light'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-neutral-border">
            {user && profile ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-3 py-2 bg-neutral-light rounded-xl">
                  <div className="w-9 h-9 rounded-full bg-cream-200 flex items-center justify-center font-bold text-neutral-dark">
                    {profile.full_name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-neutral-dark truncate">{profile.full_name}</p>
                    <p className="text-xs text-primary font-semibold">{getRoleLabel()}</p>
                  </div>
                </div>
                <Link
                  href={getDashboardHref()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full"
                >
                  <Button variant="primary" size="md" className="w-full">
                    Buka Dashboard
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="md"
                  className="w-full text-rose-600 hover:bg-rose-50 border-rose-200"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                >
                  Keluar
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="md" className="w-full">
                    Masuk
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="md" className="w-full">
                    Daftar
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
