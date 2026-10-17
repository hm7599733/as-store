'use client';

import React from 'react';
import Link from 'next/link';
import {
  PhoneCall,
  Mail,
  MapPin,
  ShieldCheck,
  Truck,
  Zap,
  ArrowRight,
} from 'lucide-react';
import type { Settings } from '@/types/database';
import { useTheme } from '@/components/theme/ThemeProvider';

export default function Footer({ settings }: { settings: Settings | null }) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const rawPhone = settings?.whatsapp_number || '+92 348 9593671';
  const cleanPhone = rawPhone.replace(/\D/g, '');

  return (
    <footer className={`border-t transition-colors ${
      isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-[#060912] border-slate-800/80 text-slate-300'
    }`}>
      {/* Upper Footer: Value Props */}
      <div className="border-b border-slate-800/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h5 className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Nationwide Delivery
              </h5>
              <p className="text-[11px] text-slate-400">Cash on Delivery across Pakistan</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                7-Day Replacement
              </h5>
              <p className="text-[11px] text-slate-400">Easy return & warranty protection</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h5 className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                100% Genuine Items
              </h5>
              <p className="text-[11px] text-slate-400">Strictly inspected & verified stock</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h5 className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                WhatsApp Assistance
              </h5>
              <p className="text-[11px] text-slate-400">Real-time support and order tracking</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main 4-Column Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info (2 columns) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm">
                AS
              </div>
              <span className={`font-display font-black text-lg ${isLight ? 'text-slate-900' : 'text-white'}`}>
                AS STORE
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              AS Store delivers premium mobile accessories, power banks, fast chargers, earbuds, and everyday tech essentials with dependable nationwide Cash on Delivery across Pakistan.
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Lahore, Punjab, Pakistan</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a href="mailto:support@asstore.pk" className="hover:underline">
                  support@asstore.pk
                </a>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-blue-400 shrink-0" />
                <a
                  href={`https://wa.me/${cleanPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {rawPhone}
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Shop & Explore
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/" className="hover:text-blue-500 transition">Home</Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-blue-500 transition">All Products</Link>
              </li>
              <li>
                <Link href="/products?deals=true" className="hover:text-blue-500 transition">Special Deals</Link>
              </li>
              <li>
                <Link href="/products?category=power-banks" className="hover:text-blue-500 transition">Power Banks</Link>
              </li>
              <li>
                <Link href="/products?category=wireless-earbuds" className="hover:text-blue-500 transition">Wireless Earbuds</Link>
              </li>
              <li>
                <Link href="/products?category=chargers" className="hover:text-blue-500 transition">Fast Chargers</Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/shipping-policy" className="hover:text-blue-500 transition">Shipping & Delivery</Link>
              </li>
              <li>
                <Link href="/return-policy" className="hover:text-blue-500 transition">Return & Warranty Policy</Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-blue-500 transition">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-blue-500 transition">Terms of Service</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-500 transition">Help & Contact</Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-blue-500 transition text-slate-500">Staff Portal</Link>
              </li>
            </ul>
          </div>

          {/* Trust & Newsletter */}
          <div className="space-y-3">
            <h4 className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Order Assistance
            </h4>
            <p className="text-xs text-slate-400">
              Need help choosing the right charger or cable for your phone? Chat directly with our product specialist on WhatsApp.
            </p>
            <a
              href={`https://wa.me/${cleanPhone}?text=Hello%20AS%20Store!%20I%20need%20help%20with%20a%20product.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-glow-emerald"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-slate-800/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} AS Store. All rights reserved. Independent E-Commerce Brand.</p>
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-slate-400">Cash on Delivery • JazzCash • EasyPaisa • Bank Transfer</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
