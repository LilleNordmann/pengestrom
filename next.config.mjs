// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { formats: ["image/avif", "image/webp"] },

  // ⬇️ Ikke kjør ESLint i prod-build
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
