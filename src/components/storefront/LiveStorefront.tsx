'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Sparkles,
  Zap,
  Tag,
  CheckCircle2,
  X,
} from 'lucide-react';
import type { Category, Product, Settings } from '@/types/database';
import ProductCard from './ProductCard';
import ShopByCategoryGrid from './ShopByCategoryGrid';
import { useTheme } from '@/components/theme/ThemeProvider';

export default function LiveStorefront({
  initialProducts = [],
  categories = [],
  settings,
}: {
  initialProducts: Product[];
  categories: Category[];
  settings: Settings | null;
}) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

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
      <div className={`p-4 rounded-2xl border mb-8 transition-colors ${
        isLight
          ? 'bg-white border-slate-200/90 shadow-subtle'
          : 'bg-[#0E1526] border-slate-800/80 shadow-md'
      }`}>
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products in catalogue..."
              className={`w-full pl-10 pr-9 py-2.5 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                isLight
                  ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-blue-500'
                  : 'bg-slate-900 border-slate-800 text-white focus:bg-slate-950 focus:border-blue-500'
              }`}
            />
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-white"
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
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Deals</span>
            </button>

            {/* In Stock Toggle */}
            <button
              onClick={() => setInStockOnly(!inStockOnly)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition active:scale-95 ${
                inStockOnly
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>In Stock Only</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400 hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort products by"
                className={`py-2 px-3 text-xs rounded-xl border focus:outline-none focus:border-blue-500 cursor-pointer ${
                  isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-900'
                    : 'bg-slate-900 border-slate-800 text-white'
                }`}
              >
                <option value="default">Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="discount">Biggest Discount</option>
                <option value="newest">New Arrivals</option>
              </select>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center border border-slate-800 rounded-xl overflow-hidden p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
                aria-label="Grid view"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
                aria-label="List view"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/40 text-xs text-slate-400">
          <span>
            Showing <strong className={isLight ? 'text-slate-900' : 'text-white'}>{filteredProducts.length}</strong> products
          </span>
          {(selectedCategory !== 'all' || inStockOnly || dealsOnly || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setInStockOnly(false);
                setDealsOnly(false);
                setSearchQuery('');
              }}
              className="text-blue-500 hover:underline font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Products Grid / List */}
      {filteredProducts.length > 0 ? (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6'
              : 'flex flex-col gap-4'
          }
        >
          {filteredProducts.map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={idx < 4}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-slate-800 max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-900 flex items-center justify-center text-slate-500">
            <Search className="w-8 h-8" />
          </div>
          <h3 className={`font-display text-lg font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            No products match your criteria
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            Try adjusting your search terms or clearing active filters to browse the full catalogue.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setInStockOnly(false);
              setDealsOnly(false);
              setSearchQuery('');
            }}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-glow"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </section>
  );
}
