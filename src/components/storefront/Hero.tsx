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
  CheckCircle2,
} from 'lucide-react';

export default function Hero({
  onExploreClick,
}: {
  onExploreClick?: () => void;
}) {
  return (
    <section className="py-6 sm:py-8 bg-[#070D1E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Hero Container — Royal Tech Theme */}
        <div className="relative rounded-3xl bg-gradient-to-r from-[#070D1E] via-[#0B132B] to-[#111C38] border border-cyan-900/40 p-6 sm:p-10 lg:p-12 overflow-hidden shadow-2xl">
          {/* Ambient Cyber Cyan Lighting */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#06B6D4]/15 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute bottom-0 right-10 w-80 h-80 bg-blue-600/10 blur-3xl rounded-full pointer-events-none" />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6 z-10">
              {/* Cyber Cyan Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-bold">
                <Zap className="w-3.5 h-3.5 text-[#06B6D4] fill-[#06B6D4]" />
                <span>NEXT-GEN POWER & AUDIO GEAR</span>
              </div>

              {/* Headline */}
              <h1 className="font-display text-3xl sm:text-5xl lg:text-[3.5rem] font-black text-white leading-[1.08] tracking-tight">
                Power That Keeps Up <br className="hidden sm:block" />
                With <span className="bg-gradient-to-r from-[#22D3EE] via-[#06B6D4] to-[#38BDF8] bg-clip-text text-transparent">Your Lifestyle.</span>
              </h1>

              {/* Subtitle */}
              <p className="text-slate-300 text-sm sm:text-base font-normal max-w-lg leading-relaxed">
                Elevate your everyday mobile experience with high-capacity fast-charging power banks, studio-grade ENC wireless airbuds, and GaN wall chargers.
              </p>

              {/* Feature Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-semibold text-slate-200">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/90 border border-slate-700/80">
                  <BatteryCharging className="w-3.5 h-3.5 text-[#06B6D4]" />
                  <span>20,000mAh PD Fast Charge</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/90 border border-slate-700/80">
                  <Headphones className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>ENC Crystal Calls & Bass</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/90 border border-slate-700/80">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
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
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#06B6D4] hover:bg-[#22D3EE] text-slate-950 font-black text-xs sm:text-sm transition-all shadow-lg shadow-cyan-500/25 active:scale-95 group cursor-pointer"
                >
                  <span>Shop Collection</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>

                <Link
                  href="/products?deals=true"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-700 font-bold text-xs sm:text-sm transition-all active:scale-95"
                >
                  <Zap className="w-4 h-4 text-[#06B6D4]" />
                  <span>Today&apos;s Flash Deals</span>
                </Link>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-3 pt-2 text-xs text-slate-400">
                <div className="flex -space-x-1.5 overflow-hidden">
                  <div className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 bg-cyan-600 flex items-center justify-center font-bold text-[9px] text-white">AS</div>
                  <div className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 bg-blue-600 flex items-center justify-center font-bold text-[9px] text-white">PK</div>
                  <div className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 bg-slate-700 flex items-center justify-center font-bold text-[9px] text-cyan-300">COD</div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex text-cyan-400">
                    {'★'.repeat(5)}
                  </div>
                  <span className="font-semibold text-white">4.9/5</span>
                  <span>(1,250+ verified buyers across Pakistan)</span>
                </div>
              </div>
            </div>

            {/* Right Showcase Card (5 cols) */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full aspect-4/3 sm:aspect-square max-w-md rounded-2xl bg-gradient-to-tr from-slate-900/90 via-[#0B132B] to-slate-800/60 p-6 flex items-center justify-center border border-cyan-900/50 shadow-2xl group">
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
                <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md border border-cyan-800/60 rounded-xl p-2.5 shadow-lg flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-cyan-950 text-[#06B6D4] flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block leading-none">Status</span>
                    <span className="text-xs font-black text-white">100% Original Stock</span>
                  </div>
                </div>

                {/* Floating Badge Bottom Right */}
                <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur-md border border-cyan-800/60 rounded-xl p-2.5 shadow-lg flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-cyan-950 text-[#06B6D4] flex items-center justify-center font-bold">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block leading-none">Fast Delivery</span>
                    <span className="text-xs font-black text-white">Nationwide COD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Trust Badges Strip (Royal Tech) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-[#0B132B] border border-cyan-950 text-white shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 text-[#06B6D4] border border-cyan-900/50 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-white">100% Genuine</h4>
              <p className="text-[11px] text-slate-400">Verified authentic stock</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-[#0B132B] border border-cyan-950 text-white shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 text-[#06B6D4] border border-cyan-900/50 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-white">Express Delivery</h4>
              <p className="text-[11px] text-slate-400">Fast cash on delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-[#0B132B] border border-cyan-950 text-white shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 text-[#06B6D4] border border-cyan-900/50 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-white">7-Day Warranty</h4>
              <p className="text-[11px] text-slate-400">Easy replacement policy</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-[#0B132B] border border-cyan-950 text-white shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 text-[#06B6D4] border border-cyan-900/50 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-white">24/7 WhatsApp</h4>
              <p className="text-[11px] text-slate-400">+92 320 1042634</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
