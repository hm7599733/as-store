'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
  Sparkles,
  Zap,
  PhoneCall,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/components/theme/ThemeProvider';
import type { Category, Settings } from '@/types/database';

export default function Navbar({
  categories = [],
  settings,
}: {
  categories: Category[];
  settings: Settings | null;
}) {
  const router = useRouter();
  const { totalItems, openCart } = useCart();
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const navBg = isLight
    ? isScrolled
      ? 'bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-subtle'
      : 'bg-white border-b border-slate-200/50'
    : isScrolled
    ? 'bg-[#0A0F1D]/90 backdrop-blur-md border-b border-slate-800/80 shadow-lg'
    : 'bg-[#0A0F1D] border-b border-slate-800/50';

  return (
    <header className={`sticky top-0 z-40 transition-colors duration-200 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Mobile menu trigger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* AS Store Brand Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-400 p-[1.5px] shadow-glow">
              <div className="w-full h-full bg-[#0A0F1D] rounded-[10px] flex items-center justify-center font-display font-black text-white text-base tracking-tighter group-hover:scale-105 transition-transform duration-200">
                AS
              </div>
            </div>
            <div className="flex flex-col">
              <span className={`font-display font-black text-lg sm:text-xl tracking-tight leading-none ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                AS STORE
              </span>
              <span className="text-[10px] font-medium tracking-widest uppercase text-blue-500 font-sans mt-0.5">
                Premium Tech
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            <Link
              href="/"
              className={`hover:text-blue-500 transition ${isLight ? 'text-slate-700' : 'text-slate-300'}`}
            >
              Home
            </Link>
            <Link
              href="/products"
              className={`hover:text-blue-500 transition ${isLight ? 'text-slate-700' : 'text-slate-300'}`}
            >
              All Products
            </Link>
            {categories.slice(0, 4).map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className={`hover:text-blue-500 transition whitespace-nowrap ${
                  isLight ? 'text-slate-700' : 'text-slate-300'
                }`}
              >
                {category.name}
              </Link>
            ))}
            <Link
              href="/contact"
              className={`hover:text-blue-500 transition ${isLight ? 'text-slate-700' : 'text-slate-300'}`}
            >
              Contact
            </Link>
          </nav>

          {/* Search bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-xs xl:max-w-sm">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chargers, earbuds, cables..."
                className={`w-full pl-9 pr-4 py-2 text-xs rounded-full border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                  isLight
                    ? 'bg-slate-100 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500'
                    : 'bg-slate-900/80 border-slate-800 text-white placeholder:text-slate-500 focus:bg-slate-900 focus:border-blue-500'
                }`}
              />
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            </form>
          </div>

          {/* Actions: Theme Toggle, Search Icon (Mobile), Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Button (Mobile) */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 md:hidden rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition"
              aria-label="Toggle Theme"
              title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {isLight ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {/* Shopping Cart Trigger */}
            <button
              onClick={openCart}
              className="relative flex items-center gap-2 py-2 px-3 sm:px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold transition-all duration-200 shadow-glow active:scale-95"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {totalItems > 0 && (
                <span className="flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-white text-blue-900 text-xs font-bold">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar Expand (Mobile) */}
        {searchOpen && (
          <div className="md:hidden py-3 border-t border-slate-800 animate-slide-up">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, brands, models..."
                autoFocus
                className={`w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border focus:outline-none focus:border-blue-500 ${
                  isLight
                    ? 'bg-slate-100 border-slate-300 text-slate-900'
                    : 'bg-slate-900 border-slate-800 text-white'
                }`}
              />
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            </form>
          </div>
        )}
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 z-50 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className={`w-3/4 max-w-sm h-full p-6 overflow-y-auto ${
            isLight ? 'bg-white text-slate-900' : 'bg-[#0A0F1D] text-white'
          }`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/50 mb-4">
              <span className="font-display font-bold text-base">Navigation</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold hover:text-blue-500 py-1"
              >
                Home
              </Link>
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold hover:text-blue-500 py-1"
              >
                All Products
              </Link>

              <div className="pt-2">
                <span className="text-xs uppercase tracking-wider text-slate-500 font-bold block mb-2">
                  Categories
                </span>
                <div className="space-y-2 pl-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/products?category=${cat.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-xs font-medium text-slate-400 hover:text-blue-500 py-1"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/50 space-y-2">
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-xs text-slate-400 hover:text-white py-1"
                >
                  About AS Store
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-xs text-slate-400 hover:text-white py-1"
                >
                  Contact & Support
                </Link>
                <Link
                  href="/shipping-policy"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-xs text-slate-400 hover:text-white py-1"
                >
                  Shipping & Delivery
                </Link>
                <Link
                  href="/return-policy"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-xs text-slate-400 hover:text-white py-1"
                >
                  Returns & Warranty
                </Link>
              </div>

              {settings?.whatsapp_number && (
                <div className="pt-4">
                  <a
                    href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
                  >
                    <PhoneCall className="w-4 h-4" />
                    WhatsApp Support
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
