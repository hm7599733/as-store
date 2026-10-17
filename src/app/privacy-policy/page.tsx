import type { Metadata } from 'next';
import TopTicker from '@/components/storefront/TopTicker';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import CheckoutModal from '@/components/cart/CheckoutModal';
import WhatsAppFloatingButton from '@/components/storefront/WhatsAppFloatingButton';
import { getSettings, getActiveCategories } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Privacy Policy | AS Store',
  description: 'How AS Store protects and respects customer information.',
};

export default async function PrivacyPolicyPage() {
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
          Privacy Policy
        </h1>

        <div className="space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">1. Data Collection</h2>
            <p>
              AS Store collects necessary contact information — including customer name, WhatsApp phone number, city, and delivery street address — solely for fulfilling orders, dispatching shipments, and providing customer care.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">2. Confidentiality & Third Parties</h2>
            <p>
              We do not sell, rent, or trade your personal data with third-party advertising companies. Your details are strictly shared with designated courier partners (such as Leopard Courier, TCS) exclusively for package delivery.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">3. Security</h2>
            <p>
              All communications and database records are safeguarded through industry-standard encryption protocols.
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
