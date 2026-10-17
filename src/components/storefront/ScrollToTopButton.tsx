'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 250) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to Top"
      className="fixed bottom-6 left-6 z-40 flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-[#0B152E]/95 hover:bg-[#0F1D3D] text-cyan-300 border border-cyan-500/60 shadow-lg shadow-cyan-500/20 backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 group cursor-pointer animate-fade-in"
    >
      <ArrowUp className="w-4 h-4 text-[#06B6D4] transition-transform group-hover:-translate-y-1 animate-pulse" />
      <span className="font-display font-black text-xs text-white tracking-widest uppercase">
        TOP
      </span>
      <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] animate-ping" />
    </button>
  );
}
