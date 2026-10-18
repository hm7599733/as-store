'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  MessageCircle,
  X,
  Send,
  CheckCheck,
  Sparkles,
  ShieldCheck,
  Truck,
  HelpCircle,
  ChevronDown,
  Phone,
} from 'lucide-react';

export default function WhatsAppFloatingButton({
  whatsappNumber,
}: {
  whatsappNumber: string | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);
  const [userQuery, setUserQuery] = useState('');
  const pathname = usePathname();

  const rawPhone = whatsappNumber || '+92 320 1042634';
  const cleanPhone = rawPhone.replace(/\D/g, '');

  // Show a gentle teaser bubble after 2.5 seconds to invite questions
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTeaser(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Detect if on a product page to personalize message
  const isProductPage = pathname?.startsWith('/products/');

  const handleSendMessage = (customText?: string) => {
    const query = (customText || userQuery).trim();
    const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
    const pageTitle = typeof document !== 'undefined' ? document.title.split('|')[0].trim() : '';

    let fullMessage = `Hello AS Gadgets Support Team!\n\n`;

    if (query) {
      fullMessage += `💬 *Question / Inquiry:* ${query}\n\n`;
    } else {
      fullMessage += `I would like to ask a question regarding your products & accessories.\n\n`;
    }

    if (isProductPage && pageTitle) {
      fullMessage += `📦 *Product Page:* ${pageTitle}\n🔗 *Link:* ${pageUrl}\n\n`;
    }

    fullMessage += `Please guide me on availability, price, and dispatch. Thank you!`;

    const encoded = encodeURIComponent(fullMessage);
    const waUrl = `https://wa.me/${cleanPhone}?text=${encoded}`;

    window.open(waUrl, '_blank', 'noopener,noreferrer');
    setUserQuery('');
    setIsOpen(false);
  };

  const quickInquiries = [
    {
      icon: '⚡',
      label: 'Fast Charging & Compatibility',
      text: 'Mera phone fast charging support karta hai, kya ye accessory mere phone ke sath compatible hai?',
    },
    {
      icon: '🛡️',
      label: '7-Day Warranty & Policy',
      text: 'Mujhe is product ki official replacement warranty aur guarantee ke baray mein maloomat chahiye.',
    },
    {
      icon: '🚚',
      label: 'Delivery & Cash on Delivery',
      text: 'Delivery kitne din mein hogi aur kya Cash on Delivery available hai?',
    },
    {
      icon: '🏷️',
      label: 'Wholesale / Bulk Discount',
      text: 'Agar main wholesale / bulk quantity mein order karoon to kya special discount rate milega?',
    },
  ];

  return (
    <aside
      aria-label="WhatsApp Customer Support"
      className="fixed bottom-5 right-5 z-50 flex flex-col items-end select-none"
    >
      {/* 1. Teaser Speech Bubble (Visible before opening) */}
      {!isOpen && showTeaser && (
        <div className="mb-2 mr-1 animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-[260px] sm:max-w-xs">
          <div className="relative p-3 rounded-2xl bg-[#0B132B] text-white shadow-xl border border-cyan-500/30 text-xs">
            <button
              onClick={() => setShowTeaser(false)}
              className="absolute top-1.5 right-1.5 p-1 rounded-full text-slate-400 hover:text-white"
              aria-label="Dismiss message"
            >
              <X className="w-3 h-3" />
            </button>
            <div className="flex items-start gap-2 pr-4">
              <span className="text-base shrink-0">👋</span>
              <div>
                <p className="font-bold text-[#06B6D4] text-[11px] uppercase tracking-wide">
                  Need Help With A Product?
                </p>
                <p className="text-slate-300 text-[11px] mt-0.5 leading-snug">
                  Click here to ask anything about our mobile accessories on WhatsApp!
                </p>
              </div>
            </div>
            {/* Speech bubble pointer */}
            <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-[#0B132B] border-r border-b border-cyan-500/30 transform rotate-45" />
          </div>
        </div>
      )}

      {/* 2. Interactive Bottom WhatsApp Popup Modal */}
      {isOpen && (
        <div className="mb-3 w-[92vw] sm:w-[380px] max-w-[400px] rounded-3xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-5 duration-300 max-h-[85vh]">
          {/* Popup Header with WhatsApp Theme */}
          <div className="bg-linear-to-r from-emerald-700 via-emerald-600 to-teal-700 text-white p-4 flex items-center justify-between shadow-md shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-xs border border-white/30 flex items-center justify-center font-black text-sm">
                  <MessageCircle className="w-6 h-6 fill-white text-emerald-700" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight flex items-center gap-1.5">
                  <span>AS Gadgets Support</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[9px] font-black uppercase tracking-wider">
                    Official
                  </span>
                </h3>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                  <span>Typically replies in 5 minutes</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition cursor-pointer"
              aria-label="Close WhatsApp chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Body Simulation */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 flex-1 overflow-y-auto space-y-3.5 text-xs">
            {/* Welcome Agent Message */}
            <div className="flex items-start gap-2 max-w-[85%]">
              <div className="p-3 rounded-2xl rounded-tl-none bg-white dark:bg-[#111A35] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-2xs space-y-1">
                <p className="font-medium leading-relaxed">
                  Assalam-o-Alaikum! 👋 Welcome to <strong>AS Gadgets</strong>.
                </p>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                  Aap ko kisi bhi product ke warranty, compatibility, wholesale rate ya delivery ke mutaliq sawal pochna hai?
                </p>
                <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 pt-1">
                  <span>Today</span>
                  <CheckCheck className="w-3.5 h-3.5 text-cyan-600" />
                </div>
              </div>
            </div>

            {/* Quick Inquiry Buttons (Instant WhatsApp launch) */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-1 block">
                Quick Product Questions:
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {quickInquiries.map((inq, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(inq.text)}
                    className="w-full text-left p-2.5 rounded-xl bg-white dark:bg-[#111A35] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 text-slate-700 dark:text-slate-300 hover:text-emerald-800 transition flex items-center justify-between group shadow-2xs cursor-pointer"
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <span className="text-sm shrink-0">{inq.icon}</span>
                      <span className="font-semibold text-[11px] truncate">{inq.label}</span>
                    </div>
                    <Send className="w-3 h-3 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Popup Footer Input Area */}
          <div className="p-3 bg-white dark:bg-[#0B132B] border-t border-slate-200 dark:border-slate-800 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="Apna sawal yahan likhein..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
              />

              <button
                type="submit"
                className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm active:scale-95 cursor-pointer shrink-0"
                title="Send via WhatsApp"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
              <span>Helpline: {rawPhone}</span>
              <span className="text-emerald-600 font-bold">Fast Response 24/7</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Floating Trigger Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setShowTeaser(false);
        }}
        aria-label="Chat on WhatsApp"
        aria-expanded={isOpen}
        className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-600/30 transition-all duration-300 hover:scale-105 active:scale-95 group cursor-pointer relative"
      >
        <div className="relative">
          <MessageCircle className="w-5 h-5 fill-current" />
          {!isOpen && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-300 border-2 border-emerald-600 animate-ping" />
          )}
        </div>
        <span className="font-bold text-xs">
          {isOpen ? 'Close Chat' : 'WhatsApp Help'}
        </span>

        {/* Notification chip when closed */}
        {!isOpen && (
          <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center -ml-1">
            1
          </span>
        )}
      </button>
    </aside>
  );
}
