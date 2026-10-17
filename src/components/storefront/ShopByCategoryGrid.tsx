'use client';

import React from 'react';
import Link from 'next/link';
import {
  BatteryCharging,
  Headphones,
  Zap,
  Cable,
  Watch,
  Speaker,
  Smartphone,
  Layers,
} from 'lucide-react';
import type { Category } from '@/types/database';
import { useTheme } from '@/components/theme/ThemeProvider';

function getCategoryIcon(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes('power') || lower.includes('bank')) return <BatteryCharging className="w-5 h-5" />;
  if (lower.includes('earbuds') || lower.includes('audio') || lower.includes('headphone')) return <Headphones className="w-5 h-5" />;
  if (lower.includes('charger')) return <Zap className="w-5 h-5" />;
  if (lower.includes('cable')) return <Cable className="w-5 h-5" />;
  if (lower.includes('watch')) return <Watch className="w-5 h-5" />;
  if (lower.includes('speaker')) return <Speaker className="w-5 h-5" />;
  if (lower.includes('cover')) return <Smartphone className="w-5 h-5" />;
  return <Layers className="w-5 h-5" />;
}

export default function ShopByCategoryGrid({
  categories = [],
  selectedCategory,
  onSelectCategory,
}: {
  categories: Category[];
  selectedCategory?: string;
  onSelectCategory?: (slug: string) => void;
}) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className={`font-display text-lg sm:text-xl font-black ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            Browse By Category
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Explore tested accessories for every device</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-2">
        <button
          onClick={() => onSelectCategory && onSelectCategory('all')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 active:scale-95 ${
            selectedCategory === 'all' || !selectedCategory
              ? 'bg-blue-600 text-white shadow-glow'
              : isLight
              ? 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
              : 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>All Items</span>
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.slug;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory && onSelectCategory(cat.slug)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 active:scale-95 ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-glow'
                  : isLight
                  ? 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <span className={isSelected ? 'text-white' : 'text-blue-400'}>
                {getCategoryIcon(cat.name)}
              </span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
