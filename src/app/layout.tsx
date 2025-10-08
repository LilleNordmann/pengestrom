import type { Metadata } from "next";
// Fjern font-importen og bruk en enkel sans-serif
import "./globals.css";

export const metadata = {
  title: "Pengestrøm",
  description: "Budsjett, lønn og lån i nettleseren",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no">
      <body className="font-sans">{children}</body>
    </html>
  );
}

