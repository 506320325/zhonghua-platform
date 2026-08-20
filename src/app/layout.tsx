import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '中華促進會 · 信任社區',
  description: '香港生活·工作·商業·社區綜合服務平台',
  manifest: '/manifest.json',
  themeColor: '#C41E24',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-HK">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="min-h-screen bg-warm">
        {children}
      </body>
    </html>
  )
}