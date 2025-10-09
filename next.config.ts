// next.config.ts
import type { NextConfig } from "next";

const nextConfig = {
  reactStrictMode: true,
  // Legg til egne valg her:
  images: {
    formats: ["image/avif", "image/webp"],
    // domains: ["pengestrom.no"], // hvis du trenger eksterne bilder
  },
  // experimental: { optimizePackageImports: ["lucide-react"] },
} satisfies NextConfig;

export default nextConfig;
