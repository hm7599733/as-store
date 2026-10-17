'use client';

import React from 'react';
import { Truck, ShieldCheck, Zap, Headphones } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { Settings } from '@/types/database';

export default function TopTicker({ settings }: { settings: Settings | null }) {
  const freeThreshold = settings?.free_shipping_threshold ?? 3000;

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white border-b border-blue-900/40 text-xs py-2 px-4 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-0.5 mx-auto md:mx-0">
          <div className="flex items-center gap-1.5 shrink-0 text-slate-200">
            <Truck className="w-3.5 h-3.5 text-blue-400" />
            <span>Free Nationwide Delivery on orders over <strong className="text-white font-semibold">{formatPrice(freeThreshold)}</strong></span>
          </div>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5 shrink-0 text-slate-200 hidden sm:flex">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Cash on Delivery (COD) Available</span>
          </div>
          <span className="text-slate-600 hidden md:inline">•</span>
          <div className="flex items-center gap-1.5 shrink-0 text-slate-200 hidden md:flex">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>7-Day Replacement Warranty</span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-slate-300 hover:text-white transition">
          <Headphones className="w-3.5 h-3.5 text-blue-400" />
          <a
            href={`https://wa.me/${(settings?.whatsapp_number || '+923201042634').replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            24/7 Support: {settings?.whatsapp_number || '+92 320 1042634'}
          </a>
        </div>
      </div>
    </div>
  );
}
