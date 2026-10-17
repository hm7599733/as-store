import type { Metadata } from 'next';
import TopTicker from '@/components/storefront/TopTicker';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import CheckoutModal from '@/components/cart/CheckoutModal';
import WhatsAppFloatingButton from '@/components/storefront/WhatsAppFloatingButton';
import { getSettings, getActiveCategories } from '@/lib/data';
import { formatPrice } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Shipping & Delivery Policy | AS Store',
  description: 'Learn about AS Store shipping timelines, delivery charges, and Cash on Delivery across Pakistan.',
};

export default async function ShippingPolicyPage() {
  const [settings, categories] = await Promise.all([
    getSettings(),
    getActiveCategories(),
  ]);

  const deliveryFee = settings?.delivery_charges ?? 200;
  const freeThreshold = settings?.free_shipping_threshold ?? 3000;

  return (
    <>
      <TopTicker settings={settings} />
      <Navbar categories={categories} settings={settings} />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h1 className="font-display text-2xl sm:text-4xl font-black text-white mb-6">
          Shipping & Delivery Policy
        </h1>

        <div className="space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">1. Nationwide Delivery in Pakistan</h2>
            <p>
              AS Store ships across all major cities, towns, and regions in Pakistan. We partner with reliable courier services including Leopard Courier, TCS, and Trax to guarantee fast and secure parcel handling.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">2. Delivery Charges & Free Shipping</h2>
            <p>
              Standard nationwide delivery charges are <strong>{formatPrice(deliveryFee)}</strong> per order.
            </p>
            <p className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-300">
              Orders with a subtotal of <strong>{formatPrice(freeThreshold)}</strong> or more automatically qualify for <strong>FREE DELIVERY</strong> anywhere in Pakistan.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">3. Dispatch & Delivery Timelines</h2>
            <ul className="list-disc list-inside space-y-1 text-slate-400 pl-2">
              <li><strong>Order Processing:</strong> Orders are verified via WhatsApp and packed within 24 hours of placement.</li>
              <li><strong>Major Metros (Lahore, Karachi, Islamabad, Rawalpindi):</strong> 1 to 3 working days.</li>
              <li><strong>Other Cities & Remote Districts:</strong> 2 to 4 working days.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">4. Cash on Delivery (COD)</h2>
            <p>
              Cash on Delivery is available for all standard orders. Please have the exact payable amount ready in cash when the delivery courier arrives at your location.
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
