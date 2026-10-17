import type { Metadata } from 'next';
import TopTicker from '@/components/storefront/TopTicker';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import CheckoutModal from '@/components/cart/CheckoutModal';
import WhatsAppFloatingButton from '@/components/storefront/WhatsAppFloatingButton';
import { getSettings, getActiveCategories } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Return & Warranty Policy | AS Store',
  description: 'Understand the 7-day replacement warranty and return policy at AS Store.',
};

export default async function ReturnPolicyPage() {
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
          Return & Replacement Warranty Policy
        </h1>

        <div className="space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">1. 7-Day Replacement Guarantee</h2>
            <p>
              At AS Store, every customer is protected by our comprehensive 7-day replacement warranty. If your gadget arrives damaged, defective, or fails to function as advertised within 7 days of receiving the parcel, you are eligible for a replacement.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">2. Eligibility Conditions</h2>
            <ul className="list-disc list-inside space-y-1 text-slate-400 pl-2">
              <li>The claim must be initiated within 7 days from the delivery date.</li>
              <li>The item must be in its original packaging with all included accessories and manuals.</li>
              <li>Defects must be manufacturing issues. Physical damage, water ingress, or improper usage void the warranty.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">3. How to Claim</h2>
            <p>
              Simply record a short video demonstrating the issue and send it to our official WhatsApp support along with your order reference number (e.g. <strong>AS-XXXX</strong>). Our support agent will inspect and process your replacement within 24 to 48 hours.
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
