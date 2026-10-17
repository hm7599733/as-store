import type { Metadata } from 'next';
import TopTicker from '@/components/storefront/TopTicker';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import LiveStorefront from '@/components/storefront/LiveStorefront';
import CartDrawer from '@/components/cart/CartDrawer';
import CheckoutModal from '@/components/cart/CheckoutModal';
import WhatsAppFloatingButton from '@/components/storefront/WhatsAppFloatingButton';
import { getAllActiveProducts, getActiveCategories, getSettings } from '@/lib/data';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'All Products | AS Store Pakistan',
  description:
    'Browse our full collection of power banks, fast chargers, wireless earbuds, smart watches, and phone accessories at AS Store.',
};

export default async function ProductsCatalogPage() {
  const [products, categories, settings] = await Promise.all([
    getAllActiveProducts(100),
    getActiveCategories(),
    getSettings(),
  ]);

  return (
    <>
      <TopTicker settings={settings} />
      <Navbar categories={categories} settings={settings} />

      <main className="min-h-screen py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <h1 className="font-display text-2xl sm:text-4xl font-black text-white">
            All Products
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse genuine mobile accessories and gadgets with nationwide cash on delivery.
          </p>
        </div>

        <LiveStorefront
          initialProducts={products}
          categories={categories}
          settings={settings}
        />
      </main>

      <Footer settings={settings} />
      <CartDrawer />
      <CheckoutModal />
      <WhatsAppFloatingButton whatsappNumber={settings?.whatsapp_number ?? null} />
    </>
  );
}
