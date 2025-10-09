// src/app/layout.tsx
import type { Metadata, Viewport } from 'next';
import './globals.css';
import InstallPWAButton from '@/components/InstallPWAButton';

export const metadata: Metadata = {
  title: 'Pengestrøm',
  description: 'Budsjett, lønn og lån i nettleseren',

  // PWA
  manifest: '/manifest.json',
  themeColor: '#000000',

  // iOS / Safari
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Pengestrøm',
  },

  // Ikoner (bruker dine ultralight-filer)
  icons: {
    // Favicons
    icon: [
      { url: '/favicon.ico' }, // fallback for eldre/Windows
      { url: '/icons/pengestrom_logo.svg', type: 'image/svg+xml' },
      { url: '/icons/pengestrom_icon_ultralight_32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/pengestrom_icon_ultralight_64.png', sizes: '64x64', type: 'image/png' },
      { url: '/icons/pengestrom_icon_ultralight_128.png', sizes: '128x128', type: 'image/png' },
    ],
    // Apple touch (du har 192 – funker; kan lage 180 senere)
    apple: [
      { url: '/icons/pengestrom_icon_ultralight_192.png', sizes: '192x192' },
    ],
    // Safari pinned tab (må være monokrom)
    other: [
      { rel: 'mask-icon', url: '/icons/pengestrom_logo_mono.svg', color: '#000000' },
    ],
  },

  // Chromium anbefaler denne i tillegg
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no">
      <body>
        {children}
        <InstallPWAButton />
      </body>
    </html>
  );
}
