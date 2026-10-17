import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import TopTicker from '@/components/storefront/TopTicker';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import CheckoutModal from '@/components/cart/CheckoutModal';
import WhatsAppFloatingButton from '@/components/storefront/WhatsAppFloatingButton';
import ProductDetailClient from '@/components/product/ProductDetailClient';
import {
  getProductBySlug,
  getRelatedProducts,
  getSettings,
  getActiveCategories,
} from '@/lib/data';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found | AS Store',
      description: 'The requested product could not be found on AS Store.',
    };
  }

  const primaryImage =
    product.product_images?.find((img) => img.is_primary)?.image_url ||
    product.product_images?.[0]?.image_url;

  return {
    title: `${product.name} | AS Store Pakistan`,
    description:
      product.short_description ||
      `Buy ${product.name} online at the best price in Pakistan from AS Store. Fast cash on delivery.`,
    openGraph: {
      title: `${product.name} | AS Store`,
      description:
        product.short_description ||
        `Buy ${product.name} online at best price in Pakistan from AS Store.`,
      images: primaryImage ? [{ url: primaryImage }] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const [product, settings, categories] = await Promise.all([
    getProductBySlug(slug),
    getSettings(),
    getActiveCategories(),
  ]);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.category_id, product.id, 4);

  return (
    <>
      <TopTicker settings={settings} />
      <Navbar categories={categories} settings={settings} />

      <main className="min-h-screen">
        <ProductDetailClient
          product={product}
          relatedProducts={relatedProducts}
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
