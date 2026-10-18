'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function AsStoreLogo({
  variant = 'dark',
  size = 'md',
  className = '',
}: {
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}) {
  const heightStyle =
    size === 'xl'
      ? 'h-16 sm:h-20'
      : size === 'lg'
      ? 'h-13 sm:h-16'
      : size === 'sm'
      ? 'h-8 sm:h-9'
      : 'h-10 sm:h-12';

  const logoSrc =
    variant === 'light'
      ? '/images/as-gadgets-logo-light.png'
      : '/images/as-store-logo.png';

  return (
    <Link href="/" className={`inline-flex items-center gap-2 group select-none ${className}`}>
      <div className={`relative ${heightStyle} aspect-[893/507] flex items-center justify-center`}>
        <Image
          src={logoSrc}
          alt="AS Gadgets — Mobile Accessories • Smart Gadgets • More"
          width={893}
          height={507}
          priority
          className="h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    </Link>
  );
}
