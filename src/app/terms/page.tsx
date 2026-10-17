import type { Metadata } from 'next';
import TopTicker from '@/components/storefront/TopTicker';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import CheckoutModal from '@/components/cart/CheckoutModal';
import WhatsAppFloatingButton from '@/components/storefront/WhatsAppFloatingButton';
import { getSettings, getActiveCategories } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Terms of Service | AS Store',
  description: 'Terms and conditions for shopping at AS Store.',
};

export default async function TermsPage() {
  const [settings, categories] = await Promise.all([
    getSettings(),
    getActiveCategories(),
  ]);

  return (
    <>
      <TopTicker settings={settings} />
      <Navbar categories={categories} settings={settings} />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h1 className="font-display text-2xl sm:text-4xl font-black text-white mb-6">
          Terms of Service
        </h1>

        <div className="space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">1. Orders & Pricing</h2>
            <p>
              By placing an order on AS Store, you confirm that the provided delivery address and mobile contact are accurate. Product prices are listed in Pakistani Rupees (PKR) and include applicable taxes unless otherwise noted.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">2. Order Acceptance</h2>
            <p>
              Orders submitted on AS Store are subject to phone or WhatsApp verification. AS Store reserves the right to cancel or hold any order in the event of inaccurate customer information or stock depletion.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">3. Governing Law</h2>
            <p>
              These terms shall be governed by and construed in accordance with the laws of Pakistan.
            </p>
          </section>
        </div>
      </main>

      <Footer settings={settings} />
      <CartDrawer />
      <CheckoutModal />
      <WhatsAppFloatingButton whatsappNumber={settings?.whatsapp_number ?? null} />
    </>
  );
}
