'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const orgTypes = [
  { value: 'MERCHANT', label: '商戶（商業登記）' },
  { value: 'ASSOCIATION', label: '社團/協會（政府登記）' },
  { value: 'FELLOWSHIP', label: '聯誼會/同鄉會（自發組織）' },
  { value: 'ALUMNI', label: '校友會' },
  { value: 'SPORTS', label: '運動/興趣團體（自發組織）' },
  { value: 'OTHER', label: '其他' },
]

const categories = [
  '資訊服務', '物品交易', '商業服務', '社區服務',
  '教育服務', '醫療健康', '預約服務', '娛樂休閒',
  '房產與交通', '其他',
]

const communities = [
  '中環', '上環', '西環', '銅鑼灣', '灣仔', '跑馬地',
  '筲箕灣', '西灣河', '太古', '北角', '天后',
  '尖沙咀', '旺角', '油麻地', '佐敦', '深水埗',
  '九龍城', '黃大仙', '觀塘', '藍田', '將軍澳',
  '沙田', '火炭', '馬鞍山', '烏溪沙', '大圍',
  '大埔', '粉嶺', '上水', '屯門', '元朗', '荃灣',
]

export default function CreatePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    category: '',
    communityCode: '',
    phone: '',
    email: '',
    description: '',
    // 认证材料
    certType: 'declaration', // declaration / business / government
    certFile: null as File | null,
    certNumber: '',
    parentOrg: '',
    declaration: '',
  })
  const [agreed, setAgreed] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, certFile: e.target.files[0] })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!agreed) {
      setError('請先同意《私隱條例》和《平台條例》')
      setLoading(false)
      return
    }

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setError('請先登入')
        router.push('/auth/login')
        return
      }

      // 构建提交数据
      const submitData = {
        name: formData.name,
        type: formData.type,
        category: formData.category,
        communityCode: formData.communityCode,
        phone: formData.phone,
        email: formData.email,
        description: formData.description,
        certType: formData.certType,
        certNumber: formData.certNumber,
        parentOrg: formData.parentOrg,
        declaration: formData.declaration,
      }

      const res = await fetch('/api/pages/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submitData),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || '提交失敗')
        return
      }
      alert('主頁申請已提交，請等待審核')
      router.push('/pages/my')
    } catch (err) {
      setError('網絡錯誤，請重試')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary">建立主頁</h1>
        <Link href="/user" className="text-sm text-gray-500 hover:text-primary">返回</Link>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-sm text-blue-700">
        <p className="font-medium">📌 建立主頁需要：</p>
        <ul className="list-disc list-inside mt-1 space-y-0.5 text-blue-600">
          <li>商業登記 / 政府登記 / 負責人聲明（三選一）</li>
          <li>同意《私隱條例》和《平台條例》</li>
        </ul>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">主頁名稱 *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="如：火炭羽毛球會"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">組織類型 *</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none"
            required
          >
            <option value="">請選擇類型</option>
            {orgTypes.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">行業分類 *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none"
            required
          >
            <option value="">請選擇行業</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">電話</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+852"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">電郵</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="contact@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">組織簡介</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="介紹您的組織..."
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none resize-none"
          />
        </div>

        {/* 认证方式 */}
        <div className="border-t border-gray-200 pt-5">
          <p className="font-medium text-gray-700 mb-3">認證方式 *</p>
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="certType"
                value="business"
                checked={formData.certType === 'business'}
                onChange={handleChange}
              />
              <span>商業登記證</span>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="certType"
                value="government"
                checked={formData.certType === 'government'}
                onChange={handleChange}
              />
              <span>政府部門登記 / 授權信</span>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="certType"
                value="declaration"
                checked={formData.certType === 'declaration'}
                onChange={handleChange}
              />
              <span>負責人聲明（自發組織）</span>
            </label>
          </div>
        </div>

        {(formData.certType === 'business' || formData.certType === 'government') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">證件編號</label>
            <input
              type="text"
              name="certNumber"
              value={formData.certNumber}
              onChange={handleChange}
              placeholder="請輸入證件編號"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
        )}

        {formData.certType === 'declaration' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">聲明內容</label>
            <textarea
              name="declaration"
              value={formData.declaration}
              onChange={handleChange}
              rows={3}
              placeholder="本人聲明：此組織為自發成立，...（請簡述組織性質和負責人）"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none resize-none"
            />
          </div>
        )}

        {formData.certType === 'government' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">上級機構名稱</label>
            <input
              type="text"
              name="parentOrg"
              value={formData.parentOrg}
              onChange={handleChange}
              placeholder="如：XX大學學生事務處"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
        )}

        {/* 条例勾选 */}
        <div className="border-t border-gray-200 pt-5">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1"
              required
            />
            <span className="text-sm text-gray-600">
              我已閱讀並同意 <a href="#" className="text-primary hover:underline">《私隱條例》</a> 和{' '}
              <a href="#" className="text-primary hover:underline">《平台條例》</a>
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-dark transition disabled:opacity-50"
        >
          {loading ? '提交中...' : '提交審核'}
        </button>
      </form>
    </div>
  )
}