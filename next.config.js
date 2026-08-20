/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,   // ← 必须加上！
  },
  eslint: {
    ignoreDuringBuilds: true,  // ← 必须加上！
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
}

module.exports = nextConfig