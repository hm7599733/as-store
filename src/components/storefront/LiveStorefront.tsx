'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Search,
  Filter,
  X,
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
    <div id="catalogue" className="bg-white">
      {/* 8-Card Horizontal Category Strip (Mockup exact) */}
      <ShopByCategoryGrid
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={(slug) => setSelectedCategory(slug)}
      />

      {/* Featured Products Section */}
      <section className="py-6 sm:py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header with stylized yellow underline (Mockup exact) */}
          <div className="flex items-end justify-between mb-6 pb-2 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight relative">
                  <span className="relative z-10">Featured</span>
                  <span className="absolute bottom-1 left-0 w-full h-2.5 bg-[#F59E0B]/60 -z-0 rounded-xs" />
                  {' '}Products
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Hand-picked best-selling gadgets with official warranty and instant dispatch.
              </p>
            </div>

            <Link
              href="/products"
              className="group inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#F59E0B] transition"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Active Category Filter Tag if selected */}
          {selectedCategory !== 'all' && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-slate-500">Filtering by:</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs">
                <span>{selectedCategory}</span>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="hover:text-black cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            </div>
          )}

          {/* Product Grid: 6 Columns on Desktop (Mockup exact) */}
          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-xs">
              No products found in this category. Showing all products instead...
              <div className="mt-3">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
                >
                  Reset Filter
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

      {/* 3-Column Promotional Banners (Mockup exact) */}
      <PromoBanners />
    </div>
  );
}
