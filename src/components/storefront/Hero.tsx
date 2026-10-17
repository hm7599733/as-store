'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Lock,
  Truck,
  Headphones,
  ArrowRight,
} from 'lucide-react';

export default function Hero({
  onExploreClick,
}: {
  onExploreClick?: () => void;
}) {
  return (
    <section className="py-6 sm:py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Hero Container matching mockup */}
        <div className="relative rounded-3xl bg-gradient-to-r from-[#070A14] via-[#0E1528] to-[#070A14] border border-slate-800/60 p-6 sm:p-10 lg:p-12 overflow-hidden shadow-2xl">
          {/* Subtle Ambient Light Glows */}
          <div className="absolute top-0 right-1/3 w-96 h-96 bg-blue-600/10 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute bottom-0 right-10 w-72 h-72 bg-[#F59E0B]/10 blur-3xl rounded-full pointer-events-none" />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
            {/* Left Content (5-6 cols) */}
            <div className="lg:col-span-6 space-y-4 sm:space-y-6 z-10">
              <span className="inline-block text-[#F59E0B] font-extrabold text-xs sm:text-sm tracking-widest uppercase">
                LATEST GADGETS, BEST PRICES
              </span>

              <h1 className="font-display text-3xl sm:text-5xl lg:text-[3.25rem] font-black text-white leading-[1.1] tracking-tight">
                Upgrade Your Life <br />
                with <span className="text-[#F59E0B]">AS Store</span>
              </h1>

              <p className="text-slate-300 text-sm sm:text-base font-normal max-w-md leading-relaxed">
                Premium gadgets, accessories and more — all in one place.
              </p>

              {/* CTA Button */}
              <div className="pt-2">
                <a
                  href="#catalogue"
                  onClick={(e) => {
                    if (onExploreClick) {
                      e.preventDefault();
                      onExploreClick();
                    }
                  }}
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-black text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-95 group cursor-pointer"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>

              {/* Slider Dots (Mockup exact) */}
              <div className="flex items-center gap-2 pt-2">
                <span className="w-6 h-2 rounded-full bg-[#F59E0B]" />
                <span className="w-2 h-2 rounded-full bg-slate-600" />
                <span className="w-2 h-2 rounded-full bg-slate-600" />
              </div>
            </div>

            {/* Center Product Composition Showcase (Mockup photography) */}
            <div className="lg:col-span-3 flex items-center justify-center relative min-h-[220px] sm:min-h-[280px]">
              {/* Product composite graphic */}
              <div className="relative w-full aspect-square max-w-[280px] sm:max-w-[340px]">
                <Image
                  src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80"
                  alt="Premium Tech Gadgets"
                  fill
                  sizes="(max-width: 768px) 280px, 340px"
                  className="object-contain drop-shadow-2xl rounded-2xl"
                  priority
                />
              </div>
            </div>

            {/* Right Column: 4 Trust Badges (Mockup exact) */}
            <div className="lg:col-span-3 space-y-3 z-10">
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xs">
                <div className="w-9 h-9 rounded-xl bg-slate-800 text-[#F59E0B] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-xs text-white">100% Original Products</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xs">
                <div className="w-9 h-9 rounded-xl bg-slate-800 text-[#F59E0B] flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-xs text-white">Secure Payments</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xs">
                <div className="w-9 h-9 rounded-xl bg-slate-800 text-[#F59E0B] flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-xs text-white">Fast & Reliable Delivery</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xs">
                <div className="w-9 h-9 rounded-xl bg-slate-800 text-[#F59E0B] flex items-center justify-center shrink-0">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-xs text-white">24/7 Customer Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
