'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  Truck,
  Sparkles,
  HelpCircle,
  Building,
  ShieldCheck,
} from 'lucide-react';
import type { Settings as SettingsType } from '@/types/database';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Partial<SettingsType>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setSettings(data.settings);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ text: 'Store settings saved and synchronized successfully!', type: 'success' });
      } else {
        setMessage({ text: data.error || 'Failed to save settings', type: 'error' });
      }
    } catch (err: any) {
      setMessage({ text: err.message || 'Error saving settings', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* SaaS Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Operations & Logistics
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-[10px] font-bold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-full">
              Live Configuration
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Store Operations & Configuration
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure business identity, shipping fee rules, volume discounts, and customer helpline for <strong>AS Store</strong>.
          </p>
        </div>
      </div>

      {message && (
        <div
          className={`flex items-center gap-2.5 p-4 rounded-2xl border text-xs font-semibold ${
            message.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {loading ? (
        <div className="p-16 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-3">
          <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading store parameters...</span>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Brand Identity & Support Details */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Building className="w-4 h-4 text-cyan-600" />
              <h2 className="font-bold text-sm text-slate-900">Brand Identity & Support Contact</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Business Store Name
                </label>
                <input
                  type="text"
                  value={settings.business_name || 'AS Store'}
                  onChange={(e) => setSettings({ ...settings, business_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-cyan-600 font-semibold"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Displayed on packing slips and headers</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Official WhatsApp Helpline
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={settings.whatsapp_number || '+92 320 1042634'}
                    onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                    placeholder="+92 320 1042634"
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-cyan-600 font-bold font-mono text-emerald-700"
                  />
                  <PhoneCall className="absolute left-3 top-3 w-3.5 h-3.5 text-emerald-600" />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Official customer contact: +92 320 1042634</span>
              </div>
            </div>
          </div>

          {/* Logistics & Delivery Rates */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Truck className="w-4 h-4 text-cyan-600" />
              <h2 className="font-bold text-sm text-slate-900">Delivery Charges & Free Shipping Threshold</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Standard Flat Delivery Rate (PKR)
                </label>
                <input
                  type="number"
                  min="0"
                  value={settings.delivery_charges ?? 200}
                  onChange={(e) =>
                    setSettings({ ...settings, delivery_charges: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-cyan-600 font-bold"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Standard courier rate applied to standard carts</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Free Shipping Minimum Cart Value (PKR)
                </label>
                <input
                  type="number"
                  min="0"
                  value={settings.free_shipping_threshold ?? 3000}
                  onChange={(e) =>
                    setSettings({ ...settings, free_shipping_threshold: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-cyan-600 font-bold"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Orders equal to or above this amount get free delivery</span>
              </div>
            </div>
          </div>

          {/* Volume Bundle Discounts */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Sparkles className="w-4 h-4 text-[#06B6D4]" />
              <h2 className="font-bold text-sm text-slate-900">Automatic Cart Volume Discounts</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tier 1 Spend Threshold (PKR)
                </label>
                <input
                  type="number"
                  value={settings.bundle_tier1_threshold ?? 3000}
                  onChange={(e) =>
                    setSettings({ ...settings, bundle_tier1_threshold: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-cyan-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tier 1 Discount Percentage (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={settings.bundle_tier1_percent ?? 5}
                  onChange={(e) =>
                    setSettings({ ...settings, bundle_tier1_percent: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-cyan-600 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tier 2 Spend Threshold (PKR)
                </label>
                <input
                  type="number"
                  value={settings.bundle_tier2_threshold ?? 6000}
                  onChange={(e) =>
                    setSettings({ ...settings, bundle_tier2_threshold: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-cyan-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tier 2 Discount Percentage (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={settings.bundle_tier2_percent ?? 10}
                  onChange={(e) =>
                    setSettings({ ...settings, bundle_tier2_percent: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-cyan-600 font-bold"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-[#0B132B] hover:bg-slate-900 text-white font-bold text-xs transition shadow-sm disabled:opacity-50 active:scale-95"
            >
              <Save className="w-4 h-4 text-[#06B6D4]" />
              <span>{saving ? 'Synchronizing with Database...' : 'Save Configuration Changes'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
