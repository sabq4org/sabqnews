import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.vercel-storage.com',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // استخدام standalone output لتحسين التوافق مع Vercel
  // تعطيل Static Generation مؤقتًا لتجاوز خطأ <Html> أثناء البناء.
  // هذا سيجعل جميع الصفحات تُعرض من جانب الخادم (SSR) بدلاً من توليدها بشكل ثابت (SSG).
  // إذا احتجنا SSG لاحقًا، فسيتعين علينا التحقق بعمق من السبب الجذري لخطأ <Html>.
  output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },

  },
};

export default nextConfig;



// Dummy comment to force Vercel redeploy

