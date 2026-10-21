'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FolderTree,
  Plus,
  Pencil,
  Trash2,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  Image as ImageIcon,
  Check,
  Package,
  Layers,
  ArrowRight,
  ExternalLink,
  SlidersHorizontal,
} from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  description: string | null;
  active: boolean;
  created_at: string;
  products_count?: number;
}

interface CategoryFormData {
  id?: string;
  name: string;
  slug: string;
  image_url: string;
  description: string;
  active: boolean;
}

const emptyForm: CategoryFormData = {
  name: '',
  slug: '',
  image_url: '',
  description: '',
  active: true,
};

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState<CategoryFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      if (res.ok && data.success) {
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setModalMode('create');
    setFormData(emptyForm);
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: CategoryItem) => {
    setModalMode('edit');
    setFormData({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      image_url: cat.image_url || '',
      description: cat.description || '',
      active: cat.active,
    });
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    if (modalMode === 'create' && (!formData.slug || formData.slug === slugify(formData.name))) {
      setFormData((prev) => ({
        ...prev,
        name: val,
        slug: slugify(val),
      }));
    } else {
      setFormData((prev) => ({ ...prev, name: val }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMsg('Category name is required');
      return;
    }

    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (modalMode === 'create') {
        const res = await fetch('/api/admin/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setSuccessMsg('Category created successfully!');
          await fetchCategories();
          setTimeout(() => setIsModalOpen(false), 900);
        } else {
          setErrorMsg(data.error || 'Failed to create category');
        }
      } else {
        const res = await fetch(`/api/admin/categories/${formData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setSuccessMsg('Category updated successfully!');
          await fetchCategories();
          setTimeout(() => setIsModalOpen(false), 900);
        } else {
          setErrorMsg(data.error || 'Failed to update category');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat: CategoryItem) => {
    const warning = cat.products_count && cat.products_count > 0
      ? `This category has ${cat.products_count} product(s) assigned to it. Deleting it will detach these products from this category. Continue?`
      : `Are you sure you want to permanently delete category "${cat.name}"?`;

    if (!confirm(warning)) return;

    setActionLoadingId(cat.id);
    try {
      const res = await fetch(`/api/admin/categories/${cat.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCategories((prev) => prev.filter((c) => c.id !== cat.id));
      } else {
        alert(data.error || 'Failed to delete category');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting category');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleStatus = async (cat: CategoryItem) => {
    setActionLoadingId(cat.id);
    try {
      const res = await fetch(`/api/admin/categories/${cat.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cat.name,
          active: !cat.active,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCategories((prev) =>
          prev.map((c) => (c.id === cat.id ? { ...c, active: !c.active } : c))
        );
      } else {
        alert(data.error || 'Failed to update status');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filtered categories
  const filteredCategories = categories.filter((cat) => {
    if (statusFilter === 'active' && !cat.active) return false;
    if (statusFilter === 'inactive' && cat.active) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = cat.name.toLowerCase().includes(q);
      const matchSlug = cat.slug.toLowerCase().includes(q);
      const matchDesc = cat.description?.toLowerCase().includes(q);
      return matchName || matchSlug || matchDesc;
    }
    return true;
  });

  const totalCategories = categories.length;
  const activeCount = categories.filter((c) => c.active).length;
  const inactiveCount = totalCategories - activeCount;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Catalogue Architecture
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-[10px] font-bold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-full">
              Storefront Categories
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Category Management & Hierarchy
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Add new product categories, edit names/slugs, customize banners, or toggle storefront visibility.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={fetchCategories}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition shadow-2xs active:scale-95"
            title="Refresh Categories"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-600 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#06B6D4] hover:bg-cyan-500 text-slate-950 text-xs font-black transition shadow-sm hover:scale-102 active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Total Categories</span>
          <div className="font-display text-2xl font-black text-slate-900 mt-1">
            {totalCategories} <span className="text-xs font-normal text-slate-400">groups</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider">Active On Store</span>
          <div className="font-display text-2xl font-black text-emerald-600 mt-1">
            {activeCount}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Hidden / Inactive</span>
          <div className="font-display text-2xl font-black text-slate-600 mt-1">
            {inactiveCount}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search category by name, slug, or description..."
            className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600 transition"
          />
          <Search className="absolute left-3 top-3 w-3.5 h-3.5 text-slate-400" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {[
            { id: 'all', label: 'All', count: totalCategories },
            { id: 'active', label: 'Active', count: activeCount },
            { id: 'inactive', label: 'Hidden', count: inactiveCount },
          ].map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as any)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  isActive
                    ? 'bg-[#0B132B] text-white shadow-xs'
                    : 'bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] opacity-70">({tab.count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-slate-400 text-xs flex flex-col items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin text-cyan-600 mb-2" />
            <span>Loading categories...</span>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="p-16 text-center text-slate-400 text-xs">
            <FolderTree className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">No categories found matching your query.</p>
            <p className="mt-1">Try clearing filters or add a new category using the button above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/90 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Category</th>
                  <th className="p-4">Slug / URL Key</th>
                  <th className="p-4">Products Linked</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCategories.map((cat) => {
                  const isOperating = actionLoadingId === cat.id;

                  return (
                    <tr key={cat.id} className="hover:bg-slate-50/70 transition">
                      {/* Name & Thumbnail */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 relative">
                            {cat.image_url ? (
                              <img
                                src={cat.image_url}
                                alt={cat.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <FolderTree className="w-5 h-5 text-slate-400" />
                            )}
                          </div>
                          <div>
                            <div className="font-black text-slate-900 text-sm">{cat.name}</div>
                            {cat.description && (
                              <div className="text-[11px] text-slate-400 truncate max-w-xs mt-0.5">
                                {cat.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Slug */}
                      <td className="p-4 font-mono text-slate-600 text-xs">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 font-bold">
                          {cat.slug}
                        </span>
                      </td>

                      {/* Products Count */}
                      <td className="p-4">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-900 font-bold text-[11px]">
                          <Package className="w-3 h-3 text-cyan-600" />
                          <span>{cat.products_count || 0} products</span>
                        </div>
                      </td>

                      {/* Status Toggle Badge */}
                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(cat)}
                          disabled={isOperating}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider cursor-pointer transition hover:opacity-80 active:scale-95 ${
                            cat.active
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                          title="Click to toggle visibility on storefront"
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              cat.active ? 'bg-emerald-600' : 'bg-slate-500'
                            }`}
                          />
                          <span>{cat.active ? 'ACTIVE' : 'HIDDEN'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Edit Button */}
                          <button
                            type="button"
                            onClick={() => openEditModal(cat)}
                            disabled={isOperating}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B132B] hover:bg-slate-900 text-white font-bold text-[11px] transition shadow-2xs hover:scale-102"
                            title="Edit Category Name, Slug & Details"
                          >
                            <Pencil className="w-3.5 h-3.5 text-[#06B6D4]" />
                            <span>Edit</span>
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleDelete(cat)}
                            disabled={isOperating}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 transition border border-rose-200 disabled:opacity-50"
                            title="Permanently Delete Category"
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

      {/* Edit / Create Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-[#06B6D4]" />
                <h3 className="font-display font-black text-base text-white">
                  {modalMode === 'create' ? 'Create New Category' : `Edit Category: ${formData.name}`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-rose-700 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-700 text-xs">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Category Name */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Category Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Wireless Headphones"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600"
                />
              </div>

              {/* Slug / Key */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-800">
                    Slug / URL Key <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, slug: slugify(prev.name) }))}
                    className="text-[11px] text-cyan-600 hover:underline font-semibold"
                  >
                    Auto-generate from Name
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: slugify(e.target.value) }))}
                  placeholder="e.g. wireless-headphones"
                  className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Used in URL: /products?category={formData.slug || 'category-slug'}
                </span>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Banner / Icon Image URL
                </label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData((prev) => ({ ...prev, image_url: e.target.value }))}
                  placeholder="https://images.unsplash.com/... or /images/..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600"
                />
                {formData.image_url && (
                  <div className="mt-2 flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200">
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-10 h-10 object-cover rounded-lg border border-slate-200"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <span className="text-[11px] text-slate-500 truncate">Image preview verified</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief summary shown on category filter tabs and search meta..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600 resize-none"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="activeToggle"
                  checked={formData.active}
                  onChange={(e) => setFormData((prev) => ({ ...prev, active: e.target.checked }))}
                  className="w-4 h-4 rounded-md border-slate-300 text-cyan-600 focus:ring-cyan-500 cursor-pointer"
                />
                <label htmlFor="activeToggle" className="text-xs font-bold text-slate-800 cursor-pointer">
                  Active (Show on Storefront Navigation & Filter Grids)
                </label>
              </div>

              {/* Modal Footer Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={saving}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#06B6D4] hover:bg-cyan-500 text-slate-950 font-black text-xs transition shadow-sm hover:scale-102 active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{modalMode === 'create' ? 'Create Category' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
