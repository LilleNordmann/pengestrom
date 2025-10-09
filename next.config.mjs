// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    // domains: ["pengestrom.no"], // legg til om du trenger eksterne bilder
  },
  // experimental: { optimizePackageImports: ["lucide-react"] },
};

export default nextConfig;
