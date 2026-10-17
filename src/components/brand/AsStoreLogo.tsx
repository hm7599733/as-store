'use client';

import React from 'react';
import Link from 'next/link';

export default function AsStoreLogo({
  variant = 'dark',
  size = 'md',
}: {
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
}) {
  const isLight = variant === 'light';

  return (
    <Link href="/" className="inline-flex items-center gap-2.5 group select-none">
      {/* Cyber Cyan & Sapphire Angled AS Monogram Mark */}
      <div className="relative flex items-center justify-center">
        <svg
          className={
            size === 'lg'
              ? 'w-10 h-10'
              : size === 'sm'
              ? 'w-7 h-7'
              : 'w-9 h-9'
          }
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="cyberCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22D3EE" />
              <stop offset="50%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
            <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#06B6D4" floodOpacity="0.5" />
            </filter>
          </defs>
          {/* Stylized Angled 'A' & 'S' Geometric Emblem */}
          <path
            d="M10 82L38 18H54L26 82H10Z"
            fill="url(#cyberCyanGrad)"
          />
          <path
            d="M34 52H62L57 63H29L34 52Z"
            fill="url(#cyberCyanGrad)"
          />
          <path
            d="M48 30C52 22 62 18 74 18C86 18 94 24 94 34C94 45 84 49 74 52C63 55 58 58 58 65C58 72 65 76 76 76C84 76 90 73 95 68L98 78C91 84 83 87 73 87C58 87 46 79 46 66C46 54 57 49 67 46C77 43 82 40 82 34C82 29 76 26 69 26C62 26 56 29 52 35L48 30Z"
            fill="url(#cyberCyanGrad)"
            filter="url(#cyanGlow)"
          />
        </svg>
      </div>

      {/* Brand Text */}
      <span
        className={`font-display font-black tracking-wider uppercase leading-none transition group-hover:opacity-90 ${
          size === 'lg'
            ? 'text-2xl sm:text-3xl'
            : size === 'sm'
            ? 'text-base'
            : 'text-xl sm:text-2xl'
        } ${isLight ? 'text-slate-900' : 'text-white'}`}
      >
        STORE
      </span>
    </Link>
  );
}
