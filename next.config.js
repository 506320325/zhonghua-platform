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
  env: {
    JWT_SECRET: 'zhonghua-platform-secret-key-2026',
    NEXT_DISABLE_TYPECHECK: 'true',
    NEXT_DISABLE_ESLINT: 'true',
  },
}

module.exports = nextConfig