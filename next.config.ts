import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // استخدام standalone output لتحسين التوافق مع Vercel
  output: 'standalone',
  // تعطيل static generation للصفحات التي تسبب مشاكل
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;

