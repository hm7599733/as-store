import type { MetadataRoute } from 'next';
import { getAllActiveProducts, getActiveCategories } from '@/lib/data';

export const revalidate = 3600; // Revalidate sitemap every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rawBase =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : null) ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
    'https://as-store-seven.vercel.app';

  const baseUrl = rawBase.replace(/\/+$/, '');
  const now = new Date();

  // 1. Core Static Storefront Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/shipping-policy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/return-policy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // 2. Dynamic Categories
  let categoryRoutes: MetadataRoute.Sitemap = [];
  try {
    const categories = await getActiveCategories();
    categoryRoutes = categories
      .filter((cat) => Boolean(cat.slug))
      .map((cat) => ({
        url: `${baseUrl}/products?category=${encodeURIComponent(cat.slug)}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
  } catch (e) {
    console.error('Error generating category sitemap entries:', e);
  }

  // 3. Dynamic Products
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await getAllActiveProducts(200);
    productRoutes = products
      .filter((prod) => Boolean(prod.slug))
      .map((prod) => ({
        url: `${baseUrl}/products/${encodeURIComponent(prod.slug)}`,
        lastModified: prod.updated_at ? new Date(prod.updated_at) : (prod.created_at ? new Date(prod.created_at) : now),
        changeFrequency: 'daily' as const,
        priority: 0.85,
      }));
  } catch (e) {
    console.error('Error generating product sitemap entries:', e);
  }

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
