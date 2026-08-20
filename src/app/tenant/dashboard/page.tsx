'use client'

import { useState } from 'react'

export default function TenantDashboardPage() {
  const [stats] = useState({
    activities: 5,
    members: 128,
    signups: 34,
    posts: 12,
  })

  return (
    <div className="min-h-screen bg-warm px-4 py-6 pb-24">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-primary mb-2">租戶後台</h1>
        <p className="text-gray-500 text-sm mb-6">管理您的服務號</p>

        {/* 数据统计 */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-primary">{stats.activities}</p>
            <p className="text-xs text-gray-500">活動</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-primary">{stats.members}</p>
            <p className="text-xs text-gray-500">會員</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-primary">{stats.signups}</p>
            <p className="text-xs text-gray-500">預約</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-primary">{stats.posts}</p>
            <p className="text-xs text-gray-500">資訊</p>
          </div>
        </div>

        {/* 功能菜单 */}
        <div className="space-y-2">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition">
            <span>📢 發佈活動</span>
            <span className="text-gray-400">→</span>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition">
            <span>📋 預約管理</span>
            <span className="text-gray-400">→</span>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition">
            <span>👥 會員管理</span>
            <span className="text-gray-400">→</span>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition">
            <span>📊 統計報表</span>
            <span className="text-gray-400">→</span>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between opacity-50">
            <span>🤖 AI 智能客服</span>
            <span className="text-gray-400 text-xs">即將推出</span>
          </div>
        </div>
      </div>
    </div>
  )
}