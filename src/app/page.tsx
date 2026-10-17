import type { Metadata } from 'next';
import TopTicker from '@/components/storefront/TopTicker';
import Navbar from '@/components/storefront/Navbar';
import Hero from '@/components/storefront/Hero';
import LiveStorefront from '@/components/storefront/LiveStorefront';
import Footer from '@/components/storefront/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import CheckoutModal from '@/components/cart/CheckoutModal';
import WhatsAppFloatingButton from '@/components/storefront/WhatsAppFloatingButton';
import { getSettings, getActiveCategories, getAllActiveProducts } from '@/lib/data';

export const revalidate = 60;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.asstore.pk';

export const metadata: Metadata = {
  title: 'AS Store | Premium Mobile Accessories & Tech Gadgets in Pakistan',
  description:
    'Shop premium mobile accessories and tech gadgets at AS Store Pakistan. Best prices on high-capacity power banks, fast chargers, USB-C cables, wireless earbuds, Bluetooth speakers & more. Fast cash on delivery.',
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: 'AS Store | Premium Mobile Accessories & Tech Gadgets in Pakistan',
    description:
      'Shop premium mobile accessories and tech gadgets at AS Store Pakistan. Best prices on power banks, fast chargers, cables, earbuds & more.',
    url: siteUrl,
    type: 'website',
  },
};

export default async function HomePage() {
  const [settings, categories, products] = await Promise.all([
    getSettings(),
    getActiveCategories(),
    getAllActiveProducts(48),
  ]);

  return (
    <>
      <Navbar categories={categories} settings={settings} />

      <main>
        <Hero />
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
