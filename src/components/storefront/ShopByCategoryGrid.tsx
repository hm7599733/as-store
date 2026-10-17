'use client';

import React from 'react';
import Image from 'next/image';
import {
  Smartphone,
  Laptop,
  Watch,
  Headphones,
  Zap,
  Gamepad2,
  Tv,
  LayoutGrid,
} from 'lucide-react';
import type { Category } from '@/types/database';

interface CategoryItem {
  id: string;
  name: string;
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
  // Mockup category definitions matching the 8 items in the uploaded image
  const displayCategories: CategoryItem[] = [
    {
      id: 'phones',
      name: 'Mobile Phones',
      slug: 'mobile-phones',
      icon: <Smartphone className="w-8 h-8 text-blue-600" />,
      imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=160&auto=format&fit=crop&q=80',
    },
    {
      id: 'laptops',
      name: 'Laptops',
      slug: 'laptops',
      icon: <Laptop className="w-8 h-8 text-slate-700" />,
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=160&auto=format&fit=crop&q=80',
    },
    {
      id: 'watches',
      name: 'Smart Watches',
      slug: 'smart-watches',
      icon: <Watch className="w-8 h-8 text-slate-800" />,
      imageUrl: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=160&auto=format&fit=crop&q=80',
    },
    {
      id: 'earbuds',
      name: 'Earbuds & Headphones',
      slug: 'earbuds',
      icon: <Headphones className="w-8 h-8 text-slate-900" />,
      imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=160&auto=format&fit=crop&q=80',
    },
    {
      id: 'accessories',
      name: 'Accessories',
      slug: 'chargers',
      icon: <Zap className="w-8 h-8 text-amber-500" />,
      imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=160&auto=format&fit=crop&q=80',
    },
    {
      id: 'gaming',
      name: 'Gaming',
      slug: 'gaming',
      icon: <Gamepad2 className="w-8 h-8 text-indigo-600" />,
      imageUrl: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=160&auto=format&fit=crop&q=80',
    },
    {
      id: 'appliances',
      name: 'Home Appliances',
      slug: 'home-appliances',
      icon: <Tv className="w-8 h-8 text-slate-600" />,
      imageUrl: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=160&auto=format&fit=crop&q=80',
    },
    {
      id: 'more',
      name: 'More',
      slug: 'all',
      icon: <LayoutGrid className="w-8 h-8 text-slate-700" />,
    },
  ];

  return (
    <div className="py-6 sm:py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 8-Column Responsive Grid matching Mockup Strip */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 sm:gap-4">
          {displayCategories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory && onSelectCategory(cat.slug)}
                className={`group flex flex-col items-center justify-between p-3.5 sm:p-4 rounded-2xl transition-all duration-300 aspect-square text-center cursor-pointer border ${
                  isSelected
                    ? 'bg-amber-50 border-[#F59E0B] shadow-md scale-105'
                    : 'bg-[#F8FAFC] border-slate-200/70 hover:bg-white hover:border-slate-300 hover:shadow-md hover:-translate-y-1'
                }`}
              >
                {/* Image or Icon Container */}
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center my-auto">
                  {cat.imageUrl ? (
                    <Image
                      src={cat.imageUrl}
                      alt={cat.name}
                      fill
                      sizes="56px"
                      className="object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {cat.icon}
                    </div>
                  )}
                </div>

                {/* Category Label */}
                <span className={`text-[11px] sm:text-xs font-bold line-clamp-1 mt-1 transition ${
                  isSelected ? 'text-[#D97706]' : 'text-slate-800 group-hover:text-slate-950'
                }`}>
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
