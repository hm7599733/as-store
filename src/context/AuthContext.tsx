'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export interface CustomerProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  city: string;
  address: string;
}

interface AuthContextType {
  user: User | null;
  profile: CustomerProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (data: {
    email: string;
    password: string;
    full_name: string;
    phone: string;
    city?: string;
    address?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (data: {
    full_name: string;
    phone: string;
    city: string;
    address: string;
  }) => Promise<{ success: boolean; error?: string }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const syncUserSession = useCallback(async (currentUser: User | null) => {
    if (!currentUser) {
      setUser(null);
      setProfile(null);
      try {
        localStorage.removeItem('as_store_user_profile');
      } catch {}
      return;
    }

    setUser(currentUser);
    const meta = currentUser.user_metadata || {};
    const prof: CustomerProfile = {
      id: currentUser.id,
      email: currentUser.email || '',
      full_name: meta.full_name || currentUser.email?.split('@')[0] || 'Customer',
      phone: meta.phone || '',
      city: meta.city || '',
      address: meta.address || '',
    };
    setProfile(prof);
    try {
      localStorage.setItem('as_store_user_profile', JSON.stringify(prof));
    } catch {}
  }, []);

  useEffect(() => {
    let mounted = true;

    // Load from cache first for zero flicker
    try {
      const cached = localStorage.getItem('as_store_user_profile');
      if (cached) {
        setProfile(JSON.parse(cached));
      }
    } catch {}

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          await syncUserSession(session?.user || null);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initAuth();

    // Listen to Supabase auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (mounted) {
        await syncUserSession(session?.user || null);
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [syncUserSession]);

  const signIn = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Failed to sign in' };
      }

      // Also set the session on client-side Supabase instance
      if (data.session?.access_token && data.session?.refresh_token) {
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });
      }

      const { data: sessionData } = await supabase.auth.getSession();
      await syncUserSession(sessionData?.session?.user || null);

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error occurred' };
    }
  };

  const signUp = async (formData: {
    email: string;
    password: string;
    full_name: string;
    phone: string;
    city?: string;
    address?: string;
  }) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Failed to create account' };
      }

      // Automatically sign in the user
      return await signIn(formData.email, formData.password);
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error during registration' };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      setUser(null);
      setProfile(null);
      try {
        localStorage.removeItem('as_store_user_profile');
      } catch {}
    }
  };

  const updateProfile = async (updateData: {
    full_name: string;
    phone: string;
    city: string;
    address: string;
  }) => {
    if (!user) return { success: false, error: 'User is not logged in' };

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          ...updateData,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Failed to update profile' };
      }

      const updatedProf: CustomerProfile = {
        id: user.id,
        email: user.email || '',
        ...updateData,
      };
      setProfile(updatedProf);
      try {
        localStorage.setItem('as_store_user_profile', JSON.stringify(updatedProf));
      } catch {}

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Error updating profile' };
    }
  };

  const refreshUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    await syncUserSession(session?.user || null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        refreshUser,
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
