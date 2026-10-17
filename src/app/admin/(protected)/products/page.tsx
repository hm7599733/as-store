import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, Tag } from 'lucide-react';
import { createServiceClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types/database';

export const revalidate = 0;

export default async function AdminProductsPage() {
  const supabase = createServiceClient();

  const { data: products } = await supabase
    .from('products')
    .select('id, name, slug, price, old_price, stock_status, active, category:categories(name), product_images(image_url, is_primary)')
    .order('created_at', { ascending: false });

  const typedProducts = (products as unknown as Product[]) || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-black text-white">
          Product Catalogue
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review stock availability, pricing, and active listings for AS Store.
        </p>
      </div>

      <div className="rounded-3xl bg-[#0E1526] border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/60 text-slate-400 border-b border-slate-800 font-bold">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock Status</th>
                <th className="p-4">Listing</th>
                <th className="p-4 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {typedProducts.map((prod) => {
                const img =
                  prod.product_images?.find((i) => i.is_primary)?.image_url ||
                  prod.product_images?.[0]?.image_url ||
                  '/images/product-placeholder.png';

                return (
                  <tr key={prod.id} className="hover:bg-slate-900/40 transition">
                    <td className="p-4 flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg bg-slate-950/60 border border-slate-800 overflow-hidden shrink-0">
                        <Image
                          src={img}
                          alt={prod.name}
                          fill
                          sizes="40px"
                          className="object-contain p-1"
                        />
                      </div>
                      <span className="font-bold text-white max-w-xs line-clamp-1">
                        {prod.name}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">
                      {prod.category?.name || 'Accessories'}
                    </td>
                    <td className="p-4 font-bold text-blue-400 font-display">
                      {formatPrice(prod.price)}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        prod.stock_status === 'in_stock'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {prod.stock_status === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        prod.active ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700 text-slate-400'
                      }`}>
                        {prod.active ? 'Active' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/products/${prod.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
