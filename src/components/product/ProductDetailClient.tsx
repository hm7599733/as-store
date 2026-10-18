'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShoppingBag,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Plus,
  Minus,
  PhoneCall,
  Star,
  ChevronRight,
  PackageCheck,
  Layers,
} from 'lucide-react';
import type { Product, Settings } from '@/types/database';
import { formatPrice, calculateSavings } from '@/lib/utils';
import { buildProductInquiryWhatsAppMessage, createWhatsAppUrl } from '@/lib/whatsapp';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/components/theme/ThemeProvider';
import ProductCard from '@/components/storefront/ProductCard';

export default function ProductDetailClient({
  product,
  relatedProducts = [],
  settings,
}: {
  product: Product;
  relatedProducts: Product[];
  settings: Settings | null;
}) {
  const { addToCart, openCheckout } = useCart();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const images = product.product_images && product.product_images.length > 0
    ? product.product_images
    : [{ id: 'default', product_id: product.id, image_url: '/images/product-placeholder.png', is_primary: true, sort_order: 0, created_at: '' }];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(
    product.product_variants?.[0]?.variant_name || null
  );
  const [selectedBundle, setSelectedBundle] = useState<any | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const isOutOfStock = product.stock_status === 'out_of_stock';
  const currentPrice = selectedBundle ? selectedBundle.bundle_price : product.price;
  const currentOldPrice = selectedBundle
    ? selectedBundle.original_price || product.old_price
    : product.old_price;

  const { percentage: discountPercent, amount: savingsAmount } = calculateSavings(
    currentPrice,
    currentOldPrice
  );

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    setAdded(true);
    addToCart(
      product,
      quantity,
      selectedBundle ? selectedBundle.title : selectedVariant || undefined,
      currentPrice
    );
    setTimeout(() => setAdded(false), 1200);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(
      product,
      quantity,
      selectedBundle ? selectedBundle.title : selectedVariant || undefined,
      currentPrice
    );
    openCheckout();
  };

  const rawPhone = settings?.whatsapp_number || '+92 320 1042634';
  const waInquiryUrl = createWhatsAppUrl(
    rawPhone,
    buildProductInquiryWhatsAppMessage({
      productName: product.name,
      price: currentPrice,
      productUrl: typeof window !== 'undefined' ? window.location.href : `https://asstore.pk/products/${product.slug}`,
      variant: selectedBundle ? selectedBundle.title : selectedVariant || undefined,
    })
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6 overflow-x-auto no-scrollbar">
        <Link href="/" className="hover:text-blue-500 transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/products" className="hover:text-blue-500 transition">Products</Link>
        {product.category && (
          <>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link
              href={`/products?category=${product.category.slug}`}
              className="hover:text-blue-500 transition whitespace-nowrap"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5" />
        <span className={`font-semibold line-clamp-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
          {product.name}
        </span>
      </nav>

      {/* Main Product Section: Gallery + Purchase Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Image Gallery (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Main Large Image Container */}
          <div className={`relative aspect-square w-full rounded-3xl border overflow-hidden p-6 flex items-center justify-center transition ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#0E1526] border-slate-800'
          }`}>
            {discountPercent > 0 && (
              <div className="absolute top-4 left-4 z-10 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500 text-white shadow-sm">
                -{discountPercent}% OFF
              </div>
            )}
            {product.free_delivery && (
              <div className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-sm">
                Free Delivery
              </div>
            )}
            <Image
              src={images[activeImageIndex]?.image_url || '/images/product-placeholder.png'}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-contain p-4 transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Thumbnails Row */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
              {images.map((img, idx) => (
                <button
                  key={img.id || idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-16 h-16 rounded-xl border overflow-hidden p-1 transition shrink-0 ${
                    activeImageIndex === idx
                      ? 'border-blue-500 ring-2 ring-blue-500/30'
                      : isLight
                      ? 'border-slate-200 bg-white opacity-70 hover:opacity-100'
                      : 'border-slate-800 bg-slate-900 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={img.image_url}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    fill
                    sizes="64px"
                    className="object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info & Buy Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Category & Status */}
          <div className="flex items-center justify-between">
            {product.category && (
              <span className="text-xs font-bold uppercase tracking-wider text-blue-500">
                {product.category.name}
              </span>
            )}
            {isOutOfStock ? (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-400">
                Out of Stock
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                In Stock • Ready to Dispatch
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className={`font-display text-2xl sm:text-3xl font-black tracking-tight leading-tight ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            {product.name}
          </h1>

          {/* Short Description */}
          {product.short_description && (
            <p className={`text-xs sm:text-sm leading-relaxed ${
              isLight ? 'text-slate-600' : 'text-slate-400'
            }`}>
              {product.short_description}
            </p>
          )}

          {/* Price Box */}
          <div className={`p-4 rounded-2xl border ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0E1526] border-slate-800'
          }`}>
            <div className="flex items-baseline gap-3">
              <span className="font-display text-2xl sm:text-3xl font-black text-blue-500">
                {formatPrice(currentPrice)}
              </span>
              {currentOldPrice && currentOldPrice > currentPrice && (
                <span className="text-sm sm:text-base text-slate-500 line-through">
                  {formatPrice(currentOldPrice)}
                </span>
              )}
            </div>
            {savingsAmount > 0 && (
              <p className="text-xs font-semibold text-emerald-400 mt-1">
                You save {formatPrice(savingsAmount)} ({discountPercent}% off regular price)
              </p>
            )}
            {product.wholesale_price && product.wholesale_price > 0 && (
              <div className="mt-3 pt-2.5 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                  Wholesale / Bulk Rate:
                </span>
                <span className="font-bold text-cyan-500 font-display text-sm">
                  {formatPrice(product.wholesale_price)} <span className="text-[10px] text-slate-400 font-normal">/ unit</span>
                </span>
              </div>
            )}
          </div>

          {/* Color / Variant Selection */}
          {product.product_variants && product.product_variants.length > 0 && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Select Option:
              </label>
              <div className="flex flex-wrap gap-2">
                {product.product_variants.map((v) => {
                  const isSelected = selectedVariant === v.variant_name;
                  return (
                    <button
                      key={v.id || v.variant_name}
                      onClick={() => {
                        setSelectedVariant(v.variant_name);
                        setSelectedBundle(null);
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition active:scale-95 ${
                        isSelected
                          ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                          : isLight
                          ? 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                          : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {v.variant_name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bundle Offers Selection */}
          {product.bundle_offers && product.bundle_offers.length > 0 && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Special Combo Deals:
              </label>
              <div className="space-y-2">
                {product.bundle_offers.map((bundle, idx) => {
                  const isSelected = selectedBundle?.title === bundle.title;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedBundle(isSelected ? null : bundle)}
                      className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left text-xs transition active:scale-95 ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                          : isLight
                          ? 'border-slate-200 bg-white text-slate-800 hover:border-slate-300'
                          : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="font-bold">{bundle.title}</strong>
                          {bundle.badge_text && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-black">
                              {bundle.badge_text}
                            </span>
                          )}
                        </div>
                        {bundle.description && (
                          <p className="text-[11px] text-slate-400 mt-0.5">{bundle.description}</p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-bold text-sm text-blue-500 block">
                          {formatPrice(bundle.bundle_price)}
                        </span>
                        {bundle.original_price && (
                          <span className="text-[11px] text-slate-500 line-through">
                            {formatPrice(bundle.original_price)}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Quantity:
            </label>
            <div className="flex items-center border border-slate-700 rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2.5 hover:bg-slate-800 text-slate-300 transition"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-4 text-xs font-bold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2.5 hover:bg-slate-800 text-slate-300 transition"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Purchase Actions */}
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-xs font-bold transition shadow-glow active:scale-95 ${
                  isOutOfStock
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : added
                    ? 'bg-emerald-600 text-white'
                    : isLight
                    ? 'bg-slate-900 hover:bg-blue-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className={`flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-xs font-bold transition active:scale-95 ${
                  isOutOfStock
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-glow-emerald'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>Buy Now (Cash on Delivery)</span>
              </button>
            </div>

            {/* Direct WhatsApp Order Button */}
            <a
              href={waInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border border-emerald-600/50 hover:bg-emerald-600/10 text-emerald-400 text-xs font-bold transition active:scale-95"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Order via WhatsApp Fast Checkout</span>
            </a>
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200 text-center">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <Truck className="w-4 h-4 text-blue-600 mx-auto mb-1" />
              <span className="text-[10px] font-bold block text-slate-800">Fast Shipping</span>
              <span className="text-[9px] text-slate-500">2-4 working days</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <RotateCcw className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
              <span className="text-[10px] font-bold block text-slate-800">7-Day Warranty</span>
              <span className="text-[9px] text-slate-500">Hassle-free return</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <PackageCheck className="w-4 h-4 text-amber-600 mx-auto mb-1" />
              <span className="text-[10px] font-bold block text-slate-800">100% Genuine</span>
              <span className="text-[9px] text-slate-500">Quality inspected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs / Sections */}
      <div className="mt-16 space-y-12">
        {/* Description & Specifications Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Detailed Description */}
          <div className="p-6 sm:p-8 rounded-3xl border bg-white border-slate-200 shadow-sm">
            <h3 className="font-display text-lg font-bold mb-4 text-slate-900">
              Product Overview
            </h3>
            <div className="text-xs sm:text-sm leading-relaxed space-y-3 whitespace-pre-line text-slate-600">
              {product.description || 'No detailed description available.'}
            </div>
          </div>

          {/* Specifications Table */}
          <div className="p-6 sm:p-8 rounded-3xl border bg-white border-slate-200 shadow-sm">
            <h3 className="font-display text-lg font-bold mb-4 text-slate-900">
              Technical Specifications
            </h3>
            {product.specifications && product.specifications.length > 0 ? (
              <div className="divide-y divide-slate-100 text-xs">
                {product.specifications.map((spec, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between">
                    <span className="text-slate-500 font-medium">{spec.label}</span>
                    <span className="font-bold text-slate-900">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">Technical specifications standard for this model.</p>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="pt-8 border-t border-slate-200">
            <h3 className="font-display text-xl font-bold mb-6 text-slate-900">
              You May Also Like
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
