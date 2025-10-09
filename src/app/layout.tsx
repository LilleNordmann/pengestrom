// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pengestrøm",
  description: "Budsjett, lønn og lån i nettleseren",
  // <-- fjern themeColor her hvis den lå her før
};

export const viewport: Viewport = {
  // én farge for hele appen (passer PWA + svart bakgrunn)
  themeColor: "#000000",
  // (valgfritt) si tydelig at appen er dark
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="icon" href="/icons/pengestrom_logo.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/pengestrom_icon_ultralight_192.png" />
        <link rel="mask-icon" href="/icons/pengestrom_logo.svg" color="#000000" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>{children}</body>
    </html>
  );
}
