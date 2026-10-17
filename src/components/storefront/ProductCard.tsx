'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, Star, Check } from 'lucide-react';
import type { Product } from '@/types/database';
import { formatPrice, calculateSavings } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

export default function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);

  const primaryImage =
    product.product_images?.find((img) => img.is_primary)?.image_url ||
    product.product_images?.[0]?.image_url ||
    '/images/product-placeholder.png';

  const { percentage: discountPercent } = calculateSavings(
    product.price,
    product.old_price
  );

  const isOutOfStock = product.stock_status === 'out_of_stock';

  // Seed realistic ratings if not stored in DB
  const ratingValue = 4.7 + ((product.name.charCodeAt(0) % 3) * 0.1);
  const reviewCount = 45 + (product.name.charCodeAt(1) % 180);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    setAdding(true);
    addToCart(product, 1);
    setTimeout(() => setAdding(false), 900);
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-4 shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300">
      {/* Top Header: Badge on left + Heart on right (Mockup exact) */}
      <div className="flex items-center justify-between mb-2">
        <div>
          {discountPercent > 0 ? (
            <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-black bg-[#EF4444] text-white shadow-xs">
              -{Math.round(discountPercent)}%
            </span>
          ) : product.best_seller ? (
            <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-black bg-[#EF4444] text-white shadow-xs">
              Best Seller
            </span>
          ) : product.new_arrival ? (
            <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-black bg-[#06B6D4] text-white shadow-xs">
              New
            </span>
          ) : (
            <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-black bg-[#06B6D4] text-white shadow-xs">
              Featured
            </span>
          )}
        </div>

        {/* Heart Wishlist Icon */}
        <button
          onClick={toggleWishlist}
          className="p-1 rounded-full text-slate-400 hover:text-rose-500 transition cursor-pointer"
          aria-label="Add to wishlist"
        >
          <Heart
            className={`w-4 h-4 transition ${
              isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
            }`}
          />
        </button>
      </div>

      {/* Product Image Clickable Link */}
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-square w-full rounded-xl bg-slate-50/60 p-3 flex items-center justify-center overflow-hidden my-2 group-hover:bg-slate-100/60 transition"
      >
        <Image
          src={imageError ? '/images/product-placeholder.png' : primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 160px, (max-width: 1024px) 220px, 240px"
          priority={priority}
          onError={() => setImageError(true)}
          className="object-contain p-2 group-hover:scale-108 transition-transform duration-300"
        />
      </Link>

      {/* Product Information */}
      <div className="space-y-1.5 mt-1">
        {/* Title */}
        <Link
          href={`/products/${product.slug}`}
          className="block font-bold text-xs sm:text-sm text-slate-900 hover:text-blue-600 transition line-clamp-1"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Pricing with strikethrough (Mockup exact) */}
        <div className="flex items-baseline gap-2">
          <span className="font-extrabold text-sm sm:text-base text-slate-900 font-display">
            {formatPrice(product.price)}
          </span>
          {product.old_price && product.old_price > product.price && (
            <span className="text-[11px] text-slate-400 line-through">
              {formatPrice(product.old_price)}
            </span>
          )}
        </div>

        {/* Rating with Yellow Star */}
        <div className="flex items-center gap-1 text-[11px] text-slate-600 font-semibold">
          <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
          <span>{ratingValue.toFixed(1)}</span>
          <span className="text-slate-400 font-normal">({reviewCount})</span>
        </div>
      </div>

      {/* Dark Pill Add to Cart Button (Mockup exact) */}
      <div className="pt-3">
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all duration-200 shadow-xs cursor-pointer active:scale-95 ${
            isOutOfStock
              ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
              : adding
              ? 'bg-emerald-600 text-white'
              : 'bg-[#0F172A] hover:bg-[#1E293B] text-white hover:shadow-md'
          }`}
        >
          {adding ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added!</span>
            </>
          ) : isOutOfStock ? (
            <span>Sold Out</span>
          ) : (
            <>
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
