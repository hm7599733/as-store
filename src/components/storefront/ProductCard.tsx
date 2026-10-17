'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Zap, Check } from 'lucide-react';
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
  const [imageError, setImageError] = useState(false);

  const primaryImage =
    product.product_images?.find((img) => img.is_primary)?.image_url ||
    product.product_images?.[0]?.image_url ||
    '/images/product-placeholder.png';

  const { percentage: discountPercent, amount: savingsAmount } = calculateSavings(
    product.price,
    product.old_price
  );

  const isOutOfStock = product.stock_status === 'out_of_stock';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    setAdding(true);
    addToCart(product, 1);
    setTimeout(() => setAdding(false), 800);
  };

  return (
    <div className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 hover:-translate-y-1">
      {/* Badges Container */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex flex-col gap-1 items-start">
          {discountPercent > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white shadow-sm">
              -{discountPercent}% OFF
            </span>
          )}
          {product.free_delivery && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-sm">
              Free Delivery
            </span>
          )}
          {product.new_arrival && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white shadow-sm">
              New
            </span>
          )}
        </div>

        {isOutOfStock ? (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-600">
            Sold Out
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            In Stock
          </span>
        )}
      </div>

      {/* Product Image */}
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-square w-full overflow-hidden rounded-t-2xl p-4 flex items-center justify-center bg-slate-50"
      >
        {!imageError && primaryImage ? (
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            onError={() => setImageError(true)}
            className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
            <Zap className="w-8 h-8 mb-1 opacity-40" />
            <span className="text-[11px]">AS Store Tech</span>
          </div>
        )}
      </Link>

      {/* Product Details */}
      <div className="flex flex-col flex-1 p-4 pt-2">
        {/* Category */}
        {product.category && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 mb-1">
            {product.category.name}
          </span>
        )}

        {/* Title */}
        <Link
          href={`/products/${product.slug}`}
          className="font-display text-xs sm:text-sm font-bold line-clamp-2 leading-snug text-slate-900 hover:text-blue-600 transition"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Spacer */}
        <div className="flex-1 min-h-[8px]" />

        {/* Price & Savings */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-sm sm:text-base font-extrabold text-blue-600">
              {formatPrice(product.price)}
            </span>
            {product.old_price && product.old_price > product.price && (
              <span className="text-[11px] sm:text-xs text-slate-400 line-through">
                {formatPrice(product.old_price)}
              </span>
            )}
          </div>
          {savingsAmount > 0 && (
            <p className="text-[10px] font-semibold text-emerald-600 mt-0.5">
              Save {formatPrice(savingsAmount)}
            </p>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`mt-3 w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 ${
            isOutOfStock
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : adding
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-slate-900 hover:bg-blue-600 text-white shadow-sm'
          }`}
        >
          {adding ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added!</span>
            </>
          ) : isOutOfStock ? (
            <span>Out of Stock</span>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
