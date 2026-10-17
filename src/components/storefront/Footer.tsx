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
} from 'lucide-react';
import type { Settings } from '@/types/database';

export default function Footer({ settings }: { settings: Settings | null }) {
  const rawPhone = settings?.whatsapp_number || '+92 348 9593671';
  const cleanPhone = rawPhone.replace(/\D/g, '');

  return (
    <footer className="bg-slate-50 border-t border-slate-200 text-slate-600 transition-colors">
      {/* Upper Footer: Value Props */}
      <div className="border-b border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-900">
                Nationwide Delivery
              </h5>
              <p className="text-[11px] text-slate-500">Cash on Delivery across Pakistan</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-900">
                7-Day Replacement
              </h5>
              <p className="text-[11px] text-slate-500">Easy return & warranty protection</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-900">
                100% Genuine Items
              </h5>
              <p className="text-[11px] text-slate-500">Strictly inspected & verified stock</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-900">
                WhatsApp Assistance
              </h5>
              <p className="text-[11px] text-slate-500">Real-time support and order tracking</p>
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
              <span className="font-display font-black text-lg text-slate-900">
                AS STORE
              </span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              AS Store delivers premium mobile accessories, power banks, fast chargers, earbuds, and everyday tech essentials with dependable nationwide Cash on Delivery across Pakistan.
            </p>
            <div className="pt-2 text-xs text-slate-600 space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Lahore, Punjab, Pakistan</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                <a href="mailto:support@asstore.pk" className="hover:text-blue-600 transition">
                  support@asstore.pk
                </a>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-blue-600 shrink-0" />
                <a
                  href={`https://wa.me/${cleanPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition"
                >
                  {rawPhone}
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Shop & Explore
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link href="/" className="hover:text-blue-600 transition">Home</Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-blue-600 transition">All Products</Link>
              </li>
              <li>
                <Link href="/products?deals=true" className="hover:text-blue-600 transition">Special Deals</Link>
              </li>
              <li>
                <Link href="/products?category=power-banks" className="hover:text-blue-600 transition">Power Banks</Link>
              </li>
              <li>
                <Link href="/products?category=wireless-earbuds" className="hover:text-blue-600 transition">Wireless Earbuds</Link>
              </li>
              <li>
                <Link href="/products?category=chargers" className="hover:text-blue-600 transition">Fast Chargers</Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link href="/shipping-policy" className="hover:text-blue-600 transition">Shipping & Delivery</Link>
              </li>
              <li>
                <Link href="/return-policy" className="hover:text-blue-600 transition">Return & Warranty Policy</Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-blue-600 transition">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-blue-600 transition">Terms of Service</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-600 transition">Help & Contact</Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-blue-600 transition text-slate-400">Staff Portal</Link>
              </li>
            </ul>
          </div>

          {/* Trust & WhatsApp */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Order Assistance
            </h4>
            <p className="text-xs text-slate-500">
              Need help choosing the right charger or cable for your phone? Chat directly with our product specialist on WhatsApp.
            </p>
            <a
              href={`https://wa.me/${cleanPhone}?text=Hello%20AS%20Store!%20I%20need%20help%20with%20a%20product.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-slate-200 py-6 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} AS Store. All rights reserved. Independent E-Commerce Brand.</p>
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-slate-500 font-medium">Cash on Delivery • JazzCash • EasyPaisa • Bank Transfer</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
