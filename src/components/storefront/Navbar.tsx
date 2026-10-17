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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      {/* Top Notification / Hotline Strip */}
      <div className="bg-slate-950 text-slate-300 text-[11px] py-1.5 px-4 sm:px-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              ⚡ <strong className="text-white">Free Express Delivery</strong> on orders over Rs. {freeThreshold.toLocaleString()}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-slate-400">
            <a
              href={`tel:${businessPhone.replace(/\s+/g, '')}`}
              className="flex items-center gap-1.5 hover:text-[#F59E0B] transition"
            >
              <PhoneCall className="w-3 h-3 text-[#F59E0B]" />
              <span className="font-semibold text-slate-200">{businessPhone}</span>
            </a>
            <span className="text-slate-700">|</span>
            <span className="text-slate-400">Cash on Delivery Nationwide</span>
          </div>
        </div>
      </div>

      {/* Main Tier: Logo, Search Bar, Action Pills */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4 lg:gap-8">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Logo in Light Mode */}
          <div className="shrink-0">
            <AsStoreLogo variant="light" size="md" />
          </div>

          {/* Modern Capsule Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-auto">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search power banks, airbuds, fast chargers, cables..."
                className="w-full pl-5 pr-12 py-2.5 rounded-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-medium border border-slate-200/90 focus:border-[#F59E0B] focus:ring-3 focus:ring-amber-500/15 focus:outline-none transition shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition p-1"
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
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full text-slate-700 hover:text-slate-950 hover:bg-slate-100 text-xs font-semibold transition"
              title={user ? 'Customer Account' : 'Admin Portal'}
            >
              <User className="w-4 h-4 text-slate-600" />
              <span>Account</span>
            </Link>

            {/* Wishlist */}
            <Link
              href="/products?deals=true"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full text-slate-700 hover:text-rose-600 hover:bg-rose-50 text-xs font-semibold transition"
              title="Saved Items"
            >
              <Heart className="w-4 h-4 text-slate-600 hover:text-rose-600" />
              <span>Wishlist</span>
            </Link>

            {/* Modern Cart Button */}
            <button
              onClick={openCart}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs hover:shadow-md active:scale-95 cursor-pointer group"
              aria-label="View Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                <span className="absolute -top-1.5 -right-2 flex items-center justify-center min-w-[15px] h-[15px] px-0.5 rounded-full bg-[#F59E0B] text-slate-950 text-[9px] font-black leading-none shadow-xs">
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
              className="w-full pl-4 pr-10 py-2 rounded-full bg-slate-100 text-slate-900 placeholder:text-slate-400 text-xs font-medium border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#F59E0B]"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Sub Tier: Categories & Secondary Navigation */}
      <div className="border-t border-slate-100 bg-slate-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-11 text-xs">
            {/* Left: All Categories Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setCategoriesDropdown(!categoriesDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-800 hover:text-slate-950 hover:bg-slate-200/60 font-bold transition"
              >
                <Menu className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>All Categories</span>
                <ChevronDown
                  className={`w-3 h-3 text-slate-500 transition-transform duration-200 ${
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
                      className="block px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#F59E0B] transition"
                    >
                      {cat.name}
                    </Link>
                  ))}
                  <div className="border-t border-slate-100 my-1 pt-1">
                    <Link
                      href="/products"
                      onClick={() => setCategoriesDropdown(false)}
                      className="block px-4 py-2 text-xs font-bold text-blue-600 hover:bg-slate-50 transition"
                    >
                      Browse Entire Catalogue →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Center Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7 font-semibold">
              <Link
                href="/"
                className={`py-3 border-b-2 transition ${
                  pathname === '/'
                    ? 'border-[#F59E0B] text-slate-950 font-bold'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Home
              </Link>
              <Link
                href="/products"
                className={`py-3 border-b-2 transition ${
                  pathname === '/products'
                    ? 'border-[#F59E0B] text-slate-950 font-bold'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Shop All
              </Link>
              <Link
                href="/products?deals=true"
                className="py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 transition flex items-center gap-1"
              >
                <Zap className="w-3 h-3 text-[#F59E0B]" />
                <span>Hot Deals</span>
              </Link>
              <Link
                href="/products?sort=newest"
                className="py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 transition"
              >
                New Arrivals
              </Link>
              <Link
                href="/about"
                className={`py-3 border-b-2 transition ${
                  pathname === '/about'
                    ? 'border-[#F59E0B] text-slate-950 font-bold'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className={`py-3 border-b-2 transition ${
                  pathname === '/contact'
                    ? 'border-[#F59E0B] text-slate-950 font-bold'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Contact & Support
              </Link>
            </nav>

            {/* Right: Free Delivery Pill */}
            <div className="flex items-center gap-2 text-slate-700">
              <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-[#F59E0B] shrink-0">
                <Truck className="w-3 h-3" />
              </div>
              <span className="text-[11px] font-semibold">
                Free Delivery above <strong className="text-slate-950">Rs. {freeThreshold.toLocaleString()}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[110px] z-50 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="w-4/5 max-w-sm h-full p-6 overflow-y-auto bg-white text-slate-900 border-r border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-bold text-sm text-slate-900">Navigation Menu</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 font-semibold text-sm">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-slate-700 hover:text-[#F59E0B]"
              >
                Home
              </Link>
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-slate-700 hover:text-[#F59E0B]"
              >
                Shop All
              </Link>
              <Link
                href="/products?deals=true"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-slate-700 hover:text-[#F59E0B]"
              >
                Hot Deals
              </Link>
              <Link
                href="/products?sort=newest"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-slate-700 hover:text-[#F59E0B]"
              >
                New Arrivals
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-slate-700 hover:text-[#F59E0B]"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-slate-700 hover:text-[#F59E0B]"
              >
                Contact
              </Link>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">
                Top Categories
              </span>
              {categories.slice(0, 6).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-xs text-slate-600 hover:text-slate-950 py-1"
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs font-bold text-blue-600 hover:text-blue-700 py-1"
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
