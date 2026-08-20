'use client'

import { useState } from 'react'

export default function BranchApplyPage() {
  const [formData, setFormData] = useState({
    branchType: '',
    name: '',
    communityCode: '',
    category: '',
    description: '',
    termStart: '',
    termEnd: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('分會申請已提交（模擬）')
  }

  return (
    <div className="min-h-screen bg-warm px-4 py-6 pb-24">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-primary mb-2">申請分會</h1>
        <p className="text-gray-500 text-sm mb-6">成為中華促進會的分會會長</p>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">分會類型 *</label>
            <select
              value={formData.branchType}
              onChange={(e) => setFormData({ ...formData, branchType: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none"
              required
            >
              <option value="">請選擇</option>
              <option value="MEDIATION">調解分會</option>
              <option value="LEGAL">法律服務分會</option>
              <option value="CHARITY">慈善分會</option>
              <option value="COMMUNITY">社區分會</option>
              <option value="PROFESSIONAL">專業分會</option>
              <option value="SUPPLY_CHAIN">供應鏈分會</option>
              <option value="CUSTOM">自定義</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">分會名稱 *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none"
              placeholder="如：火炭調解分會"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">所在社區 *</label>
            <select
              value={formData.communityCode}
              onChange={(e) => setFormData({ ...formData, communityCode: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none"
              required
            >
              <option value="">請選擇</option>
              <option value="81010101">中環</option>
              <option value="81010108">西環</option>
              <option value="81010204">銅鑼灣</option>
              <option value="81010323">火炭</option>
              <option value="81030301">沙田市中心</option>
              <option value="81030329">烏溪沙</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">專業分類（專業分會需要）</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none"
              placeholder="如：地產代理 / 保險"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">任職開始 *</label>
              <input
                type="date"
                value={formData.termStart}
                onChange={(e) => setFormData({ ...formData, termStart: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">任職結束 *</label>
              <input
                type="date"
                value={formData.termEnd}
                onChange={(e) => setFormData({ ...formData, termEnd: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">申請說明</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none resize-none"
              rows={3}
              placeholder="請說明您申請分會的理由和計劃..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-dark transition"
          >
            提交分會申請
          </button>
        </form>
      </div>
    </div>
  )
}