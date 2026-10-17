'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, Zap, Headphones, ArrowRight, Star } from 'lucide-react';
import { useTheme } from '@/components/theme/ThemeProvider';

export default function Hero({
  onExploreClick,
}: {
  onExploreClick?: () => void;
}) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-20 border-b border-slate-800/40">
      {/* Background Gradient & Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-blue-600/15 via-indigo-600/10 to-transparent blur-3xl rounded-full" />
        <div className="absolute -bottom-20 right-10 w-[300px] h-[300px] bg-emerald-500/5 blur-3xl rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold backdrop-blur-sm animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
            <span>Official AS Store Collection • 2026 Edition</span>
          </div>

          {/* Hero Headline */}
          <h1 className={`font-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            Precision Tech. <br />
            <span className="bg-gradient-to-r from-blue-500 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
              Engineered For Living.
            </span>
          </h1>

          {/* Subtitle */}
          <p className={`text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-normal leading-relaxed ${
            isLight ? 'text-slate-600' : 'text-slate-400'
          }`}>
            Pakistan&apos;s destination for high-capacity power banks, GaN fast chargers, true wireless earbuds, and durable accessories. Tested for maximum performance.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
            <a
              href="#catalogue"
              onClick={(e) => {
                if (onExploreClick) {
                  e.preventDefault();
                  onExploreClick();
                }
              }}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-glow hover:shadow-lg active:scale-95"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <Link
              href="/products?deals=true"
              className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border font-semibold text-sm transition-all active:scale-95 ${
                isLight
                  ? 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
                  : 'border-slate-800 bg-slate-900/80 text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Special Offers</span>
            </Link>
          </div>

          {/* Customer Trust Rating */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <span className={`text-xs font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Rated <strong className={isLight ? 'text-slate-900' : 'text-white'}>4.9/5</strong> by satisfied tech buyers nationwide
            </span>
          </div>
        </div>

        {/* 4 Feature Highlights Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-12 sm:mt-16">
          <div className={`p-4 rounded-2xl border transition-all ${
            isLight
              ? 'bg-white border-slate-200 shadow-subtle'
              : 'bg-slate-900/60 border-slate-800/80'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className={`text-xs sm:text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Nationwide COD
                </h4>
                <p className="text-[11px] text-slate-400">Cash on Delivery all Pakistan</p>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-2xl border transition-all ${
            isLight
              ? 'bg-white border-slate-200 shadow-subtle'
              : 'bg-slate-900/60 border-slate-800/80'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className={`text-xs sm:text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Genuine & Tested
                </h4>
                <p className="text-[11px] text-slate-400">7-Day replacement warranty</p>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-2xl border transition-all ${
            isLight
              ? 'bg-white border-slate-200 shadow-subtle'
              : 'bg-slate-900/60 border-slate-800/80'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className={`text-xs sm:text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Fast Dispatch
                </h4>
                <p className="text-[11px] text-slate-400">Orders packed within 24h</p>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-2xl border transition-all ${
            isLight
              ? 'bg-white border-slate-200 shadow-subtle'
              : 'bg-slate-900/60 border-slate-800/80'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className={`text-xs sm:text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  WhatsApp Help
                </h4>
                <p className="text-[11px] text-slate-400">Direct order tracking chat</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
