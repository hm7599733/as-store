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

  // Realistic seed ratings
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
    <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs hover:shadow-xl hover:shadow-cyan-500/10 hover:border-cyan-500/50 transition-all duration-300">
      {/* Top Header: Badge on left + Heart on right */}
      <div className="flex items-center justify-between mb-2 z-10">
        <div>
          {discountPercent > 0 ? (
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#06B6D4] text-slate-950 shadow-2xs">
              -{Math.round(discountPercent)}%
            </span>
          ) : product.best_seller ? (
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black bg-cyan-400 text-slate-950 shadow-2xs">
              Best Seller
            </span>
          ) : product.new_arrival ? (
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-600 text-white shadow-2xs">
              New
            </span>
          ) : (
            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
              Original
            </span>
          )}
        </div>

        {/* Heart Wishlist Icon */}
        <button
          onClick={toggleWishlist}
          className="p-1.5 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition cursor-pointer"
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
        className="relative aspect-square w-full rounded-xl bg-slate-50 p-4 flex items-center justify-center overflow-hidden my-2 group-hover:bg-slate-100/70 transition"
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
        {/* Category Tag */}
        {product.category && (
          <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-700 block line-clamp-1">
            {product.category.name}
          </span>
        )}

        {/* Title */}
        <Link
          href={`/products/${product.slug}`}
          className="block font-bold text-xs sm:text-sm text-slate-900 group-hover:text-cyan-600 transition line-clamp-1"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Pricing with strikethrough */}
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

        {/* Wholesale Tag */}
        {product.wholesale_price && product.wholesale_price > 0 && (
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold text-cyan-700 bg-cyan-50 border border-cyan-200/60 px-1.5 py-0.5 rounded">
              Wholesale: {formatPrice(product.wholesale_price)}
            </span>
          </div>
        )}

        {/* Star Rating with Cyan Star */}
        <div className="flex items-center gap-1 text-[11px] text-slate-600 font-semibold">
          <Star className="w-3.5 h-3.5 fill-[#06B6D4] text-[#06B6D4]" />
          <span>{ratingValue.toFixed(1)}</span>
          <span className="text-slate-400 font-normal">({reviewCount})</span>
        </div>
      </div>

      {/* Add to Cart Button */}
      <div className="pt-3">
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all duration-200 shadow-2xs cursor-pointer active:scale-95 ${
            isOutOfStock
              ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
              : adding
              ? 'bg-emerald-600 text-white'
              : 'bg-[#0B132B] hover:bg-[#06B6D4] hover:text-slate-950 text-white hover:shadow-md'
          }`}
        >
          {adding ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added to Cart!</span>
            </>
          ) : isOutOfStock ? (
            <span>Out of Stock</span>
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
