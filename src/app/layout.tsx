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
    icon: '/favicon.ico',
    apple: '/icon-customer-192.png',
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
