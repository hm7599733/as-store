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
          {/* Banner 1: Smartphones */}
          <div className="relative rounded-2xl bg-gradient-to-r from-[#0B132B] to-[#1C2541] p-6 sm:p-7 overflow-hidden text-white flex flex-col justify-between min-h-[170px] shadow-sm group">
            <div className="relative z-10 max-w-[60%] space-y-1.5">
              <h3 className="font-display font-black text-lg sm:text-xl text-white">
                Smartphones
              </h3>
              <p className="text-slate-300 text-xs leading-relaxed">
                Stay connected with the latest models
              </p>
              <div className="pt-3">
                <Link
                  href="/products?category=mobile-phones"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/40 hover:border-white bg-white/10 hover:bg-white text-white hover:text-slate-900 text-xs font-bold transition shadow-xs"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Graphic on right */}
            <div className="absolute right-2 bottom-0 top-0 w-28 sm:w-36 flex items-center justify-end pointer-events-none">
              <div className="relative w-full h-4/5">
                <Image
                  src="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&auto=format&fit=crop&q=80"
                  alt="Smartphones"
                  fill
                  sizes="150px"
                  className="object-contain group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            </div>
          </div>

          {/* Banner 2: Accessories */}
          <div className="relative rounded-2xl bg-gradient-to-r from-[#111827] to-[#1F2937] p-6 sm:p-7 overflow-hidden text-white flex flex-col justify-between min-h-[170px] shadow-sm group">
            <div className="relative z-10 max-w-[60%] space-y-1.5">
              <h3 className="font-display font-black text-lg sm:text-xl text-white">
                Accessories
              </h3>
              <p className="text-slate-300 text-xs leading-relaxed">
                Small things. Big difference.
              </p>
              <div className="pt-3">
                <Link
                  href="/products?category=chargers"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/40 hover:border-white bg-white/10 hover:bg-white text-white hover:text-slate-900 text-xs font-bold transition shadow-xs"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Graphic on right */}
            <div className="absolute right-2 bottom-0 top-0 w-28 sm:w-36 flex items-center justify-end pointer-events-none">
              <div className="relative w-full h-4/5">
                <Image
                  src="https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=300&auto=format&fit=crop&q=80"
                  alt="Accessories"
                  fill
                  sizes="150px"
                  className="object-contain group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            </div>
          </div>

          {/* Banner 3: Special Deals (Vibrant Yellow matching Mockup) */}
          <div className="relative rounded-2xl bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#F59E0B] p-6 sm:p-7 overflow-hidden text-slate-950 flex flex-col justify-between min-h-[170px] shadow-sm group">
            <div className="relative z-10 max-w-[60%] space-y-1.5">
              <h3 className="font-display font-black text-lg sm:text-xl text-slate-950">
                Special Deals
              </h3>
              <p className="text-slate-900 text-xs leading-relaxed font-medium">
                Get your favorite gadgets at unbeatable prices
              </p>
              <div className="pt-3">
                <Link
                  href="/products?deals=true"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-950 hover:bg-black text-white text-xs font-bold transition shadow-sm"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Graphic on right */}
            <div className="absolute right-2 bottom-0 top-0 w-28 sm:w-36 flex items-center justify-end pointer-events-none">
              <div className="relative w-full h-4/5">
                <Image
                  src="https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=300&auto=format&fit=crop&q=80"
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
