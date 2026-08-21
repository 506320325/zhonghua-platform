'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import PwaInstallBanner from '@/components/PwaInstallBanner'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  // 判断是否显示返回按钮（首页不显示）
  const showBack = pathname !== '/'

  // 判断当前页面高亮
  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/')

  // 导航项
  const navItems = [
    { path: '/', label: '🏠 首頁' },
    { path: '/tenant/register', label: '🏪 入駐' },
    { path: '/branch/apply', label: '🏛️ 申請分會' },
    { path: '/user', label: '👤 我的' },
  ]

  // 页面名称映射
  const pageNameMap: Record<string, string> = {
    '/auth/login': '登入',
    '/auth/register': '註冊',
    '/user': '我的',
    '/tenant/register': '租戶入駐',
    '/tenant/dashboard': '租戶後台',
    '/branch/apply': '申請分會',
    '/branch/dashboard': '分會後台',
    '/admin/branches': '分會審批',
    '/admin': '總後台審批',
  }

  // 当前页面名称（如果首页没有显示）
  const currentPageName = pageNameMap[pathname] || ''

  return (
    <html lang="zh-HK">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="bg-warm min-h-screen pb-20">
        {/* 顶部导航栏 */}
        <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          {showBack ? (
            <>
              <button
                onClick={() => router.back()}
                className="text-2xl leading-none text-gray-600 hover:text-primary transition"
                aria-label="返回"
              >
                ‹
              </button>
              <span className="text-sm font-medium text-gray-700 truncate">
                {currentPageName}
              </span>
            </>
          ) : (
            <span className="text-xl font-bold text-primary">中華促進會</span>
          )}
          <span className="ml-auto text-xs text-gray-400">信任社區</span>
        </div>

        {/* 主内容 */}
        <main className="max-w-4xl mx-auto px-4 py-4">

        <PwaInstallBanner />
          {children}
        </main>

        {/* 底部导航栏 */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-2 py-1 flex justify-around max-w-4xl mx-auto">
          {navItems.map((item) => {
            const active = isActive(item.path)
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex flex-col items-center py-1 px-3 text-xs rounded-lg transition ${
                  active
                    ? 'text-primary font-medium'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <span className="text-lg leading-none">{item.label.split(' ')[0]}</span>
                <span className="mt-0.5">{item.label.split(' ')[1] || '首頁'}</span>
              </Link>
            )
          })}
        </div>
      </body>
    </html>
  )
}
