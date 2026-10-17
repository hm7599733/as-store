'use client';

import React from 'react';
import Image from 'next/image';
import {
  BatteryCharging,
  Headphones,
  Zap,
  Cable,
  Watch,
  Speaker,
  Shield,
  LayoutGrid,
} from 'lucide-react';
import type { Category } from '@/types/database';

interface CategoryItem {
  id: string;
  name: string;
  subtitle: string;
  slug: string;
  icon: React.ReactNode;
  imageUrl?: string;
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
  const displayCategories: CategoryItem[] = [
    {
      id: 'power-banks',
      name: 'Power Banks',
      subtitle: 'Fast Charging',
      slug: 'power-banks',
      icon: <BatteryCharging className="w-7 h-7 text-[#06B6D4]" />,
      imageUrl: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=160&auto=format&fit=crop&q=80',
    },
    {
      id: 'airbuds',
      name: 'Airbuds & Audio',
      subtitle: 'Wireless & ENC',
      slug: 'wireless-earbuds',
      icon: <Headphones className="w-7 h-7 text-[#38BDF8]" />,
      imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=160&auto=format&fit=crop&q=80',
    },
    {
      id: 'fast-chargers',
      name: 'Fast Chargers',
      subtitle: 'GaN PD Adapters',
      slug: 'chargers',
      icon: <Zap className="w-7 h-7 text-cyan-400" />,
      imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=160&auto=format&fit=crop&q=80',
    },
    {
      id: 'cables',
      name: 'Charging Cables',
      subtitle: 'Braided Fast Wire',
      slug: 'usb-cables',
      icon: <Cable className="w-7 h-7 text-teal-400" />,
      imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=160&auto=format&fit=crop&q=80',
    },
    {
      id: 'smart-watches',
      name: 'Smart Watches',
      subtitle: 'Fitness & Calling',
      slug: 'smart-watches',
      icon: <Watch className="w-7 h-7 text-blue-400" />,
      imageUrl: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=160&auto=format&fit=crop&q=80',
    },
    {
      id: 'speakers',
      name: 'Speakers',
      subtitle: 'Bluetooth Bass',
      slug: 'bluetooth-speakers',
      icon: <Speaker className="w-7 h-7 text-indigo-400" />,
      imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=160&auto=format&fit=crop&q=80',
    },
    {
      id: 'mobile-covers',
      name: 'Covers & Glass',
      subtitle: 'Drop Protection',
      slug: 'mobile-covers',
      icon: <Shield className="w-7 h-7 text-sky-400" />,
      imageUrl: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=160&auto=format&fit=crop&q=80',
    },
    {
      id: 'all',
      name: 'All Accessories',
      subtitle: 'Complete Catalog',
      slug: 'all',
      icon: <LayoutGrid className="w-7 h-7 text-slate-400" />,
    },
  ];

  return (
    <section className="py-8 bg-[#091124] border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-display text-lg sm:text-xl font-black text-white tracking-tight">
              Shop by Category
            </h3>
            <p className="text-xs text-slate-400">
              Browse top-tier mobile accessories engineered for reliability
            </p>
          </div>
          {selectedCategory && selectedCategory !== 'all' && (
            <button
              onClick={() => onSelectCategory && onSelectCategory('all')}
              className="text-xs font-bold text-[#06B6D4] hover:text-cyan-300 underline cursor-pointer"
            >
              Reset Filter
            </button>
          )}
        </div>

        {/* 8-Card Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-3.5">
          {displayCategories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory && onSelectCategory(cat.slug)}
                className={`group flex flex-col items-center justify-between p-3.5 rounded-2xl transition-all duration-300 text-center cursor-pointer border ${
                  isSelected
                    ? 'bg-[#0F1D3D] border-[#06B6D4] shadow-lg ring-2 ring-[#06B6D4]/40 scale-102'
                    : 'bg-[#0B152E] border-slate-800/80 hover:bg-[#101D3F] hover:border-cyan-800/50 hover:shadow-md hover:-translate-y-0.5'
                }`}
              >
                {/* Image or Icon Container */}
                <div className="relative w-12 h-12 sm:w-13 sm:h-13 flex items-center justify-center my-1">
                  {cat.imageUrl ? (
                    <Image
                      src={cat.imageUrl}
                      alt={cat.name}
                      fill
                      sizes="52px"
                      className="object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {cat.icon}
                    </div>
                  )}
                </div>

                {/* Category Labels */}
                <div className="mt-1">
                  <span
                    className={`block text-xs font-black line-clamp-1 transition ${
                      isSelected
                        ? 'text-[#06B6D4]'
                        : 'text-slate-200 group-hover:text-white'
                    }`}
                  >
                    {cat.name}
                  </span>
                  <span className="block text-[10px] text-slate-400 font-medium line-clamp-1">
                    {cat.subtitle}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
