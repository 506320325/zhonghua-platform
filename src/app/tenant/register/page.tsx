'use client'

import { useState } from 'react'

export default function TenantRegisterPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    communityCode: '',
    phone: '',
    email: '',
    description: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('租戶入駐申請已提交（模擬）')
  }

  return (
    <div className="min-h-screen bg-warm px-4 py-6 pb-24">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-primary mb-2">租戶入駐</h1>
        <p className="text-gray-500 text-sm mb-6">選擇行業分類和社區，立即開通服務號</p>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">服務號名稱 *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none"
              placeholder="如：火炭社區商會"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">行業分類 *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none"
              required
            >
              <option value="">請選擇行業</option>
              <option value="info">資訊服務</option>
              <option value="trade">物品交易</option>
              <option value="biz">商業服務</option>
              <option value="community">社區服務</option>
              <option value="edu">教育服務</option>
              <option value="health">醫療健康</option>
              <option value="booking">預約服務</option>
              <option value="entertainment">娛樂休閒</option>
              <option value="property">房產與交通</option>
              <option value="others">其他</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">所在社區 *</label>
            <select
              value={formData.communityCode}
              onChange={(e) => setFormData({ ...formData, communityCode: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none"
              required
            >
              <option value="">請選擇社區</option>
              <option value="81010101">中環</option>
              <option value="81010108">西環</option>
              <option value="81010204">銅鑼灣</option>
              <option value="81010306">筲箕灣</option>
              <option value="81010323">火炭</option>
              <option value="81030301">沙田市中心</option>
              <option value="81030323">火炭</option>
              <option value="81030329">烏溪沙</option>
              <option value="81030334">恆安</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">電話</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                placeholder="+852"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">電郵</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                placeholder="contact@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">服務描述</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none resize-none"
              rows={3}
              placeholder="介紹您的服務或組織..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-dark transition"
          >
            提交入駐申請
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-4">
          提交後將由平台審核，審核通過後即可開通服務號
        </p>
      </div>
    </div>
  )
}