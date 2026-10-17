'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  MessageCircle,
  ArrowRight,
  Zap,
  BatteryCharging,
  Headphones,
  Star,
  CheckCircle2,
} from 'lucide-react';

export default function Hero({
  onExploreClick,
}: {
  onExploreClick?: () => void;
}) {
  return (
    <section className="py-6 sm:py-8 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Hero Container — Clean Modern Tech Aesthetic */}
        <div className="relative rounded-3xl bg-gradient-to-br from-white via-slate-50 to-amber-50/20 border border-slate-200/80 p-6 sm:p-10 lg:p-12 overflow-hidden shadow-sm">
          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-400/10 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute bottom-0 right-10 w-80 h-80 bg-blue-500/5 blur-3xl rounded-full pointer-events-none" />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6 z-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100/80 border border-amber-200 text-amber-900 text-xs font-bold">
                <Zap className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
                <span>NEXT-GEN POWER & AUDIO ACCESSORIES</span>
              </div>

              {/* Headline */}
              <h1 className="font-display text-3xl sm:text-5xl lg:text-[3.5rem] font-black text-slate-900 leading-[1.08] tracking-tight">
                Power That Keeps Up <br className="hidden sm:block" />
                With <span className="bg-gradient-to-r from-[#D97706] to-[#F59E0B] bg-clip-text text-transparent">Your Lifestyle.</span>
              </h1>

              {/* Subtitle */}
              <p className="text-slate-600 text-sm sm:text-base font-normal max-w-lg leading-relaxed">
                Elevate your everyday mobile experience with high-capacity fast-charging power banks, studio-grade ENC wireless airbuds, and GaN wall chargers.
              </p>

              {/* Feature Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-semibold text-slate-700">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">
                  <BatteryCharging className="w-3.5 h-3.5 text-emerald-600" />
                  <span>20,000mAh PD Fast Charge</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">
                  <Headphones className="w-3.5 h-3.5 text-blue-600" />
                  <span>ENC Crystal Calls & Bass</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>65W GaN Technology</span>
                </span>
              </div>

              {/* Dual CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#catalogue"
                  onClick={(e) => {
                    if (onExploreClick) {
                      e.preventDefault();
                      onExploreClick();
                    }
                  }}
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-slate-900/10 active:scale-95 group cursor-pointer"
                >
                  <span>Shop Collection</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>

                <Link
                  href="/products?deals=true"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs sm:text-sm transition-all shadow-2xs active:scale-95"
                >
                  <Zap className="w-4 h-4 text-[#F59E0B]" />
                  <span>Today&apos;s Flash Deals</span>
                </Link>
              </div>

              {/* Small verified buyer social proof */}
              <div className="flex items-center gap-3 pt-2 text-xs text-slate-500">
                <div className="flex -space-x-1.5 overflow-hidden">
                  <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-slate-200 flex items-center justify-center font-bold text-[9px] text-slate-700">AS</div>
                  <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-amber-200 flex items-center justify-center font-bold text-[9px] text-amber-900">PK</div>
                  <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-blue-200 flex items-center justify-center font-bold text-[9px] text-blue-900">COD</div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex text-amber-400">
                    {'★'.repeat(5)}
                  </div>
                  <span className="font-semibold text-slate-800">4.9/5</span>
                  <span>(1,250+ reviews nationwide)</span>
                </div>
              </div>
            </div>

            {/* Right Showcase Card (5 cols) */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full aspect-4/3 sm:aspect-square max-w-md rounded-2xl bg-gradient-to-tr from-slate-100 via-white to-amber-50/30 p-6 flex items-center justify-center border border-slate-200/90 shadow-lg group">
                {/* Product Image */}
                <Image
                  src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80"
                  alt="Flagship Wireless Airbuds & Power Banks"
                  fill
                  sizes="(max-width: 768px) 100vw, 420px"
                  priority
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                />

                {/* Floating Badge Top Left */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-xl p-2.5 shadow-md flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block leading-none">Status</span>
                    <span className="text-xs font-black text-slate-900">100% Original Stock</span>
                  </div>
                </div>

                {/* Floating Badge Bottom Right */}
                <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-xl p-2.5 shadow-md flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-[#F59E0B] flex items-center justify-center font-bold">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block leading-none">Fast Delivery</span>
                    <span className="text-xs font-black text-slate-900">Nationwide COD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Trust Badges Strip (Clean Light Cards) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900">100% Genuine</h4>
              <p className="text-[11px] text-slate-500">Verified authentic stock</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900">Express Delivery</h4>
              <p className="text-[11px] text-slate-500">Fast cash on delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900">7-Day Warranty</h4>
              <p className="text-[11px] text-slate-500">Easy replacement policy</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#F59E0B] flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900">24/7 WhatsApp</h4>
              <p className="text-[11px] text-slate-500">+92 320 1042634</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
