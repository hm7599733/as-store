'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppFloatingButton({
  whatsappNumber,
}: {
  whatsappNumber: string | null;
}) {
  const number = (whatsappNumber || '+92 320 1042634').replace(/\D/g, '');

  return (
    <aside aria-label="Support Chat" className="fixed bottom-6 right-6 z-40 group">
      <a
        href={`https://wa.me/${number}?text=Hello%20AS%20Store!%20I%20have%20an%20inquiry%20regarding%20your%20products.`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with AS Store on WhatsApp"
        className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-glow-emerald transition-all duration-300 hover:scale-105 active:scale-95"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="font-bold text-xs hidden sm:inline">WhatsApp Help</span>
      </a>
    </aside>
  );
}
