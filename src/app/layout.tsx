// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: 'Pengestrøm',
  description: 'Budsjett, lønn og lån i nettleseren',
  manifest: '/manifest.json', // <- denne linja kobler manifestet
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/pengestrom_icon_32.png',  type: 'image/png', sizes: '32x32' },
      { url: '/pengestrom_icon_64.png',  type: 'image/png', sizes: '64x64' },
      { url: '/pengestrom_icon_128.png', type: 'image/png', sizes: '128x128' },
      { url: '/pengestrom_icon_192.png', type: 'image/png', sizes: '192x192' },
      { url: '/pengestrom_icon_512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [{ url: '/pengestrom_icon_192.png' }],
  },
  themeColor: '#000000',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no">
      <body className="font-sans">{children}</body>
    </html>
  );
}

