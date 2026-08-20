'use client'

export default function BranchDashboardPage() {
  return (
    <div className="min-h-screen bg-warm px-4 py-6 pb-24">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-primary mb-2">分會後台</h1>
        <p className="text-gray-500 text-sm mb-6">管理您的分會</p>

        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-2">
          <div className="bg-warm rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-600">分會狀態：<span className="text-green-600 font-medium">已批准</span></p>
            <p className="text-sm text-gray-600">任職期間：2026-08-01 至 2027-07-31</p>
          </div>

          <div className="space-y-2 mt-4">
            <div className="bg-white rounded-xl p-4 border border-gray-100 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition">
              <span>📋 分會資訊</span>
              <span className="text-gray-400">→</span>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition">
              <span>👥 成員管理</span>
              <span className="text-gray-400">→</span>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition">
              <span>📢 活動管理</span>
              <span className="text-gray-400">→</span>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 flex items-center justify-between opacity-50">
              <span>📊 數據統計</span>
              <span className="text-gray-400 text-xs">即將推出</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}