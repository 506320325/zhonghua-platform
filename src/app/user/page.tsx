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
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')
    
    if (!token || !userStr) {
      router.push('/auth/login')
      return
    }

    try {
      const parsedUser = JSON.parse(userStr)
      setUser(parsedUser)
      // 模拟未读消息数量（后续替换为真实API）
      setUnreadCount(2)
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
        {/* 消息（带未读红点） */}
        <Link href="/user/messages" className="block bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-primary transition">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>💬 訊息</span>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <span className="text-gray-400 text-sm">查看全部</span>
          </div>
        </Link>

        <Link href="/tenant/register" className="block bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-primary transition">
          <div className="flex items-center justify-between">
            <span>🏪 入駐申請</span>
            <span className="text-gray-400 text-sm">開通服務號</span>
          </div>
        </Link>
        
        <Link href="/user/activities" className="block bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-primary transition">
          <div className="flex items-center justify-between">
            <span>📋 我的活動</span>
            <span className="text-gray-400 text-sm">0 場</span>
          </div>
        </Link>
        <Link href="/user/bookings" className="block bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-primary transition">
          <div className="flex items-center justify-between">
            <span>📅 我的預約</span>
            <span className="text-gray-400 text-sm">0 個</span>
          </div>
        </Link>
        <Link href="/user/branches" className="block bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-primary transition">
          <div className="flex items-center justify-between">
            <span>🏛️ 我的分會</span>
            <span className="text-gray-400 text-sm">尚未加入</span>
          </div>
        </Link>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 opacity-50">
          <div className="flex items-center justify-between">
            <span>⭐ 評分</span>
            <span className="text-gray-400 text-xs">即將推出</span>
          </div>
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