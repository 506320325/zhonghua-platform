import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '中華促進會 · 信任社區',
    short_name: '中華促進會',
    description: '香港生活·工作·商業·社區綜合服務平台',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#C41E24',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}