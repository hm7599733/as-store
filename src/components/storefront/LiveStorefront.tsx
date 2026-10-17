'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  LayoutGrid,
  List,
  Zap,
  CheckCircle2,
  X,
} from 'lucide-react';
import type { Category, Product, Settings } from '@/types/database';
import ProductCard from './ProductCard';
import ShopByCategoryGrid from './ShopByCategoryGrid';

export default function LiveStorefront({
  initialProducts = [],
  categories = [],
  settings,
}: {
  initialProducts: Product[];
  categories: Category[];
  settings: Settings | null;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [dealsOnly, setDealsOnly] = useState(false);
  const [newArrivalsOnly, setNewArrivalsOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc' | 'discount' | 'newest'>('default');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category?.name.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category?.slug === selectedCategory);
    }

    // In Stock Only
    if (inStockOnly) {
      result = result.filter((p) => p.stock_status !== 'out_of_stock');
    }

    // Deals Only
    if (dealsOnly) {
      result = result.filter(
        (p) =>
          p.discount > 0 ||
          (p.old_price && p.old_price > p.price) ||
          p.featured ||
          p.best_seller
      );
    }

    // New Arrivals Only
    if (newArrivalsOnly) {
      result = result.filter((p) => p.new_arrival);
    }

    // Sorting
    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'discount') {
      result.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [initialProducts, searchQuery, selectedCategory, inStockOnly, dealsOnly, newArrivalsOnly, sortBy]);

  return (
    <section id="catalogue" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 scroll-mt-24">
      {/* Category Pills Slider */}
      <ShopByCategoryGrid
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={(slug) => setSelectedCategory(slug)}
      />

      {/* Filter and Control Bar */}
      <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm mb-8 transition-colors">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products in catalogue..."
              className="w-full pl-10 pr-9 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Toggle Filters & Sorting */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Deals Only Toggle */}
            <button
              onClick={() => setDealsOnly(!dealsOnly)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition active:scale-95 ${
                dealsOnly
                  ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span>Deals</span>
            </button>

            {/* In Stock Toggle */}
            <button
              onClick={() => setInStockOnly(!inStockOnly)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition active:scale-95 ${
                inStockOnly
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>In Stock Only</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500 hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort products by"
                className="py-2 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="default">Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="discount">Biggest Discount</option>
                <option value="newest">New Arrivals</option>
              </select>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center border border-slate-200 bg-slate-100 rounded-xl overflow-hidden p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'grid'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                aria-label="Grid view"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'list'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                aria-label="List view"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-xs text-slate-500">
          <span>
            Showing <strong className="text-slate-900 font-bold">{filteredProducts.length}</strong> products
          </span>
          {(searchQuery || selectedCategory !== 'all' || inStockOnly || dealsOnly) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setInStockOnly(false);
                setDealsOnly(false);
              }}
              className="text-blue-600 hover:underline font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Product Grid / Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <Search className="w-7 h-7" />
          </div>
          <h3 className="font-display font-bold text-lg text-slate-900 mb-1">No products match your criteria</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
            Try adjusting your search terms or clearing active filters to browse our full tech catalog.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setInStockOnly(false);
              setDealsOnly(false);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition"
          >
            Show All Products
          </button>
        </div>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6'
              : 'flex flex-col gap-4'
          }
        >
          {filteredProducts.map((product, idx) => (
            <ProductCard key={product.id} product={product} priority={idx < 4} />
          ))}
        </div>
      )}
    </section>
  );
}
