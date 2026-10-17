'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function AsStoreLogo({
  variant = 'dark',
  size = 'md',
  showText = false,
}: {
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}) {
  // Height configurations based on size
  const heightStyle =
    size === 'lg'
      ? 'h-12 sm:h-14'
      : size === 'sm'
      ? 'h-8 sm:h-9'
      : 'h-10 sm:h-11';

  return (
    <Link href="/" className="inline-flex items-center gap-2 group select-none">
      <div className={`relative ${heightStyle} aspect-[667/499] flex items-center justify-center`}>
        <Image
          src="/images/as-store-logo.png"
          alt="AS Store - Smart Choices • Better Living"
          width={667}
          height={499}
          priority
          className="h-full w-auto object-contain transition-transform group-hover:scale-105"
        />
      </div>
    </Link>
  );
}
