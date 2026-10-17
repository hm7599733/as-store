'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Send,
  CheckCircle2,
  Lock,
  PhoneCall,
  Mail,
  MapPin,
} from 'lucide-react';
import AsStoreLogo from '@/components/brand/AsStoreLogo';
import type { Settings } from '@/types/database';

export default function Footer({ settings }: { settings: Settings | null }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const businessPhone = settings?.contact_phone || settings?.whatsapp_number || '+92 320 1042634';

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#060C1B] text-white border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-slate-800/80">
          {/* Column 1: Brand & Contact Info (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <AsStoreLogo variant="dark" size="md" />

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Your trusted destination for premium mobile accessories in Pakistan. Heavy-duty fast power banks, studio-grade wireless airbuds, GaN wall chargers, and indestructible braided cables.
            </p>

            <div className="space-y-2 text-xs text-slate-300 pt-1">
              <a
                href={`tel:${businessPhone.replace(/\s+/g, '')}`}
                className="flex items-center gap-2 hover:text-[#06B6D4] transition"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#06B6D4]" />
                <span className="font-semibold text-white">{businessPhone}</span>
              </a>
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-cyan-500" />
                <span>Nationwide Express Cash on Delivery, Pakistan</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-2">
              {/* Facebook */}
              <a
                href={settings?.facebook || 'https://facebook.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#0B152E] hover:bg-[#06B6D4] text-slate-300 hover:text-slate-950 flex items-center justify-center transition border border-slate-800"
                aria-label="Facebook"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href={settings?.instagram || 'https://instagram.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#0B152E] hover:bg-[#06B6D4] text-slate-300 hover:text-slate-950 flex items-center justify-center transition border border-slate-800"
                aria-label="Instagram"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#0B152E] hover:bg-[#06B6D4] text-slate-300 hover:text-slate-950 flex items-center justify-center transition border border-slate-800"
                aria-label="YouTube"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>

              {/* TikTok */}
              <a
                href={settings?.tiktok || 'https://tiktok.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#0B152E] hover:bg-[#06B6D4] text-slate-300 hover:text-slate-950 flex items-center justify-center transition border border-slate-800 text-xs font-black"
                aria-label="TikTok"
              >
                ♪
              </a>
            </div>

            <p className="text-[11px] text-slate-500 pt-2">
              © {new Date().getFullYear()} AS Store Pakistan. All rights reserved.
            </p>
          </div>

          {/* Column 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              Categories
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li>
                <Link href="/products?category=power-banks" className="hover:text-[#06B6D4] transition">Power Banks</Link>
              </li>
              <li>
                <Link href="/products?category=wireless-earbuds" className="hover:text-[#06B6D4] transition">Airbuds & Audio</Link>
              </li>
              <li>
                <Link href="/products?category=chargers" className="hover:text-[#06B6D4] transition">GaN Fast Chargers</Link>
              </li>
              <li>
                <Link href="/products?category=usb-cables" className="hover:text-[#06B6D4] transition">Charging Cables</Link>
              </li>
              <li>
                <Link href="/products?category=smart-watches" className="hover:text-[#06B6D4] transition">Smart Watches</Link>
              </li>
              <li>
                <Link href="/products?deals=true" className="hover:text-[#06B6D4] transition text-[#06B6D4]">Flash Deals</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Service & Policies (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              Customer Support
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li>
                <Link href="/contact" className="hover:text-[#06B6D4] transition">Help Center & FAQs</Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-[#06B6D4] transition">Shipping & Delivery Info</Link>
              </li>
              <li>
                <Link href="/return-policy" className="hover:text-[#06B6D4] transition">7-Day Replacement Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#06B6D4] transition">Terms of Service</Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-[#06B6D4] transition">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-[#06B6D4] transition text-[11px] text-slate-500 block pt-1">
                  Admin Dashboard Login →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter Subscription (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              Stay in the Loop
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Subscribe for exclusive coupon codes, flash discounts, and new mobile gear launches.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex rounded-xl overflow-hidden border border-slate-800 focus-within:border-cyan-500">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="flex-1 px-3.5 py-2.5 text-xs bg-[#0B152E] text-white placeholder:text-slate-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#06B6D4] hover:bg-cyan-300 text-slate-950 font-black text-xs transition whitespace-nowrap cursor-pointer"
                >
                  Join
                </button>
              </div>

              {subscribed && (
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Subscribed! Check your inbox for exclusive vouchers.</span>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Payment Badges Row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-[#0B152E] text-[11px] font-bold text-white border border-slate-800">
              VISA
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[#0B152E] text-[11px] font-bold text-white border border-slate-800">
              Mastercard
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[#0B152E] text-[11px] font-bold text-[#EAB308] border border-slate-800">
              JazzCash
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[#0B152E] text-[11px] font-bold text-emerald-400 border border-slate-800">
              EasyPaisa
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[#0B152E] text-[11px] font-bold text-cyan-400 border border-slate-800">
              COD
            </span>
          </div>

          <div className="font-semibold text-slate-300 flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[#06B6D4] animate-pulse" />
            <span>Cash on Delivery Available Nationwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
