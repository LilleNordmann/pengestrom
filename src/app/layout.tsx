import "./globals.css";

export const metadata = {
  title: "Pengestrøm",
  description: "Budsjett, lønn og lån i nettleseren",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no">
      <body>{children}</body>
    </html>
  );
}
