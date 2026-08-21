/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    optimizePackageImports: ['@prisma/client'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // ✅ 强制注入环境变量
  env: {
    JWT_SECRET: 'zhonghua-platform-secret-key-2026',
    NEXT_DISABLE_TYPECHECK: 'true',
    NEXT_DISABLE_ESLINT: 'true',
  },
}

module.exports = nextConfig