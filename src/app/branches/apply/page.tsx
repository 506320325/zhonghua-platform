'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const branchTypes = [
  { value: 'MEDIATION', label: '調解分會' },
  { value: 'LEGAL', label: '法律服務分會' },
  { value: 'CHARITY', label: '慈善分會' },
  { value: 'COMMUNITY', label: '社區分會' },
  { value: 'PROFESSIONAL', label: '專業分會' },
  { value: 'SUPPLY_CHAIN', label: '供應鏈分會' },
  { value: 'CUSTOM', label: '自定義' },
]

const communities = [
  '中環', '上環', '西環', '銅鑼灣', '灣仔', '跑馬地',
  '筲箕灣', '西灣河', '太古', '北角', '天后',
  '尖沙咀', '旺角', '油麻地', '佐敦', '深水埗',
  '九龍城', '黃大仙', '觀塘', '藍田', '將軍澳',
  '沙田', '火炭', '馬鞍山', '烏溪沙', '大圍',
  '大埔', '粉嶺', '上水', '屯門', '元朗', '荃灣',
]

export default function ApplyBranch() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    branchType: '',
    name: '',
    communityCode: '',
    category: '',
    description: '',
    termStart: '',
    termEnd: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setError('請先登入')
        router.push('/auth/login')
        return
      }

      const res = await fetch('/api/branches/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || '申請失敗')
        return
      }
      alert('分會申請已提交，請等待審核')
      router.push('/branches/my')
    } catch (err) {
      setError('網絡錯誤，請重試')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary">申請分會</h1>
        <Link href="/user" className="text-sm text-gray-500 hover:text-primary">返回</Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">分會類型 *</label>
          <select
            name="branchType"
            value={formData.branchType}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none"
            required
          >
            <option value="">請選擇</option>
            {branchTypes.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">分會名稱 *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="如：火炭調解分會"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">所在社區 *</label>
          <select
            name="communityCode"
            value={formData.communityCode}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none"
            required
          >
            <option value="">請選擇社區</option>
            {communities.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">專業分類（專業分會需要）</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="如：地產代理 / 保險"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">任職開始 *</label>
            <input
              type="date"
              name="termStart"
              value={formData.termStart}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">任職結束 *</label>
            <input
              type="date"
              name="termEnd"
              value={formData.termEnd}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">申請說明</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="請說明申請分會的理由和計劃..."
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-dark transition disabled:opacity-50"
        >
          {loading ? '提交中...' : '提交申請'}
        </button>
      </form>
    </div>
  )
}