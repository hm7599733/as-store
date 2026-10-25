'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  Bell,
  Search,
  Sparkles,
  ChevronRight,
  TrendingUp,
  MessageCircle,
  FolderTree,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import AdminNotificationBell from '@/components/admin/AdminNotificationBell';
import AdminSuperAlertProvider from '@/components/admin/AdminSuperAlertProvider';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  React.useEffect(() => {
    const hasLocalAdmin = typeof window !== 'undefined' && localStorage.getItem('as_admin_logged_in') === 'true';

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session && !hasLocalAdmin) {
        router.replace('/admin/login');
      } else {
        setAuthLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const stillLocal = typeof window !== 'undefined' && localStorage.getItem('as_admin_logged_in') === 'true';
      if (!session && !stillLocal) {
        router.replace('/admin/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
    } catch (_) {}
    if (typeof window !== 'undefined') {
      localStorage.removeItem('as_admin_logged_in');
      document.cookie = 'as_admin_auth=; path=/; max-age=0';
    }
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const navGroups = [
    {
      group: 'Analytics & Orders',
      items: [
        { label: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'Orders & Fulfillment', href: '/admin/orders', icon: ShoppingBag },
        { label: 'WhatsApp Center', href: '/admin/whatsapp', icon: MessageCircle },
      ],
    },
    {
      group: 'Catalogue Management',
      items: [
        { label: 'Products & Inventory', href: '/admin/products', icon: Package },
        { label: 'Categories & Hierarchy', href: '/admin/categories', icon: FolderTree },
        { label: 'Coupons & Vouchers', href: '/admin/coupons', icon: Tag },
      ],
    },
    {
      group: 'Store Administration',
      items: [
        { label: 'Settings & Shipping', href: '/admin/settings', icon: Settings },
      ],
    },
  ];

  const currentSectionName = () => {
    const segment = pathname.split('/')[2];
    if (segment === 'orders') return 'Orders & Fulfillment';
    if (segment === 'whatsapp') return 'WhatsApp Outreach Center';
    if (segment === 'products') return 'Products & Inventory';
    if (segment === 'categories') return 'Category Management';
    if (segment === 'coupons') return 'Coupons & Vouchers';
    if (segment === 'settings') return 'Settings & Operations';
    return 'Dashboard Overview';
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 text-xs">
        <div className="flex items-center gap-3 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <span className="font-semibold text-slate-800">Verifying Admin Session...</span>
        </div>
      </div>
    );
  }

  return (
    <AdminSuperAlertProvider>
      <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col md:flex-row font-sans">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#0B132B] text-white border-b border-slate-800 shadow-2xs">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5">
          <div className="relative h-9 w-16 flex items-center justify-center">
            <Image
              src="/images/as-store-logo.png"
              alt="AS Gadgets"
              width={893}
              height={507}
              className="h-full w-auto object-contain"
            />
          </div>
          <div>
            <span className="font-display font-black text-sm text-white block leading-tight">AS GADGETS</span>
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Admin Suite</span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <AdminNotificationBell />
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
            aria-label="Toggle Navigation"
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* International Standard Executive Sidebar */}
      <aside
        className={`${
          mobileNavOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-white border-r border-slate-200/90 p-5 flex flex-col justify-between shrink-0 shadow-xs z-30`}
      >
        <div className="space-y-6">
          {/* Brand Logo Header */}
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-1 group">
            <div className="relative h-11 w-16 p-1 rounded-xl bg-[#060C1B] border border-cyan-900/40 flex items-center justify-center shadow-xs">
              <Image
                src="/images/as-store-logo.png"
                alt="AS Gadgets"
                width={893}
                height={507}
                className="h-full w-auto object-contain group-hover:scale-105 transition-transform"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-display font-black text-sm tracking-tight text-slate-950">AS GADGETS</h2>
                <span className="px-1.5 py-0.2 rounded-md bg-cyan-50 text-cyan-700 border border-cyan-200 text-[9px] font-black uppercase">PRO</span>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold block">
                Mobile & Smart Tech
              </span>
            </div>
          </Link>

          {/* Grouped Navigation Links */}
          <nav className="space-y-5">
            {navGroups.map((group) => (
              <div key={group.group} className="space-y-1">
                <div className="px-3 py-1 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  {group.group}
                </div>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname?.startsWith(`${item.href}`));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileNavOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                        isActive
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/80'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[#06B6D4]' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Actions & User Profile */}
        <div className="pt-6 border-t border-slate-200/90 space-y-2.5">
          {/* Customer Storefront Link */}
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition border border-slate-200/80 shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-[#06B6D4]" />
              <span>Customer Storefront</span>
            </div>
            <span className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </Link>

          {/* Admin Profile & Sign Out */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-slate-900 text-[#06B6D4] flex items-center justify-center text-xs font-black shrink-0">
                A
              </div>
              <div className="truncate">
                <span className="text-[11px] font-bold text-slate-900 block truncate leading-tight">Admin (Abdullah)</span>
                <span className="text-[9px] text-slate-400 block truncate">admin@asstore.pk</span>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition shrink-0 cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Desktop Bar (Shopify / Stripe Standard) */}
        <header className="hidden md:flex items-center justify-between px-8 py-3.5 bg-white border-b border-slate-200/90 shadow-2xs">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-400">Admin</span>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className="font-black text-slate-900">
              {currentSectionName()}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* System Online Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Production Live</span>
            </div>

            {/* Notification Bell */}
            <AdminNotificationBell />

            {/* Direct Storefront link */}
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#06B6D4]" />
              <span>Preview Store</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  </AdminSuperAlertProvider>
);
}
