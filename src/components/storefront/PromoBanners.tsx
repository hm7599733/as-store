'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function PromoBanners() {
  return (
    <section className="py-6 sm:py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Banner 1: Power Banks */}
          <div className="relative rounded-2xl bg-gradient-to-r from-[#0B132B] to-[#1C2541] p-6 sm:p-7 overflow-hidden text-white flex flex-col justify-between min-h-[170px] shadow-sm group">
            <div className="relative z-10 max-w-[60%] space-y-1.5">
              <h3 className="font-display font-black text-lg sm:text-xl text-white">
                Power Banks
              </h3>
              <p className="text-slate-300 text-xs leading-relaxed">
                High-capacity fast-charging power banks on the go
              </p>
              <div className="pt-3">
                <Link
                  href="/products?category=power-banks"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/40 hover:border-white bg-white/10 hover:bg-white text-white hover:text-slate-900 text-xs font-bold transition shadow-xs"
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
                  alt="Power Banks"
                  fill
                  sizes="150px"
                  className="object-contain group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            </div>
          </div>

          {/* Banner 2: Wireless Airbuds */}
          <div className="relative rounded-2xl bg-gradient-to-r from-[#111827] to-[#1F2937] p-6 sm:p-7 overflow-hidden text-white flex flex-col justify-between min-h-[170px] shadow-sm group">
            <div className="relative z-10 max-w-[60%] space-y-1.5">
              <h3 className="font-display font-black text-lg sm:text-xl text-white">
                Wireless Airbuds
              </h3>
              <p className="text-slate-300 text-xs leading-relaxed">
                Deep bass audio, crystal calls & ENC noise reduction
              </p>
              <div className="pt-3">
                <Link
                  href="/products?category=wireless-earbuds"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/40 hover:border-white bg-white/10 hover:bg-white text-white hover:text-slate-900 text-xs font-bold transition shadow-xs"
                >
                  <span>Shop Airbuds</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Graphic on right: Airbuds */}
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

          {/* Banner 3: Special Deals (Fast Chargers & Accessories) */}
          <div className="relative rounded-2xl bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#F59E0B] p-6 sm:p-7 overflow-hidden text-slate-950 flex flex-col justify-between min-h-[170px] shadow-sm group">
            <div className="relative z-10 max-w-[60%] space-y-1.5">
              <h3 className="font-display font-black text-lg sm:text-xl text-slate-950">
                Special Deals
              </h3>
              <p className="text-slate-900 text-xs leading-relaxed font-medium">
                GaN fast chargers, cables & accessories at best prices
              </p>
              <div className="pt-3">
                <Link
                  href="/products?deals=true"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-950 hover:bg-black text-white text-xs font-bold transition shadow-sm"
                >
                  <span>Shop Deals</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Graphic on right: Fast Charger & Accessories */}
            <div className="absolute right-2 bottom-0 top-0 w-28 sm:w-36 flex items-center justify-end pointer-events-none">
              <div className="relative w-full h-4/5">
                <Image
                  src="https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=300&auto=format&fit=crop&q=80"
                  alt="Special Deals"
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
