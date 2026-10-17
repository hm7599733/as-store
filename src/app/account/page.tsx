'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  ShoppingBag,
  MapPin,
  Phone,
  Mail,
  LogOut,
  Calendar,
  ExternalLink,
  Printer,
  ChevronRight,
  Package,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
  Edit3,
  X,
  Save,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/components/theme/ThemeProvider';
import { formatPrice } from '@/lib/utils';

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  line_total?: number;
  total_price?: number;
  variant_name?: string | null;
}

interface Order {
  id: string;
  order_number?: string | null;
  customer_name: string;
  phone: string;
  city: string;
  address: string;
  total_amount: number;
  subtotal: number;
  delivery_charges: number;
  coupon_discount: number;
  payment_method: string;
  payment_status: string;
  status: string;
  created_at: string;
  order_items: OrderItem[];
}

export default function AccountPage() {
  const router = useRouter();
  const { user, profile, isLoading: authLoading, signOut, updateProfile } = useAuth();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Edit profile state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/account');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (profile) {
      setEditName(profile.full_name);
      setEditPhone(profile.phone);
      setEditCity(profile.city);
      setEditAddress(profile.address);
    }
  }, [profile]);

  useEffect(() => {
    async function loadOrders() {
      if (!user && !profile) return;
      setOrdersLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (user?.id) queryParams.set('userId', user.id);
        if (profile?.phone) queryParams.set('phone', profile.phone);
        if (user?.email) queryParams.set('email', user.email);

        const res = await fetch(`/api/auth/orders?${queryParams.toString()}`);
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders || []);
        }
      } catch (err) {
        console.error('Error loading orders:', err);
      } finally {
        setOrdersLoading(false);
      }
    }

    if (user) {
      loadOrders();
    }
  }, [user, profile]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg(null);
    try {
      const res = await updateProfile({
        full_name: editName,
        phone: editPhone,
        city: editCity,
        address: editAddress,
      });
      if (res.success) {
        setIsEditing(false);
        setProfileMsg('Profile updated successfully!');
        setTimeout(() => setProfileMsg(null), 3000);
      } else {
        setProfileMsg(res.error || 'Failed to update');
      }
    } catch (err: any) {
      setProfileMsg(err.message || 'Error saving profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'delivered') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <CheckCircle className="w-3.5 h-3.5" /> Delivered
        </span>
      );
    }
    if (s === 'shipped') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
          <Truck className="w-3.5 h-3.5" /> Shipped
        </span>
      );
    }
    if (s === 'approved') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">
          <CheckCircle className="w-3.5 h-3.5" /> Confirmed
        </span>
      );
    }
    if (s === 'cancelled' || s === 'rejected') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
          <AlertCircle className="w-3.5 h-3.5" /> Cancelled
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
        <Clock className="w-3.5 h-3.5" /> Processing
      </span>
    );
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-3" />
        <span>Loading account dashboard...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-slate-800/40">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-500 uppercase tracking-widest mb-1">
            <span>AS Store Member Portal</span>
          </div>
          <h1 className={`font-display text-2xl sm:text-3xl font-extrabold tracking-tight ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            Welcome back, {profile?.full_name || 'Customer'}
          </h1>
          <p className={`text-xs sm:text-sm mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Manage your personal profile, delivery addresses, and track recent orders
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/products"
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white transition shadow-glow flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Shop Catalog</span>
          </Link>
          <button
            onClick={async () => {
              await signOut();
              router.push('/');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition flex items-center gap-2 ${
              isLight
                ? 'border-slate-300 text-slate-700 hover:bg-slate-100'
                : 'border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {profileMsg && (
        <div className="mt-4 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{profileMsg}</span>
        </div>
      )}

      {/* Main Grid: Profile Info & Order History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className={`p-6 rounded-3xl border shadow-lg backdrop-blur-xl ${
            isLight
              ? 'bg-white border-slate-200 text-slate-900'
              : 'bg-slate-900/70 border-slate-800 text-white'
          }`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/40">
              <h2 className="font-display font-bold text-base flex items-center gap-2">
                <User className="w-4 h-4 text-blue-500" />
                <span>Customer Profile</span>
              </h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs font-semibold text-blue-500 hover:text-blue-400 transition flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditing ? 'Cancel' : 'Edit'}</span>
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleProfileSave} className="mt-4 space-y-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 opacity-75">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:border-blue-500 ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-800 border-slate-700'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 opacity-75">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:border-blue-500 ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-800 border-slate-700'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 opacity-75">City</label>
                  <input
                    type="text"
                    required
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:border-blue-500 ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-800 border-slate-700'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 opacity-75">Delivery Address</label>
                  <textarea
                    rows={2}
                    required
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:border-blue-500 ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-800 border-slate-700'
                    }`}
                  />
                </div>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow-glow"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingProfile ? 'Saving...' : 'Save Profile Changes'}</span>
                </button>
              </form>
            ) : (
              <div className="mt-4 space-y-4 text-xs sm:text-sm">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Full Name
                  </span>
                  <p className="font-semibold mt-0.5">{profile?.full_name || 'Not set'}</p>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Email Address
                  </span>
                  <p className="font-semibold mt-0.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{profile?.email || user?.email}</span>
                  </p>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Phone Number
                  </span>
                  <p className="font-semibold mt-0.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{profile?.phone || 'Not specified'}</span>
                  </p>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Saved Delivery Address
                  </span>
                  <p className="font-semibold mt-0.5 flex items-start gap-1.5 leading-relaxed">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>
                      {profile?.address ? `${profile.address}, ${profile.city || ''}` : 'No address set yet'}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className={`font-display font-bold text-lg sm:text-xl flex items-center gap-2 ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              <Package className="w-5 h-5 text-blue-500" />
              <span>Order History & Active Shipments</span>
            </h2>
            <span className="text-xs text-slate-400 font-medium">
              {orders.length} {orders.length === 1 ? 'Order' : 'Orders'} Placed
            </span>
          </div>

          {ordersLoading ? (
            <div className="p-12 text-center text-slate-400">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <span>Loading your orders from AS Store database...</span>
            </div>
          ) : orders.length === 0 ? (
            <div className={`p-10 text-center rounded-3xl border ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900/50 border-slate-800'
            }`}>
              <ShoppingBag className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <h3 className="font-bold text-base mb-1">No orders placed yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-5">
                Your completed orders and parcel tracking references will appear here once submitted.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-glow"
              >
                <span>Browse Latest Gadgets</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const orderDate = new Date(order.created_at).toLocaleDateString('en-PK', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={order.id}
                    className={`p-5 sm:p-6 rounded-3xl border transition-all ${
                      isLight
                        ? 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 shadow-md'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/40">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="font-display font-extrabold text-sm sm:text-base text-blue-500">
                            {order.order_number || `AS-${order.id.slice(0, 8).toUpperCase()}`}
                          </span>
                          {getStatusBadge(order.status)}
                        </div>
                        <span className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{orderDate}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/invoice/${order.id}`}
                          target="_blank"
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${
                            isLight
                              ? 'border-slate-300 text-slate-700 hover:bg-slate-100'
                              : 'border-slate-800 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Invoice</span>
                        </Link>
                      </div>
                    </div>

                    {/* Order items list */}
                    <div className="py-3.5 space-y-2">
                      {order.order_items?.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-xs">
                          <span className="opacity-90 font-medium">
                            {item.product_name}{' '}
                            {item.variant_name && <span className="opacity-60">({item.variant_name})</span>} ×{' '}
                            <strong>{item.quantity}</strong>
                          </span>
                          <span className="font-semibold">{formatPrice(item.total_price || item.unit_price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Order totals */}
                    <div className="pt-3 border-t border-slate-800/40 flex items-center justify-between text-xs sm:text-sm">
                      <div className="text-slate-400 text-xs">
                        <span>Payment: </span>
                        <strong className={isLight ? 'text-slate-800' : 'text-slate-200'}>
                          {order.payment_method || 'Cash on Delivery'}
                        </strong>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400 mr-2">Total Amount:</span>
                        <span className="font-display font-black text-base text-blue-500">
                          {formatPrice(order.total_amount)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
