'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface User {
  id: string
  email: string
  phone: string
  nickname: string
  role: string
}

export default function UserPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')
    
    if (!token || !userStr) {
      router.push('/auth/login')
      return
    }

    try {
      setUser(JSON.parse(userStr))
    } catch {
      router.push('/auth/login')
    } finally {
      setLoading(false)
    }
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">載入中...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
      {/* 用户信息 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-3xl">
            👤
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user.nickname || '用戶'}</h2>
            <p className="text-gray-500 text-sm">{user.email || user.phone}</p>
            <p className="text-xs text-gray-400 mt-1">角色：{user.role || '普通用戶'}</p>
          </div>
        </div>
      </div>

      {/* 功能列表 */}
      <div className="space-y-2">

        {/* 編輯個人資料 */}
        <Link href="/user/profile" className="block bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-primary transition">
          <div className="flex items-center justify-between">
            <span>📝 編輯個人資料</span>
            <span className="text-gray-400 text-sm">學歷 / 特長 / 愛好 / 寵物</span>
          </div>
        </Link>

        {/* 信貼牆 */}
        <Link href="/stamps" className="block bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-primary transition">
          <div className="flex items-center justify-between">
            <span>💌 信貼牆</span>
            <span className="text-gray-400 text-sm">每日 3 張信貼</span>
          </div>
        </Link>

        {/* 我的活動主頁 */}
        <Link href="/user/events" className="block bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-primary transition">
          <div className="flex items-center justify-between">
            <span>🎪 我的活動主頁</span>
            <span className="text-gray-400 text-sm">臨時組合</span>
          </div>
        </Link>
        {/* 消息 */}
        <Link href="/user/messages" className="block bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-primary transition">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>💬 訊息</span>
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">2</span>
            </div>
            <span className="text-gray-400 text-sm">查看全部</span>
          </div>
        </Link>

        {/* 我建立的主頁 */}
        <Link href="/pages/my" className="block bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-primary transition">
          <div className="flex items-center justify-between">
            <span>📄 我建立的主頁</span>
            <span className="text-gray-400 text-sm">查看</span>
          </div>
        </Link>

        {/* 建立主頁 */}
        <Link href="/pages/create" className="block bg-primary/5 rounded-xl p-4 shadow-sm border border-primary/20 hover:border-primary transition">
          <div className="flex items-center justify-between">
            <span className="font-medium text-primary">➕ 建立主頁</span>
            <span className="text-primary text-sm">開通組織空間</span>
          </div>
        </Link>

        {/* 我的分會 */}
        <Link href="/branches/my" className="block bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-primary transition">
          <div className="flex items-center justify-between">
            <span>🏛️ 我的分會</span>
            <span className="text-gray-400 text-sm">查看</span>
          </div>
        </Link>

        {/* 申請分會 */}
        <Link href="/branches/apply" className="block bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-primary transition">
          <div className="flex items-center justify-between">
            <span>🏛️ 申請分會</span>
            <span className="text-gray-400 text-sm">成為會長</span>
          </div>
        </Link>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 opacity-50">
          <div className="flex items-center justify-between">
            <span>📋 我的活動</span>
            <span className="text-gray-400 text-sm">即將推出</span>
          </div>
        </div>

        {/* 隱藏後台入口 */}
        <div className="mt-4 pt-4 border-t border-gray-100 text-center text-xs text-gray-300">
          <Link href="/tenant/dashboard" className="hover:text-gray-500">租戶後台</Link>
          <span className="mx-2">·</span>
          <Link href="/branch/dashboard" className="hover:text-gray-500">分會後台</Link>
          <span className="mx-2">·</span>
          <Link href="/admin" className="hover:text-gray-500">總後台</Link>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            router.push('/auth/login')
          }}
          className="w-full bg-red-50 text-red-600 rounded-xl p-4 text-sm font-medium hover:bg-red-100 transition"
        >
          登出
        </button>
      </div>
    </div>
  )
}
