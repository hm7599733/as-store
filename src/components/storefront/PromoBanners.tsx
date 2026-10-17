'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BatteryCharging, Headphones, Zap } from 'lucide-react';

export default function PromoBanners() {
  return (
    <section className="py-8 sm:py-10 bg-[#070D1E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {/* Banner 1: Power Banks (Midnight Sapphire) */}
          <div className="relative rounded-3xl bg-gradient-to-br from-[#060C1B] via-[#0B132B] to-[#111C38] p-6 sm:p-7 overflow-hidden text-white flex flex-col justify-between min-h-[190px] shadow-sm group border border-cyan-950/60">
            {/* Ambient cyan glow */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#06B6D4]/15 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 max-w-[62%] space-y-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950 text-[#06B6D4] border border-cyan-800/40 text-[10px] font-black uppercase tracking-wider">
                <BatteryCharging className="w-3 h-3" />
                <span>Heavy Duty Backup</span>
              </span>
              <h3 className="font-display font-black text-xl sm:text-2xl text-white tracking-tight leading-tight">
                High-Capacity Power Banks
              </h3>
              <p className="text-slate-300 text-xs leading-relaxed line-clamp-2">
                10,000mAh to 30,000mAh with 22.5W & 65W PD fast charging.
              </p>
              <div className="pt-2">
                <Link
                  href="/products?category=power-banks"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#06B6D4] hover:bg-cyan-300 text-slate-950 text-xs font-black transition shadow-xs"
                >
                  <span>Shop Power Banks</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Graphic on right: Power Bank */}
            <div className="absolute right-2 bottom-0 top-0 w-28 sm:w-36 flex items-center justify-end pointer-events-none">
              <div className="relative w-full h-4/5">
                <Image
                  src="https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=300&auto=format&fit=crop&q=80"
                  alt="High Capacity Power Banks"
                  fill
                  sizes="150px"
                  className="object-contain group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            </div>
          </div>

          {/* Banner 2: Wireless Airbuds Pro (Sapphire Blue Gradient) */}
          <div className="relative rounded-3xl bg-gradient-to-br from-[#0B152E] via-[#0F224A] to-[#132A5E] p-6 sm:p-7 overflow-hidden text-white flex flex-col justify-between min-h-[190px] shadow-sm group border border-cyan-850/60">
            {/* Ambient glow */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/15 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 max-w-[62%] space-y-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-950 text-cyan-300 border border-cyan-700/40 text-[10px] font-black uppercase tracking-wider">
                <Headphones className="w-3 h-3" />
                <span>Studio Audio</span>
              </span>
              <h3 className="font-display font-black text-xl sm:text-2xl text-white tracking-tight leading-tight">
                Wireless Airbuds Pro
              </h3>
              <p className="text-slate-300 text-xs leading-relaxed line-clamp-2">
                ENC noise cancellation, deep punchy bass, and 48-hour battery life.
              </p>
              <div className="pt-2">
                <Link
                  href="/products?category=wireless-earbuds"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-[#06B6D4] text-slate-950 text-xs font-black transition shadow-xs"
                >
                  <span>Shop Airbuds</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Graphic on right: Wireless Airbuds */}
            <div className="absolute right-2 bottom-0 top-0 w-28 sm:w-36 flex items-center justify-end pointer-events-none">
              <div className="relative w-full h-4/5">
                <Image
                  src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&auto=format&fit=crop&q=80"
                  alt="Wireless Airbuds"
                  fill
                  sizes="150px"
                  className="object-contain group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            </div>
          </div>

          {/* Banner 3: Fast Chargers (Cyber Cyan Gradient) */}
          <div className="relative rounded-3xl bg-gradient-to-br from-[#0891B2] via-[#06B6D4] to-[#22D3EE] p-6 sm:p-7 overflow-hidden text-slate-950 flex flex-col justify-between min-h-[190px] shadow-sm group">
            <div className="relative z-10 max-w-[62%] space-y-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/15 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                <Zap className="w-3 h-3" />
                <span>65W GaN Power</span>
              </span>
              <h3 className="font-display font-black text-xl sm:text-2xl text-slate-950 tracking-tight leading-tight">
                GaN Fast Chargers & Cables
              </h3>
              <p className="text-slate-900/90 text-xs font-semibold leading-relaxed line-clamp-2">
                Multi-port wall adapters and indestructible braided Type-C cables.
              </p>
              <div className="pt-2">
                <Link
                  href="/products?category=chargers"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-950 hover:bg-white text-white hover:text-slate-950 text-xs font-black transition shadow-xs"
                >
                  <span>Shop Fast Chargers</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Graphic on right: Charger */}
            <div className="absolute right-2 bottom-0 top-0 w-28 sm:w-36 flex items-center justify-end pointer-events-none">
              <div className="relative w-full h-4/5">
                <Image
                  src="https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=300&auto=format&fit=crop&q=80"
                  alt="Fast Chargers & Cables"
                  fill
                  sizes="150px"
                  className="object-contain group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
