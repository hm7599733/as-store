'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/components/theme/ThemeProvider';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/account';

  const { user, signIn, signUp } = useAuth();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (user) {
      router.push(redirectUrl);
    }
  }, [user, router, redirectUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      if (mode === 'signin') {
        const res = await signIn(email.trim(), password);
        if (!res.success) {
          setErrorMsg(res.error || 'Invalid email or password');
        } else {
          setSuccessMsg('Signed in successfully! Redirecting...');
          setTimeout(() => router.push(redirectUrl), 400);
        }
      } else {
        // Sign Up validation
        if (password.length < 6) {
          setErrorMsg('Password must be at least 6 characters long');
          setIsLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setErrorMsg('Passwords do not match');
          setIsLoading(false);
          return;
        }
        if (!fullName.trim()) {
          setErrorMsg('Please enter your full name');
          setIsLoading(false);
          return;
        }
        if (phone.replace(/\D/g, '').length < 10) {
          setErrorMsg('Please enter a valid 11-digit phone number (e.g. 03001234567)');
          setIsLoading(false);
          return;
        }

        const res = await signUp({
          email: email.trim(),
          password,
          full_name: fullName.trim(),
          phone: phone.trim(),
          city: city.trim(),
          address: address.trim(),
        });

        if (!res.success) {
          setErrorMsg(res.error || 'Failed to create account');
        } else {
          setSuccessMsg('Account created successfully! Welcome to AS Store.');
          setTimeout(() => router.push(redirectUrl), 500);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/15 via-indigo-600/10 to-transparent blur-3xl rounded-full" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* AS Store Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-400 p-[2px] shadow-glow">
              <div className="w-full h-full bg-[#070B14] rounded-[14px] flex items-center justify-center font-display font-black text-white text-xl tracking-tighter group-hover:scale-105 transition-transform">
                AS
              </div>
            </div>
            <div className="text-left">
              <span className={`font-display font-black text-2xl tracking-tight leading-none block ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                AS STORE
              </span>
              <span className="text-xs font-semibold tracking-widest uppercase text-blue-500 font-sans">
                Customer Portal
              </span>
            </div>
          </Link>
          <h2 className={`mt-6 text-xl sm:text-2xl font-bold tracking-tight ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            {mode === 'signin' ? 'Sign in to your account' : 'Join AS Store'}
          </h2>
          <p className={`mt-1.5 text-xs sm:text-sm ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            {mode === 'signin'
              ? 'Access your orders, saved addresses, and express checkout'
              : 'Create an account to track shipments and unlock member perks'}
          </p>
        </div>

        {/* Auth Card */}
        <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl backdrop-blur-xl transition-all ${
          isLight
            ? 'bg-white/95 border-slate-200 text-slate-900'
            : 'bg-slate-900/80 border-slate-800 text-white'
        }`}>
          {/* Mode Switcher Tabs */}
          <div className={`grid grid-cols-2 p-1 rounded-2xl mb-6 ${
            isLight ? 'bg-slate-100' : 'bg-slate-800/60'
          }`}>
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
                mode === 'signin'
                  ? 'bg-blue-600 text-white shadow-md'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
                mode === 'signup'
                  ? 'bg-blue-600 text-white shadow-md'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Feedback Alerts */}
          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start gap-2.5 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-start gap-2.5 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 opacity-80">Full Name *</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Muhammad Ali"
                      className={`w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border transition focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                        isLight
                          ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-blue-500'
                          : 'bg-slate-800/50 border-slate-700 text-white focus:bg-slate-800 focus:border-blue-500'
                      }`}
                    />
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5 opacity-80">Phone Number (Pakistan) *</label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="03001234567"
                      className={`w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border transition focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                        isLight
                          ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-blue-500'
                          : 'bg-slate-800/50 border-slate-700 text-white focus:bg-slate-800 focus:border-blue-500'
                      }`}
                    />
                    <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 opacity-80">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Lahore"
                      className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border transition focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                        isLight
                          ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-blue-500'
                          : 'bg-slate-800/50 border-slate-700 text-white focus:bg-slate-800 focus:border-blue-500'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 opacity-80">Default Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="House / Street / Area"
                      className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border transition focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                        isLight
                          ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-blue-500'
                          : 'bg-slate-800/50 border-slate-700 text-white focus:bg-slate-800 focus:border-blue-500'
                      }`}
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold mb-1.5 opacity-80">Email Address *</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className={`w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border transition focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                    isLight
                      ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-blue-500'
                      : 'bg-slate-800/50 border-slate-700 text-white focus:bg-slate-800 focus:border-blue-500'
                  }`}
                />
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5 opacity-80">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className={`w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border transition focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                    isLight
                      ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-blue-500'
                      : 'bg-slate-800/50 border-slate-700 text-white focus:bg-slate-800 focus:border-blue-500'
                  }`}
                />
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-200 transition"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold mb-1.5 opacity-80">Confirm Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className={`w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border transition focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                      isLight
                        ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-blue-500'
                        : 'bg-slate-800/50 border-slate-700 text-white focus:bg-slate-800 focus:border-blue-500'
                    }`}
                  />
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold transition-all duration-200 shadow-glow flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{mode === 'signin' ? 'Sign In to AS Store' : 'Create Customer Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Perks list */}
          <div className="mt-8 pt-6 border-t border-slate-800/40 space-y-2.5 text-xs opacity-80">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Encrypted authentication secured directly in Supabase</span>
            </div>
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Track past and active parcel dispatches effortlessly</span>
            </div>
          </div>
        </div>

        {/* Back to Store */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-xs font-semibold text-blue-500 hover:text-blue-400 transition"
          >
            ← Return to AS Store Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-400">Loading portal...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
