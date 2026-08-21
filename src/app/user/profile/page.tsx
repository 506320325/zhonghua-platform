'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function UserProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({
    nickname: '',
    education: '',
    skills: '',
    hobbies: '',
    bio: '',
    tags: '',
    pets: '',
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/login')
      return
    }

    const load = async () => {
      try {
        const res = await fetch('/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (res.ok && data.user) {
          setForm({
            nickname: data.user.nickname || '',
            education: data.user.education || '',
            skills: data.user.skills || '',
            hobbies: data.user.hobbies || '',
            bio: data.user.bio || '',
            tags: data.user.tags || '',
            pets: data.user.pets || '',
          })
        } else {
          setMessage(data.error || '讀取失敗')
        }
      } catch {
        setMessage('網絡錯誤')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    if (!token) return

    setSaving(true)
    setMessage('')
    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setMessage(data.error || '儲存失敗')
        return
      }
      setMessage('已儲存')
    } catch {
      setMessage('網絡錯誤')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-400">載入中...</div>
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary">個人資料</h1>
        <Link href="/user" className="text-sm text-gray-500 hover:text-primary">返回</Link>
      </div>

      {message && (
        <div className="bg-blue-50 text-blue-700 text-sm p-3 rounded-xl mb-4">{message}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">暱稱</label>
          <input
            type="text"
            name="nickname"
            value={form.nickname}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">學歷</label>
          <input
            type="text"
            name="education"
            value={form.education}
            onChange={handleChange}
            placeholder="例如：大學 / 碩士 / 專業資格"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">特長</label>
          <input
            type="text"
            name="skills"
            value={form.skills}
            onChange={handleChange}
            placeholder="例如：維修、補習、攝影、法律"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">愛好</label>
          <input
            type="text"
            name="hobbies"
            value={form.hobbies}
            onChange={handleChange}
            placeholder="例如：羽毛球、行山、烹飪"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">個人簡介</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows={4}
            placeholder="介紹一下自己..."
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">標籤</label>
          <input
            type="text"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="用逗號分隔，例如：義工, 社區, 羽毛球"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">寵物</label>
          <input
            type="text"
            name="pets"
            value={form.pets}
            onChange={handleChange}
            placeholder="例如：貓 x2、狗 x1"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-dark transition disabled:opacity-50"
        >
          {saving ? '儲存中...' : '儲存'}
        </button>
      </form>
    </div>
  )
}
