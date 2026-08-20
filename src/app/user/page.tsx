'use client'

import Link from 'next/link'

export default function UserPage() {
  // 模拟已登录用户
  const isLoggedIn = true
  const user = { nickname: '測試用戶', email: 'test@example.com' }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-warm">
        <div className="text-center">
          <p className="text-gray-500 mb-4">請先登入</p>
          <Link href="/auth/login" className="text-primary hover:underline">前往登入</Link>
        </div>
      </div>
    )
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
            <h2 className="text-xl font-semibold">{user.nickname}</h2>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>
        </div>
      </div>

      {/* 功能列表 */}
      <div className="space-y-2">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
          <span>📋 我的活動</span>
          <span className="text-gray-400 text-sm">0 場</span>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
          <span>📅 我的預約</span>
          <span className="text-gray-400 text-sm">0 個</span>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
          <span>🏛️ 我的分會</span>
          <span className="text-gray-400 text-sm">尚未加入</span>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between opacity-50">
          <span>💬 評論</span>
          <span className="text-gray-400 text-xs">即將推出</span>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between opacity-50">
          <span>⭐ 評分</span>
          <span className="text-gray-400 text-xs">即將推出</span>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between opacity-50">
          <span>❤️ 關注</span>
          <span className="text-gray-400 text-xs">即將推出</span>
        </div>
      </div>
    </div>
  )
}