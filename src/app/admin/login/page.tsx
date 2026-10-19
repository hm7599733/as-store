'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Lock, User, ArrowRight, AlertCircle, ShieldCheck, Eye, EyeOff, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const [adminUsername, setAdminUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        window.location.href = '/admin/dashboard';
      }
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    const trimmed = adminUsername.trim();
    const cleanLower = trimmed.toLowerCase();

    // Map 'admin' or direct username to official admin email
    const targetEmail =
      cleanLower === 'admin' || cleanLower === 'asstore' || cleanLower === 'adminasstore'
        ? 'admin@asstore.pk'
        : trimmed.includes('@')
        ? trimmed
        : `${cleanLower}@asstore.pk`;

    try {
      // 1. Authenticate via Server API (supports Vercel env vars & direct credentials)
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: trimmed,
          password: password.trim(),
        }),
      });

      const resData = await res.json();

      if (res.ok && resData.success) {
        localStorage.setItem('as_admin_logged_in', 'true');
        document.cookie = 'as_admin_auth=true; path=/; max-age=604800; SameSite=Lax';

        // Also initiate Supabase auth session in background if possible
        try {
          await supabase.auth.signInWithPassword({
            email: targetEmail,
            password: password.trim(),
          });
        } catch (_) {}

        window.location.href = '/admin/dashboard';
        return;
      }

      // If API failed, check direct fallback
      if (cleanLower === 'admin' && password.trim() === 'abdullah123') {
        localStorage.setItem('as_admin_logged_in', 'true');
        document.cookie = 'as_admin_auth=true; path=/; max-age=604800; SameSite=Lax';
        window.location.href = '/admin/dashboard';
        return;
      }

      setErrorMessage(resData.error || 'Invalid admin credentials. Please enter admin / abdullah123.');
      setLoading(false);
    } catch (err: any) {
      if (cleanLower === 'admin' && password.trim() === 'abdullah123') {
        localStorage.setItem('as_admin_logged_in', 'true');
        document.cookie = 'as_admin_auth=true; path=/; max-age=604800; SameSite=Lax';
        window.location.href = '/admin/dashboard';
        return;
      }
      setErrorMessage(err.message || 'Authentication error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060C1B] text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Cyber Accents */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="relative h-16 w-32 mx-auto flex items-center justify-center p-2 rounded-2xl bg-[#0B132B] border border-cyan-500/30 shadow-2xl shadow-cyan-950/50">
            <Image
              src="/images/as-store-logo.png"
              alt="AS Gadgets"
              width={893}
              height={507}
              className="h-full w-auto object-contain"
              priority
            />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-[10px] font-black uppercase tracking-widest text-[#06B6D4] mb-2 shadow-inner">
              <Sparkles className="w-3 h-3 text-[#06B6D4]" />
              <span>Administrative Portal</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
              AS GADGETS Admin Suite
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Authorized credentials required to manage orders, inventory, and logistics.
            </p>
          </div>
        </div>

        {/* Executive Login Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0B132B]/90 border border-slate-800 shadow-2xl backdrop-blur-md">
          <form onSubmit={handleLogin} className="space-y-4">
            {errorMessage && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {/* Admin Username Field */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Admin Name / ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  placeholder="admin"
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4] font-medium transition"
                />
                <User className="absolute left-3 top-3 w-4 h-4 text-cyan-400/80" />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Enter your admin username: <span className="text-cyan-400 font-mono font-bold">admin</span>
              </p>
            </div>

            {/* Admin Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4] font-medium transition"
                />
                <Lock className="absolute left-3 top-3 w-4 h-4 text-cyan-400/80" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white transition"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs transition shadow-lg shadow-cyan-950/50 disabled:opacity-50 active:scale-[0.99] mt-2"
            >
              {loading ? (
                <span>Verifying Admin Credentials...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Enter Admin Suite</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-2">
          <Link
            href="/"
            className="hover:text-slate-300 font-medium transition"
          >
            ← AS Gadgets Storefront
          </Link>

          <Link
            href="/login"
            className="hover:text-cyan-400 font-medium transition"
          >
            Customer Account Login →
          </Link>
        </div>
      </div>
    </div>
  );
}
