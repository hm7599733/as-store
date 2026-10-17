import type { Metadata } from 'next';
import TopTicker from '@/components/storefront/TopTicker';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import CheckoutModal from '@/components/cart/CheckoutModal';
import WhatsAppFloatingButton from '@/components/storefront/WhatsAppFloatingButton';
import { getSettings, getActiveCategories } from '@/lib/data';
import { PhoneCall, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us | AS Store',
  description: 'Get in touch with AS Store for customer support, order status, and WhatsApp assistance.',
};

export default async function ContactPage() {
  const [settings, categories] = await Promise.all([
    getSettings(),
    getActiveCategories(),
  ]);

  const rawPhone = settings?.whatsapp_number || '+92 348 9593671';
  const cleanPhone = rawPhone.replace(/\D/g, '');

  return (
    <>
      <TopTicker settings={settings} />
      <Navbar categories={categories} settings={settings} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-500">
            Support & Inquiries
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-black text-white">
            We&apos;re Here to Help.
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Have questions about an accessory or need assistance with your existing order? Connect with us directly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Cards */}
          <div className="space-y-4">
            <div className="p-6 rounded-3xl bg-[#0E1526] border border-slate-800 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-white">WhatsApp Support</h3>
              <p className="text-xs text-slate-400">Instant responses for order confirmation and questions.</p>
              <a
                href={`https://wa.me/${cleanPhone}?text=Hello%20AS%20Store!%20I%20need%20assistance.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xs font-bold text-emerald-400 hover:underline pt-1"
              >
                {rawPhone} →
              </a>
            </div>

            <div className="p-6 rounded-3xl bg-[#0E1526] border border-slate-800 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-2">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-white">Email Address</h3>
              <p className="text-xs text-slate-400">For business inquiries, bulk orders, and corporate quotes.</p>
              <a
                href="mailto:support@asstore.pk"
                className="inline-block text-xs font-bold text-blue-400 hover:underline pt-1"
              >
                support@asstore.pk →
              </a>
            </div>

            <div className="p-6 rounded-3xl bg-[#0E1526] border border-slate-800 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-white">Operating Hours</h3>
              <p className="text-xs text-slate-400">Monday – Saturday: 10:00 AM – 10:00 PM (PKT)</p>
              <span className="text-[11px] text-slate-500">Sunday: WhatsApp Dispatch Support Only</span>
            </div>
          </div>

          {/* Direct Support Message Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0E1526] border border-slate-800 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-display font-bold text-lg text-white">
                Instant Order & Dispatch Help
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                For the fastest assistance with an ongoing order, please include your <strong>Order Reference (e.g. AS-XXXX)</strong> and delivery city when messaging on WhatsApp.
              </p>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs space-y-2">
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Headquarters: Lahore, Punjab, Pakistan</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Support Hotline: {rawPhone}</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <a
                href={`https://wa.me/${cleanPhone}?text=Hello%20AS%20Store!%20I%20have%20an%20order%20inquiry.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-glow-emerald"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Open WhatsApp Support</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer settings={settings} />
      <CartDrawer />
      <CheckoutModal />
      <WhatsAppFloatingButton whatsappNumber={settings?.whatsapp_number ?? null} />
    </>
  );
}
