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
      </head>
      <body>{children}</body>
    </html>
  );
}
