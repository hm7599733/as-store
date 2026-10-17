import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { ToastProvider } from '@/context/ToastContext';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.asstore.pk'),
  title: {
    default: 'AS Store | Premium Mobile Accessories & Tech Gadgets',
    template: '%s | AS Store',
  },
  description:
    'AS Store is Pakistan’s trusted online destination for premium mobile accessories, high-speed GaN chargers, durable power banks, and high-fidelity wireless audio.',
  keywords: [
    'AS Store',
    'mobile accessories Pakistan',
    'power banks Pakistan',
    'fast chargers',
    'wireless earbuds',
    'USB-C cables',
    'cash on delivery',
  ],
  authors: [{ name: 'AS Store' }],
  creator: 'AS Store',
  publisher: 'AS Store',
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: '#FFFFFF',
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
