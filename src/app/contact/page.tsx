import type { Metadata } from 'next';
import Link from 'next/link';
import {
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Truck,
  MessageCircle,
} from 'lucide-react';
import { getSettings, getActiveCategories } from '@/lib/data';
import TopTicker from '@/components/storefront/TopTicker';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';

export const metadata: Metadata = {
  title: 'Contact & Support',
  description: 'Get in touch with AS Store for customer support, order tracking, and product advice across Pakistan.',
};

export default async function ContactPage() {
  const [settings, categories] = await Promise.all([
    getSettings(),
    getActiveCategories(),
  ]);

  const rawPhone = settings?.whatsapp_number || '+92 320 1042634';
  const cleanPhone = rawPhone.replace(/\D/g, '');

  return (
    <>
      <TopTicker settings={settings} />
      <Navbar categories={categories} settings={settings} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
            Support & Inquiries
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-black text-slate-900">
            We&apos;re Here to Help.
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            Have questions about an accessory or need assistance with your existing order? Connect with us directly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Cards */}
          <div className="space-y-4">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">WhatsApp Support</h3>
              <p className="text-xs text-slate-500">Instant responses for order confirmation and questions.</p>
              <a
                href={`https://wa.me/${cleanPhone}?text=Hello%20AS%20Store!%20I%20need%20assistance.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xs font-bold text-emerald-600 hover:underline pt-1"
              >
                {rawPhone} →
              </a>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Email Address</h3>
              <p className="text-xs text-slate-500">For business inquiries, bulk orders, and corporate quotes.</p>
              <a
                href="mailto:support@asstore.pk"
                className="inline-block text-xs font-bold text-blue-600 hover:underline pt-1"
              >
                support@asstore.pk →
              </a>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Operating Hours</h3>
              <p className="text-xs text-slate-500">Monday – Saturday: 10:00 AM – 10:00 PM (PKT)</p>
              <span className="text-[11px] text-slate-400">Sunday: WhatsApp Dispatch Support Only</span>
            </div>
          </div>

          {/* Direct Support Message Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-display font-bold text-lg text-slate-900">
                Instant Order & Dispatch Help
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                For the fastest assistance with an ongoing order, please include your <strong>Order Reference (e.g. AS-XXXX)</strong> and delivery city when messaging on WhatsApp.
              </p>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex items-center gap-2 text-slate-700">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Headquarters: Lahore, Punjab, Pakistan</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Delivery Coverage: All 150+ Pakistani Cities</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Official Warranty Coverage: 7 Days Replacement</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <a
                href={`https://wa.me/${cleanPhone}?text=Hello%20AS%20Store!%20I%20have%20an%20inquiry.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Chat Directly on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer settings={settings} />
    </>
  );
}
