'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '@/types';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  district?: string;
  avatar_url?: string;
  status: string;
}

interface AuthContextType {
  user: { id: string; email: string } | null;
  profile: UserProfile | null;
  isLoading: boolean;
  login: (email: string, roleOverride?: UserRole) => Promise<{ success: boolean; message?: string }>;
  register: (data: {
    email: string;
    fullName: string;
    role: UserRole;
    phone: string;
    district: string;
  }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const DEFAULT_USERS: Record<UserRole, UserProfile> = {
  family: {
    id: 'emp-1',
    email: 'keluarga@artin.id',
    full_name: 'Ibu Maya Lestari',
    role: 'family',
    phone: '081271234567',
    district: 'Sukarame',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    status: 'active',
  },
  art: {
    id: 'art-1',
    email: 'art@artin.id',
    full_name: 'Siti Rahayu',
    role: 'art',
    phone: '081273849102',
    district: 'Kedaton',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    status: 'active',
  },
  admin: {
    id: 'admin-1',
    email: 'admin@artin.id',
    full_name: 'Admin ARTin Bandar Lampung',
    role: 'admin',
    phone: '081234567890',
    district: 'Tanjung Karang Pusat',
    status: 'active',
  },
};

function setCookie(name: string, value: string, days = 7) {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function deleteCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check saved session in localStorage
    const saved = localStorage.getItem('artin_user_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProfile(parsed);
        setCookie('artin_role', parsed.role);
      } catch {
        setProfile(null);
        deleteCookie('artin_role');
      }
    } else {
      setProfile(null);
      deleteCookie('artin_role');
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, roleOverride?: UserRole) => {
    setIsLoading(true);
    let chosenProfile: UserProfile;

    // Prevent privilege escalation in production
    const isDev = process.env.NODE_ENV === 'development';

    if (roleOverride) {
      if (roleOverride === 'admin' && !isDev) {
        setIsLoading(false);
        throw new Error('Akses role admin dibatasi pada lingkungan produksi.');
      }
      chosenProfile = DEFAULT_USERS[roleOverride];
    } else if (email.trim().toLowerCase() === 'admin@artin.id') {
      chosenProfile = DEFAULT_USERS.admin;
    } else if (email.trim().toLowerCase() === 'art@artin.id') {
      chosenProfile = DEFAULT_USERS.art;
    } else if (email.trim().toLowerCase() === 'keluarga@artin.id') {
      chosenProfile = DEFAULT_USERS.family;
    } else {
      // Default to family role for generic logins unless specific mock
      chosenProfile = {
        id: `user-${Date.now()}`,
        email,
        full_name: email.split('@')[0],
        role: 'family',
        status: 'active',
      };
    }

    setProfile(chosenProfile);
    localStorage.setItem('artin_user_profile', JSON.stringify(chosenProfile));
    setCookie('artin_role', chosenProfile.role);
    setIsLoading(false);
    return { success: true };
  };

  const register = async (data: {
    email: string;
    fullName: string;
    role: UserRole;
    phone: string;
    district: string;
  }) => {
    setIsLoading(true);

    // SECURITY CHECK: Strictly block any attempt to register with admin role
    if (data.role === 'admin' || (data.role as string) === 'administrator') {
      setIsLoading(false);
      throw new Error('Registrasi admin tidak diperbolehkan secara publik.');
    }

    // Role must be strictly 'family' or 'art'
    if (data.role !== 'family' && data.role !== 'art') {
      setIsLoading(false);
      throw new Error('Peran akun yang dipilih tidak valid.');
    }

    const newProfile: UserProfile = {
      id: `${data.role}-${Date.now()}`,
      email: data.email,
      full_name: data.fullName,
      role: data.role,
      phone: data.phone,
      district: data.district,
      status: 'active',
    };

    setProfile(newProfile);
    localStorage.setItem('artin_user_profile', JSON.stringify(newProfile));
    setCookie('artin_role', newProfile.role);
    setIsLoading(false);
    return { success: true };
  };

  const logout = () => {
    setProfile(null);
    localStorage.removeItem('artin_user_profile');
    deleteCookie('artin_role');
  };

  const switchRole = (role: UserRole) => {
    // Only permitted in development mode
    if (process.env.NODE_ENV !== 'development') {
      console.warn('Role Switcher is disabled in production.');
      return;
    }
    const p = DEFAULT_USERS[role];
    setProfile(p);
    localStorage.setItem('artin_user_profile', JSON.stringify(p));
    setCookie('artin_role', p.role);
  };

  const user = profile ? { id: profile.id, email: profile.email } : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        login,
        register,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
