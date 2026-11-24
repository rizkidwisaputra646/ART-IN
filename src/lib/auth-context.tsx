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
  login: (email: string, role?: UserRole) => Promise<{ success: boolean; message?: string }>;
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check saved session in localStorage
    const saved = localStorage.getItem('artin_user_profile');
    if (saved) {
      try {
        setProfile(JSON.parse(saved));
      } catch {
        setProfile(null);
      }
    } else {
      // Default initial guest (null) so user lands on public pages cleanly
      setProfile(null);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, roleOverride?: UserRole) => {
    setIsLoading(true);
    let chosenProfile: UserProfile;

    if (roleOverride) {
      chosenProfile = DEFAULT_USERS[roleOverride];
    } else if (email.toLowerCase().includes('admin')) {
      chosenProfile = DEFAULT_USERS.admin;
    } else if (email.toLowerCase().includes('art')) {
      chosenProfile = DEFAULT_USERS.art;
    } else {
      chosenProfile = DEFAULT_USERS.family;
    }

    setProfile(chosenProfile);
    localStorage.setItem('artin_user_profile', JSON.stringify(chosenProfile));
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
    setIsLoading(false);
    return { success: true };
  };

  const logout = () => {
    setProfile(null);
    localStorage.removeItem('artin_user_profile');
  };

  const switchRole = (role: UserRole) => {
    const p = DEFAULT_USERS[role];
    setProfile(p);
    localStorage.setItem('artin_user_profile', JSON.stringify(p));
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
