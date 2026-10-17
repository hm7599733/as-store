'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Search,
  Filter,
  X,
  Sparkles,
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
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter products based on category or search
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category?.name.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== 'all') {
      result = result.filter((p) => {
        if (!p.category) return false;
        const catSlug = p.category.slug?.toLowerCase();
        const catName = p.category.name?.toLowerCase();
        const sel = selectedCategory.toLowerCase();
        return catSlug.includes(sel) || catName.includes(sel) || sel.includes(catSlug);
      });
    }

    return result;
  }, [initialProducts, selectedCategory, searchQuery]);

  return (
    <div id="catalogue" className="bg-[#FAFAFA]">
      {/* 8-Card Modern Category Strip */}
      <ShopByCategoryGrid
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={(slug) => setSelectedCategory(slug)}
      />

      {/* Featured Products Section */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header with Modern Accent */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-slate-200/80 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-[#D97706] text-[11px] font-black uppercase tracking-wider mb-2">
                <Sparkles className="w-3 h-3" />
                <span>Featured Catalogue</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Top Rated Mobile Accessories
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Hand-picked high-performance power banks, fast chargers, and audio gear with instant warranty.
              </p>
            </div>

            <Link
              href="/products"
              className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 transition shadow-2xs self-start sm:self-auto"
            >
              <span>View All Products</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Active Category Filter Tag if selected */}
          {selectedCategory !== 'all' && (
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xs font-semibold text-slate-500">Active Category:</span>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-200 text-amber-900 font-bold text-xs">
                <span>{selectedCategory}</span>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="hover:text-amber-950 p-0.5 rounded-full hover:bg-amber-200/60 cursor-pointer"
                  aria-label="Remove filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            </div>
          )}

          {/* Product Grid: 2-col on mobile, 3-col on sm, 4-col on md, 6-col on lg */}
          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-xs bg-white rounded-3xl border border-slate-200 p-8">
              <p className="text-sm font-semibold text-slate-700">No products found in this selection.</p>
              <div className="mt-4">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="px-5 py-2.5 rounded-full bg-slate-900 text-white font-bold text-xs cursor-pointer hover:bg-slate-800 transition shadow-xs"
                >
                  Show All Products
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
              {filteredProducts.map((product, idx) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  priority={idx < 6}
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
