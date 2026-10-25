import { NextRequest, NextResponse } from 'next/server';
import { getAllActiveProducts, getActiveCategories } from '@/lib/data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case "'":
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return c;
    }
  });
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  try {
    return new Date(dateStr).toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

export async function GET(request: NextRequest) {
  // Dynamically resolve base URL matching the exact host requested
  const forwardedHost = request.headers.get('x-forwarded-host');
  const host = forwardedHost || request.headers.get('host') || 'as-store-seven.vercel.app';
  const proto = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
  const baseUrl = `${proto}://${host}`.replace(/\/+$/, '');

  const today = new Date().toISOString().split('T')[0];

  // 1. Static Core Storefront Routes
  const staticUrls = [
    { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'daily', lastmod: today },
    { loc: `${baseUrl}/products`, priority: '0.9', changefreq: 'daily', lastmod: today },
    { loc: `${baseUrl}/about`, priority: '0.7', changefreq: 'monthly', lastmod: today },
    { loc: `${baseUrl}/contact`, priority: '0.7', changefreq: 'monthly', lastmod: today },
    { loc: `${baseUrl}/shipping-policy`, priority: '0.5', changefreq: 'monthly', lastmod: today },
    { loc: `${baseUrl}/return-policy`, priority: '0.5', changefreq: 'monthly', lastmod: today },
    { loc: `${baseUrl}/privacy-policy`, priority: '0.5', changefreq: 'monthly', lastmod: today },
    { loc: `${baseUrl}/terms`, priority: '0.5', changefreq: 'monthly', lastmod: today },
  ];

  // 2. Dynamic Categories
  let categoryUrls: Array<{ loc: string; priority: string; changefreq: string; lastmod: string }> = [];
  try {
    const categories = await getActiveCategories();
    categoryUrls = categories
      .filter((c) => Boolean(c.slug))
      .map((c) => ({
        loc: `${baseUrl}/products?category=${encodeURIComponent(c.slug)}`,
        priority: '0.8',
        changefreq: 'weekly',
        lastmod: today,
      }));
  } catch {}

  // 3. Dynamic Products
  let productUrls: Array<{ loc: string; priority: string; changefreq: string; lastmod: string }> = [];
  try {
    const products = await getAllActiveProducts(200);
    productUrls = products
      .filter((p) => Boolean(p.slug))
      .map((p) => ({
        loc: `${baseUrl}/products/${encodeURIComponent(p.slug)}`,
        priority: '0.85',
        changefreq: 'daily',
        lastmod: formatDate(p.updated_at || p.created_at),
      }));
  } catch {}

  const allUrls = [...staticUrls, ...categoryUrls, ...productUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (item) => `  <url>
    <loc>${escapeXml(item.loc)}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=1800, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
