'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Search,
  Filter,
  X,
  Sparkles,
  Loader2,
} from 'lucide-react';
import type { Category, Product, Settings } from '@/types/database';
import ProductCard from './ProductCard';
import ShopByCategoryGrid from './ShopByCategoryGrid';
import PromoBanners from './PromoBanners';

export default function LiveStorefront({
  initialProducts = [],
  categories = [],
  settings,
}: {
  initialProducts: Product[];
  categories: Category[];
  settings: Settings | null;
}) {
  const [productsList, setProductsList] = useState<Product[]>(initialProducts);
  const [isLoadingRecovery, setIsLoadingRecovery] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fallback client recovery if initialProducts is empty (e.g. edge cold start on Vercel)
  useEffect(() => {
    if (!initialProducts || initialProducts.length === 0) {
      setIsLoadingRecovery(true);
      fetch('/api/products')
        .then((res) => res.json())
        .then((data) => {
          if (data && data.products && data.products.length > 0) {
            setProductsList(data.products);
          }
        })
        .catch((err) => {
          console.error('Failed to load products from /api/products:', err);
        })
        .finally(() => {
          setIsLoadingRecovery(false);
        });
    } else {
      setProductsList(initialProducts);
    }
  }, [initialProducts]);

  // Filter products based on category or search
  const filteredProducts = useMemo(() => {
    let result = [...productsList];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category?.name?.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== 'all') {
      result = result.filter((p) => {
        if (!p.category) return false;
        const catSlug = p.category.slug?.toLowerCase();
        const catName = p.category.name?.toLowerCase();
        const sel = selectedCategory.toLowerCase();
        return (catSlug && catSlug.includes(sel)) || (catName && catName.includes(sel)) || (catSlug && sel.includes(catSlug));
      });
    }

    return result;
  }, [productsList, selectedCategory, searchQuery]);

  return (
    <div id="catalogue" className="bg-[#070D1E]">
      {/* 8-Card Modern Category Strip */}
      <ShopByCategoryGrid
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={(slug) => setSelectedCategory(slug)}
      />

      {/* Featured Products Section — Exactly 5 Cards per row on Desktop */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header with Cyber Cyan Accent */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-slate-800/80 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800/50 text-[#06B6D4] text-[11px] font-black uppercase tracking-wider mb-2">
                <Sparkles className="w-3 h-3" />
                <span>Featured Catalogue</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
                Top Rated Mobile <span className="text-[#06B6D4]">Accessories</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Hand-picked high-performance power banks, fast chargers, and audio gear with instant warranty.
              </p>
            </div>

            <Link
              href="/products"
              className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0B152E] hover:bg-[#101D3F] border border-cyan-900/50 text-xs font-bold text-cyan-300 transition shadow-xs self-start sm:self-auto"
            >
              <span>View All Products</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Active Category Filter Tag if selected */}
          {selectedCategory !== 'all' && (
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xs font-semibold text-slate-400">Active Category:</span>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-700/60 text-[#06B6D4] font-bold text-xs">
                <span>{selectedCategory}</span>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="hover:text-white p-0.5 rounded-full hover:bg-cyan-900 cursor-pointer"
                  aria-label="Remove filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            </div>
          )}

          {/* Product Grid: EXACTLY 5 Columns on Desktop (lg:grid-cols-5) */}
          {isLoadingRecovery ? (
            <div className="py-20 text-center flex flex-col items-center justify-center bg-[#0B152E] rounded-3xl border border-slate-800 p-8">
              <Loader2 className="w-8 h-8 text-[#06B6D4] animate-spin mb-3" />
              <p className="text-sm font-semibold text-white">Loading AS Gadgets Catalogue...</p>
              <p className="text-xs text-slate-400 mt-1">Connecting to live inventory</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-xs bg-[#0B152E] rounded-3xl border border-slate-800 p-8">
              <p className="text-sm font-semibold text-white">No products found in this selection.</p>
              <div className="mt-4">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="px-5 py-2.5 rounded-full bg-[#06B6D4] text-slate-950 font-bold text-xs cursor-pointer hover:bg-cyan-300 transition shadow-xs"
                >
                  Show All Products
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
              {filteredProducts.map((product, idx) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  priority={idx < 5}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bento-Box Promotional Feature Banners */}
      <PromoBanners />
    </div>
  );
}
