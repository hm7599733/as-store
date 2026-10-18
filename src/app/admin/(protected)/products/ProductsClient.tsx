'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Package,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  Image as ImageIcon,
  Check,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { Product, Category, StockStatus } from '@/types/database';

interface ProductFormData {
  id?: string;
  name: string;
  slug: string;
  category_id: string;
  price: string;
  old_price: string;
  wholesale_price: string;
  stock_status: StockStatus;
  primary_image: string;
  additional_images: string;
  short_description: string;
  description: string;
  active: boolean;
  featured: boolean;
}

const initialFormData: ProductFormData = {
  name: '',
  slug: '',
  category_id: '',
  price: '',
  old_price: '',
  wholesale_price: '',
  stock_status: 'in_stock',
  primary_image: '',
  additional_images: '',
  short_description: '',
  description: '',
  active: true,
  featured: false,
};

export default function ProductsClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreateModal = () => {
    setModalMode('create');
    setFormData({
      ...initialFormData,
      category_id: categories[0]?.id || '',
    });
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setModalMode('edit');
    const primaryImg =
      product.product_images?.find((img) => img.is_primary)?.image_url ||
      product.product_images?.[0]?.image_url ||
      '';

    const otherImgs = (product.product_images || [])
      .filter((img) => img.image_url !== primaryImg)
      .map((img) => img.image_url)
      .join('\n');

    setFormData({
      id: product.id,
      name: product.name,
      slug: product.slug,
      category_id: product.category_id || '',
      price: product.price ? product.price.toString() : '',
      old_price: product.old_price ? product.old_price.toString() : '',
      wholesale_price: product.wholesale_price ? product.wholesale_price.toString() : '',
      stock_status: product.stock_status || 'in_stock',
      primary_image: primaryImg,
      additional_images: otherImgs,
      short_description: product.short_description || '',
      description: product.description || '',
      active: product.active ?? true,
      featured: product.featured ?? false,
    });
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSaving(true);

    if (!formData.name.trim()) {
      setErrorMsg('Product name is required');
      setSaving(false);
      return;
    }

    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      setErrorMsg('Please enter a valid price in PKR');
      setSaving(false);
      return;
    }

    const additionalImagesArray = formData.additional_images
      .split('\n')
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    const payload = {
      name: formData.name.trim(),
      slug: formData.slug.trim(),
      category_id: formData.category_id || null,
      price: Number(formData.price),
      old_price: formData.old_price ? Number(formData.old_price) : null,
      wholesale_price: formData.wholesale_price ? Number(formData.wholesale_price) : null,
      stock_status: formData.stock_status,
      short_description: formData.short_description.trim(),
      description: formData.description.trim(),
      active: formData.active,
      featured: formData.featured,
      primary_image: formData.primary_image.trim(),
      additional_images: additionalImagesArray,
    };

    try {
      const url =
        modalMode === 'create'
          ? '/api/admin/products'
          : `/api/admin/products/${formData.id}`;

      const method = modalMode === 'create' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setErrorMsg(data.error || 'Failed to save product');
      } else {
        setSuccessMsg(
          modalMode === 'create'
            ? 'Product added successfully!'
            : 'Product updated successfully!'
        );
        setTimeout(() => setSuccessMsg(null), 3000);
        setIsModalOpen(false);
        fetchProducts();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error while saving product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}" from AS Store catalogue?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSuccessMsg(`"${name}" was deleted successfully.`);
        setTimeout(() => setSuccessMsg(null), 3000);
        fetchProducts();
      } else {
        alert('Failed to delete product');
      }
    } catch (err) {
      alert('Error deleting product');
    }
  };

  const filteredProducts = products.filter((prod) => {
    if (categoryFilter !== 'all' && prod.category_id !== categoryFilter) return false;
    if (stockFilter !== 'all' && prod.stock_status !== stockFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = prod.name.toLowerCase().includes(q);
      const matchSlug = prod.slug.toLowerCase().includes(q);
      return matchName || matchSlug;
    }
    return true;
  });

  const totalInStock = products.filter((p) => p.stock_status === 'in_stock').length;
  const totalOutOfStock = products.filter((p) => p.stock_status === 'out_of_stock').length;
  const totalActive = products.filter((p) => p.active).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner Alert */}
      {successMsg && (
        <div className="flex items-center gap-2 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold animate-slide-up shadow-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Catalogue & Inventory
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-[10px] font-bold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-full">
              Mobile Accessories Only
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Product Catalogue & Stock
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Add new mobile accessories, edit pricing, manage stock status, and upload high-res images for <strong>AS Store</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchProducts}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition shadow-2xs active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-600 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B132B] hover:bg-slate-900 text-white text-xs font-bold transition shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4 text-[#06B6D4]" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Metrics Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Total Items</span>
          <div className="font-display text-2xl font-black text-slate-900 mt-1">
            {products.length}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Active Listings</span>
          <div className="font-display text-2xl font-black text-blue-600 mt-1">
            {totalActive}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase">In Stock</span>
          <div className="font-display text-2xl font-black text-emerald-600 mt-1">
            {totalInStock}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Out of Stock</span>
          <div className="font-display text-2xl font-black text-rose-600 mt-1">
            {totalOutOfStock}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by title or model..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-800 font-semibold focus:outline-none focus:border-blue-600"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Stock Dropdown */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-800 font-semibold focus:outline-none focus:border-blue-600"
          >
            <option value="all">All Stock Status</option>
            <option value="in_stock">In Stock</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="low_stock">Low Stock</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-16 text-center text-slate-400 text-xs animate-pulse">
            Loading products from database...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-16 text-center text-slate-500 text-xs">
            No products found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">Item Details</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Visibility</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((prod) => {
                  const img =
                    prod.product_images?.find((i) => i.is_primary)?.image_url ||
                    prod.product_images?.[0]?.image_url ||
                    '/images/product-placeholder.png';

                  return (
                    <tr key={prod.id} className="hover:bg-slate-50/70 transition">
                      {/* Product Thumbnail & Name */}
                      <td className="p-4 flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                          <Image
                            src={img}
                            alt={prod.name}
                            fill
                            sizes="48px"
                            className="object-contain p-1"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 line-clamp-1 max-w-xs sm:max-w-md">
                            {prod.name}
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">
                            /{prod.slug}
                          </span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-4 text-slate-600 font-medium whitespace-nowrap">
                        {prod.category?.name || 'General Accessories'}
                      </td>

                      {/* Price */}
                      <td className="p-4 whitespace-nowrap">
                        <div className="font-display font-bold text-slate-900 text-sm">
                          {formatPrice(prod.price)}
                        </div>
                        {prod.old_price && prod.old_price > prod.price && (
                          <span className="text-[10px] text-slate-400 line-through block">
                            {formatPrice(prod.old_price)}
                          </span>
                        )}
                        {prod.wholesale_price && prod.wholesale_price > 0 && (
                          <div className="mt-1">
                            <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-50 text-cyan-800 border border-cyan-200">
                              WS: {formatPrice(prod.wholesale_price)}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Stock Status */}
                      <td className="p-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            prod.stock_status === 'in_stock'
                              ? 'bg-emerald-100 text-emerald-800'
                              : prod.stock_status === 'low_stock'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {prod.stock_status === 'in_stock'
                            ? 'In Stock'
                            : prod.stock_status === 'low_stock'
                            ? 'Low Stock'
                            : 'Out of Stock'}
                        </span>
                      </td>

                      {/* Visibility */}
                      <td className="p-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            prod.active
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {prod.active ? 'Published' : 'Hidden'}
                        </span>
                      </td>

                      {/* Action Buttons */}
                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/products/${prod.slug}`}
                            target="_blank"
                            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                            title="Preview on Store"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            onClick={() => openEditModal(prod)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition"
                            title="Edit Product"
                          >
                            <Pencil className="w-3 h-3" />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => handleDelete(prod.id, prod.name)}
                            className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h2 className="font-display font-black text-xl text-slate-900">
                  {modalMode === 'create' ? 'Add New Product' : 'Edit Product'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enter specifications, pricing, stock, and photos for this item.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleModalSubmit} className="space-y-4">
              {/* Product Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. 65W GaN Fast Charger with Dual Type-C Ports"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              {/* Category & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                  >
                    <option value="">Select a category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    URL Slug (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="auto-generated-if-empty"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              {/* Pricing & Stock Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Selling Price (PKR) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="2500"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:outline-none focus:border-cyan-600 font-bold"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Customer retail price</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Wholesale Price (PKR)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.wholesale_price}
                    onChange={(e) => setFormData({ ...formData, wholesale_price: e.target.value })}
                    placeholder="1800"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:outline-none focus:border-cyan-600 font-bold text-cyan-700"
                  />
                  <span className="text-[10px] text-cyan-600 mt-0.5 block font-semibold">Bulk / wholesale rate</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Original / Old Price (PKR)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.old_price}
                    onChange={(e) => setFormData({ ...formData, old_price: e.target.value })}
                    placeholder="3200"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:outline-none focus:border-cyan-600"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Strikethrough discount</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Stock Availability
                  </label>
                  <select
                    value={formData.stock_status}
                    onChange={(e) =>
                      setFormData({ ...formData, stock_status: e.target.value as StockStatus })
                    }
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:outline-none focus:border-cyan-600 font-semibold"
                  >
                    <option value="in_stock">In Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                    <option value="low_stock">Low Stock</option>
                  </select>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Live inventory badge</span>
                </div>
              </div>

              {/* Primary Image URL & Preview */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Primary Photo Image URL
                </label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <input
                      type="url"
                      value={formData.primary_image}
                      onChange={(e) => setFormData({ ...formData, primary_image: e.target.value })}
                      placeholder="https://example.com/images/product.jpg"
                      className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                    />
                    <ImageIcon className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  </div>
                  {formData.primary_image && (
                    <div className="relative w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                      <Image
                        src={formData.primary_image}
                        alt="Preview"
                        fill
                        sizes="40px"
                        className="object-contain p-0.5"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Images (One per line) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Additional Gallery Photo URLs (One URL per line)
                </label>
                <textarea
                  rows={2}
                  value={formData.additional_images}
                  onChange={(e) =>
                    setFormData({ ...formData, additional_images: e.target.value })
                  }
                  placeholder="https://example.com/images/angle2.jpg&#10;https://example.com/images/angle3.jpg"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 font-mono"
                />
              </div>

              {/* Short & Full Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  value={formData.short_description}
                  onChange={(e) =>
                    setFormData({ ...formData, short_description: e.target.value })
                  }
                  placeholder="Brief 1-line headline summarizing the product"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Description & Specifications
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed specifications, technical details, box contents..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Active & Listed in Storefront</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Featured Deal / Spotlight Banner</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0B132B] hover:bg-slate-900 text-white text-xs font-bold shadow-sm transition disabled:opacity-50 active:scale-95"
                >
                  {saving ? (
                    <span>Saving Product...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4 text-[#06B6D4]" />
                      <span>{modalMode === 'create' ? 'Create Product' : 'Save Changes'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
