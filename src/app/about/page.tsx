import type { Metadata } from 'next';
import TopTicker from '@/components/storefront/TopTicker';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import CheckoutModal from '@/components/cart/CheckoutModal';
import WhatsAppFloatingButton from '@/components/storefront/WhatsAppFloatingButton';
import { getSettings, getActiveCategories } from '@/lib/data';
import { ShieldCheck, Truck, Award, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | AS Store',
  description: 'Learn about AS Store — our mission, quality commitment, and premium tech catalogue.',
};

export default async function AboutPage() {
  const [settings, categories] = await Promise.all([
    getSettings(),
    getActiveCategories(),
  ]);

  return (
    <>
      <TopTicker settings={settings} />
      <Navbar categories={categories} settings={settings} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        <div className="text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-500">
            About AS Store
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-black text-white">
            Built for Pure Tech Performance.
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            AS Store was founded with a single mission: to deliver authentic, high-performance mobile accessories and lifestyle gadgets to Pakistani tech enthusiasts without compromise.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-[#0E1526] border border-slate-800 space-y-3">
            <Award className="w-8 h-8 text-blue-400" />
            <h3 className="font-bold text-lg text-white">100% Genuine Tech</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every power bank, GaN charger, cable, and wireless earphone in our catalogue undergoes rigorous voltage, capacity, and durability testing before reaching your hands.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0E1526] border border-slate-800 space-y-3">
            <Truck className="w-8 h-8 text-emerald-400" />
            <h3 className="font-bold text-lg text-white">Nationwide COD</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We partner with trusted courier networks across Pakistan to provide seamless, trackable Cash on Delivery directly to your doorstep in 2 to 4 working days.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0E1526] border border-slate-800 space-y-3">
            <ShieldCheck className="w-8 h-8 text-amber-400" />
            <h3 className="font-bold text-lg text-white">7-Day Easy Warranty</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We stand behind every device we sell. If you experience any manufacturing defect within 7 days of delivery, our support team will replace your item promptly.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0E1526] border border-slate-800 space-y-3">
            <Zap className="w-8 h-8 text-indigo-400" />
            <h3 className="font-bold text-lg text-white">Direct WhatsApp Care</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No automated chatbots or endless queues. Connect directly with our knowledgeable team for product advice, order status, and instant assistance.
            </p>
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
