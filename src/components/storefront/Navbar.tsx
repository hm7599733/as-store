'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  Truck,
  ChevronDown,
  PhoneCall,
  Zap,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import AsStoreLogo from '@/components/brand/AsStoreLogo';
import type { Category, Settings } from '@/types/database';

export default function Navbar({
  categories = [],
  settings,
}: {
  categories: Category[];
  settings: Settings | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { totalItems, openCart } = useCart();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdown, setCategoriesDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const freeThreshold = settings?.free_shipping_threshold ?? 3000;
  const businessPhone = settings?.contact_phone || '+92 320 1042634';

  const notices = [
    {
      badge: 'TOP DEAL',
      text: `Free Express Delivery nationwide on orders over Rs. ${freeThreshold.toLocaleString()}!`,
    },
    {
      badge: 'TOP TECH',
      text: '20,000mAh High-Capacity Power Banks & 65W GaN Fast Chargers with official warranty.',
    },
    {
      badge: 'TOP AUDIO',
      text: 'Studio-grade ENC Wireless Airbuds with deep punchy bass & clear calls.',
    },
    {
      badge: 'TOP WARRANTY',
      text: '100% Original Certified Products with 7-Day Easy Replacement Policy.',
    },
    {
      badge: 'TOP SUPPORT',
      text: `Official 24/7 Helpline & WhatsApp: ${businessPhone}`,
    },
  ];

  const [activeNoticeIdx, setActiveNoticeIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveNoticeIdx((prev) => (prev + 1) % notices.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [notices.length]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  // Close categories dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCategoriesDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#0B132B] text-white shadow-lg transition-all border-b border-cyan-950/60">
      {/* Top Animated Notification / Hotline Strip */}
      <div className="bg-[#050A17] text-slate-300 text-[11px] py-1.5 px-4 sm:px-6 border-b border-cyan-950/80 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2.5 overflow-hidden">
            {/* Glowing Animated TOP Badge */}
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-500 text-slate-950 font-black text-[9px] tracking-widest uppercase shadow-sm shadow-cyan-400/50 animate-pulse shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
              TOP
            </span>

            {/* Cycling animated announcement message */}
            <div className="relative h-5 overflow-hidden flex items-center">
              <div
                key={activeNoticeIdx}
                className="flex items-center gap-1.5 text-slate-200 animate-slide-up"
              >
                <span className="text-[10px] font-black text-cyan-300 uppercase tracking-wider hidden sm:inline">
                  [{notices[activeNoticeIdx].badge}]
                </span>
                <span className="font-medium text-slate-200 line-clamp-1">
                  {notices[activeNoticeIdx].text}
                </span>
              </div>
            </div>

            {/* Manual cycling arrows */}
            <div className="hidden sm:flex items-center gap-1 pl-2 text-slate-500 shrink-0">
              <button
                onClick={() => setActiveNoticeIdx((prev) => (prev - 1 + notices.length) % notices.length)}
                className="p-0.5 hover:text-cyan-400 transition cursor-pointer"
                aria-label="Previous announcement"
              >
                <ChevronLeft className="w-3 h-3" />
              </button>
              <button
                onClick={() => setActiveNoticeIdx((prev) => (prev + 1) % notices.length)}
                className="p-0.5 hover:text-cyan-400 transition cursor-pointer"
                aria-label="Next announcement"
              >
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-slate-400 shrink-0">
            <a
              href={`tel:${businessPhone.replace(/\s+/g, '')}`}
              className="flex items-center gap-1.5 hover:text-[#06B6D4] transition"
            >
              <PhoneCall className="w-3 h-3 text-[#06B6D4]" />
              <span className="font-semibold text-slate-200">{businessPhone}</span>
            </a>
            <span className="text-slate-700">|</span>
            <span className="text-slate-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Cash on Delivery Nationwide
            </span>
          </div>
        </div>
      </div>

      {/* Main Tier: Logo, Search Bar, Action Pills */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4 lg:gap-8">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Logo in Royal Tech Theme */}
          <div className="shrink-0">
            <AsStoreLogo variant="dark" size="md" />
          </div>

          {/* Modern Capsule Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-auto">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search power banks, airbuds, fast chargers, cables..."
                className="w-full pl-5 pr-12 py-2.5 rounded-full bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-medium border border-transparent focus:border-[#06B6D4] focus:ring-3 focus:ring-cyan-500/25 focus:outline-none transition shadow-sm"
              />
              <button
                type="submit"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#06B6D4] transition p-1"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right Action Items */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Account */}
            <Link
              href={user ? '/account' : '/admin/login'}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-800/80 text-xs font-semibold transition"
              title={user ? 'Customer Account' : 'Admin Portal'}
            >
              <User className="w-4 h-4 text-[#06B6D4]" />
              <span>Account</span>
            </Link>

            {/* Wishlist */}
            <Link
              href="/products?deals=true"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-800/80 text-xs font-semibold transition"
              title="Saved Items"
            >
              <Heart className="w-4 h-4 text-cyan-400" />
              <span>Wishlist</span>
            </Link>

            {/* Cyber Cyan Cart Button */}
            <button
              onClick={openCart}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black transition-all shadow-md shadow-cyan-500/20 active:scale-95 cursor-pointer group"
              aria-label="View Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-slate-950 group-hover:scale-110 transition-transform" />
                <span className="absolute -top-1.5 -right-2 flex items-center justify-center min-w-[15px] h-[15px] px-0.5 rounded-full bg-slate-950 text-cyan-300 text-[9px] font-black leading-none shadow-xs">
                  {totalItems}
                </span>
              </div>
              <span className="hidden sm:inline">Cart</span>
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search power banks, airbuds, chargers..."
              className="w-full pl-4 pr-10 py-2 rounded-full bg-white text-slate-900 placeholder:text-slate-400 text-xs font-medium border border-transparent focus:outline-none focus:ring-2 focus:ring-[#06B6D4]"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#06B6D4]"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Sub Tier: Categories & Secondary Navigation */}
      <div className="border-t border-slate-800 bg-[#070D1E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-11 text-xs">
            {/* Left: All Categories Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setCategoriesDropdown(!categoriesDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-200 hover:text-white hover:bg-slate-800 font-bold transition"
              >
                <Menu className="w-3.5 h-3.5 text-[#06B6D4]" />
                <span>All Categories</span>
                <ChevronDown
                  className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
                    categoriesDropdown ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Categories Menu Popup */}
              {categoriesDropdown && (
                <div className="absolute left-0 mt-2 w-60 rounded-2xl bg-white border border-slate-200 shadow-2xl py-2 z-50 text-slate-800 animate-slide-up">
                  <div className="px-3.5 py-1.5 text-[10px] uppercase font-black tracking-wider text-slate-400">
                    Mobile Accessories
                  </div>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/products?category=${cat.slug}`}
                      onClick={() => setCategoriesDropdown(false)}
                      className="block px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-cyan-50 hover:text-cyan-700 transition"
                    >
                      {cat.name}
                    </Link>
                  ))}
                  <div className="border-t border-slate-100 my-1 pt-1">
                    <Link
                      href="/products"
                      onClick={() => setCategoriesDropdown(false)}
                      className="block px-4 py-2 text-xs font-bold text-cyan-600 hover:bg-cyan-50 transition"
                    >
                      Browse Entire Catalogue →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Center Navigation Links with Cyber Cyan active indicators */}
            <nav className="hidden lg:flex items-center gap-7 font-semibold">
              <Link
                href="/"
                className={`py-3 border-b-2 transition ${
                  pathname === '/'
                    ? 'border-[#06B6D4] text-[#06B6D4] font-bold'
                    : 'border-transparent text-slate-300 hover:text-white'
                }`}
              >
                Home
              </Link>
              <Link
                href="/products"
                className={`py-3 border-b-2 transition ${
                  pathname === '/products'
                    ? 'border-[#06B6D4] text-[#06B6D4] font-bold'
                    : 'border-transparent text-slate-300 hover:text-white'
                }`}
              >
                Shop All
              </Link>
              <Link
                href="/products?deals=true"
                className="py-3 border-b-2 border-transparent text-slate-300 hover:text-white transition flex items-center gap-1"
              >
                <Zap className="w-3 h-3 text-[#06B6D4]" />
                <span>Hot Deals</span>
              </Link>
              <Link
                href="/products?sort=newest"
                className="py-3 border-b-2 border-transparent text-slate-300 hover:text-white transition"
              >
                New Arrivals
              </Link>
              <Link
                href="/about"
                className={`py-3 border-b-2 transition ${
                  pathname === '/about'
                    ? 'border-[#06B6D4] text-[#06B6D4] font-bold'
                    : 'border-transparent text-slate-300 hover:text-white'
                }`}
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className={`py-3 border-b-2 transition ${
                  pathname === '/contact'
                    ? 'border-[#06B6D4] text-[#06B6D4] font-bold'
                    : 'border-transparent text-slate-300 hover:text-white'
                }`}
              >
                Contact & Support
              </Link>
            </nav>

            {/* Right: Free Delivery Pill */}
            <div className="flex items-center gap-2 text-slate-300">
              <div className="w-5 h-5 rounded-full bg-cyan-950/80 border border-cyan-800 flex items-center justify-center text-[#06B6D4] shrink-0">
                <Truck className="w-3 h-3" />
              </div>
              <span className="text-[11px] font-semibold">
                Free Delivery above <strong className="text-white">Rs. {freeThreshold.toLocaleString()}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[110px] z-50 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-4/5 max-w-sm h-full p-6 overflow-y-auto bg-[#0B132B] text-white border-r border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-bold text-sm text-[#06B6D4]">Navigation Menu</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 font-semibold text-sm">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-slate-300 hover:text-[#06B6D4]"
              >
                Home
              </Link>
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-slate-300 hover:text-[#06B6D4]"
              >
                Shop All
              </Link>
              <Link
                href="/products?deals=true"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-slate-300 hover:text-[#06B6D4]"
              >
                Hot Deals
              </Link>
              <Link
                href="/products?sort=newest"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-slate-300 hover:text-[#06B6D4]"
              >
                New Arrivals
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-slate-300 hover:text-[#06B6D4]"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-slate-300 hover:text-[#06B6D4]"
              >
                Contact
              </Link>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">
                Top Categories
              </span>
              {categories.slice(0, 6).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-xs text-slate-300 hover:text-[#06B6D4] py-1"
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-2">
              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs font-bold text-[#06B6D4] hover:text-cyan-300 py-1"
              >
                Store Admin Portal →
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
