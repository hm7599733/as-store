import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { ToastProvider } from '@/context/ToastContext';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.asstore.pk'),
  title: {
    default: 'AS Gadgets | Premium Mobile Accessories & Smart Gadgets',
    template: '%s | AS Gadgets',
  },
  description:
    'AS Gadgets is Pakistan’s trusted destination for premium mobile accessories, high-speed GaN chargers, 20,000mAh power banks, and wireless earbuds with cash on delivery.',
  keywords: [
    'AS Gadgets',
    'AS Store',
    'mobile accessories Pakistan',
    'smart gadgets Pakistan',
    'power banks Pakistan',
    'fast chargers',
    'wireless earbuds',
    'USB-C cables',
    'cash on delivery',
  ],
  authors: [{ name: 'AS Gadgets' }],
  creator: 'AS Gadgets',
  publisher: 'AS Gadgets',
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'AS Store',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icon-96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/icon-customer-192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: '#070D1E',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

import ScrollToTopButton from '@/components/storefront/ScrollToTopButton';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" className="dark">
      <head>
        {/* Google Search Favicon Guidelines (multiples of 48px: 48x48, 96x96, 192x192) */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="48x48" href="/icon-48.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/icon-96.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icon-customer-192.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#070D1E] text-slate-100 transition-colors duration-200">
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <CartProvider>
                {children}
                <ScrollToTopButton />
              </CartProvider>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
