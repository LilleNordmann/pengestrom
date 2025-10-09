// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: 'Pengestrøm',
  description: 'Budsjett, lønn og lån i nettleseren',
  manifest: '/manifest.json', // <- denne linja kobler manifestet
  
  // iOS hjemskjerm-ikon (bruk 180–192px PNG)
  icons: {
    apple: [{ url: '/pengestrom_icon_ultratight_192.png' }],
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/pengestrom_icon_ultratight_192.png', type: 'image/png', sizes: '192x192' },
      { url: '/pengestrom_icon_ultratight_512.png', type: 'image/png', sizes: '512x512' }
    ],
  },

  // iOS web app-modus
  appleWebApp: {
    capable: true,                 // tilsvarer <meta name="apple-mobile-web-app-capable" content="yes">
    statusBarStyle: 'black-translucent', // tilsvarer <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    title: 'Pengestrøm',
  },

  themeColor: '#000000',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no">
      <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <body className="font-sans">{children}</body>
    </html>
  );
}

