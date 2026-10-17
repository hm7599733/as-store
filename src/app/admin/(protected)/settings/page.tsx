'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2, AlertCircle } from 'lucide-react';
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
        setMessage({ text: 'Settings saved successfully in Supabase!', type: 'success' });
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
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900">
          Store Configuration
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure business details, shipping fees, discount tiers, and support hotlines for <strong>AS Store</strong>.
        </p>
      </div>

      {message && (
        <div
          className={`flex items-center gap-2 p-4 rounded-2xl border text-xs font-semibold ${
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
        <div className="p-16 text-center text-slate-400 text-xs animate-pulse">
          Loading settings...
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Brand Information */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h2 className="font-bold text-sm text-slate-900">Brand & Support Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Business Name
                </label>
                <input
                  type="text"
                  value={settings.business_name || 'AS Store'}
                  onChange={(e) => setSettings({ ...settings, business_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  WhatsApp Support Helpline
                </label>
                <input
                  type="text"
                  value={settings.whatsapp_number || '+92 320 1042634'}
                  onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                  placeholder="+92 320 1042634"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 font-bold font-mono text-emerald-700"
                />
              </div>
            </div>
          </div>

          {/* Delivery & Shipping */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h2 className="font-bold text-sm text-slate-900">Delivery Charges & Thresholds</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Standard Delivery Charges (PKR)
                </label>
                <input
                  type="number"
                  value={settings.delivery_charges ?? 200}
                  onChange={(e) =>
                    setSettings({ ...settings, delivery_charges: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Free Shipping Minimum Order (PKR)
                </label>
                <input
                  type="number"
                  value={settings.free_shipping_threshold ?? 3000}
                  onChange={(e) =>
                    setSettings({ ...settings, free_shipping_threshold: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 font-bold"
                />
              </div>
            </div>
          </div>

          {/* Bundle Tier Discounts */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h2 className="font-bold text-sm text-slate-900">Automatic Volume Discounts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tier 1 Threshold (PKR)
                </label>
                <input
                  type="number"
                  value={settings.bundle_tier1_threshold ?? 3000}
                  onChange={(e) =>
                    setSettings({ ...settings, bundle_tier1_threshold: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tier 1 Discount (%)
                </label>
                <input
                  type="number"
                  value={settings.bundle_tier1_percent ?? 5}
                  onChange={(e) =>
                    setSettings({ ...settings, bundle_tier1_percent: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tier 2 Threshold (PKR)
                </label>
                <input
                  type="number"
                  value={settings.bundle_tier2_threshold ?? 6000}
                  onChange={(e) =>
                    setSettings({ ...settings, bundle_tier2_threshold: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tier 2 Discount (%)
                </label>
                <input
                  type="number"
                  value={settings.bundle_tier2_percent ?? 10}
                  onChange={(e) =>
                    setSettings({ ...settings, bundle_tier2_percent: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 font-bold"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-sm disabled:opacity-50 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving to Database...' : 'Save Configuration'}</span>
          </button>
        </form>
      )}
    </div>
  );
}
