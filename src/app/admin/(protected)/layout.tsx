'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Tag,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import AdminNotificationBell from '@/components/admin/AdminNotificationBell';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/admin/login');
      } else {
        setAuthLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace('/admin/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const navLinks = [
    { label: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Orders & Dispatches', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Product Catalogue', href: '/admin/products', icon: Package },
    { label: 'Coupons & Vouchers', href: '/admin/coupons', icon: Tag },
    { label: 'Store Settings', href: '/admin/settings', icon: Settings },
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 text-xs">
        <div className="flex items-center gap-3 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
          <span className="font-semibold text-slate-800">Verifying Admin Session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center font-black text-white text-xs shadow-xs">
            AS
          </div>
          <div>
            <span className="font-display font-black text-sm text-slate-900 block leading-tight">AS Store</span>
            <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">Admin Panel</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <AdminNotificationBell />
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            aria-label="Toggle Navigation"
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Modern Executive Sidebar */}
      <aside
        className={`${
          mobileNavOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-white border-r border-slate-200 p-5 flex flex-col justify-between shrink-0 shadow-xs z-30`}
      >
        <div className="space-y-6">
          {/* Brand Logo Header */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center font-display font-black text-white text-base shadow-sm ring-1 ring-slate-850">
              AS
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-display font-black text-sm tracking-tight text-slate-950">AS STORE</h2>
                <span className="px-1.5 py-0.2 rounded-md bg-amber-100 text-[#B45309] text-[9px] font-black uppercase">PRO</span>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold block">
                Executive Portal
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <div className="px-3 py-1.5 text-[10px] uppercase font-black tracking-wider text-slate-400">
              Management
            </div>
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#F59E0B]' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-slate-200/90 space-y-2">
          {/* View Live Storefront */}
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition border border-slate-200/70 shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
              <span>Customer Store</span>
            </div>
            <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </Link>

          {/* Admin Profile & Sign Out */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black shrink-0">
                A
              </div>
              <div className="truncate">
                <span className="text-[11px] font-bold text-slate-900 block truncate leading-tight">Admin Manager</span>
                <span className="text-[9px] text-slate-400 block truncate">admin@asstore.pk</span>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition shrink-0"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Modern Top Desktop Header */}
        <header className="hidden md:flex items-center justify-between px-8 py-3.5 bg-white border-b border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Location:</span>
            <span className="text-xs font-black text-slate-900 capitalize">
              {pathname.split('/')[2] || 'Dashboard Overview'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Direct Storefront Link */}
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
              <span>Preview Storefront</span>
            </Link>

            {/* Notification Bell */}
            <AdminNotificationBell />

            {/* Verified Security Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>System Online</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
