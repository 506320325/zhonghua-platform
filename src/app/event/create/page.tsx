'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CreateEventPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '',
    description: '',
    eventDate: '',
    endDate: '',
    location: '',
    organizers: '',
    coOrganizers: '',
    supportingOrgs: '',
    participantOrgs: '',
    guests: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const splitList = (v: string) => v.split(/[,，]/).map((x) => x.trim()).filter(Boolean)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/login')
      return
    }

    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/event-pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          eventDate: form.eventDate,
          endDate: form.endDate || null,
          location: form.location,
          organizers: splitList(form.organizers).map((name) => ({ name, role: 'organizer' })),
          coOrganizers: splitList(form.coOrganizers).map((name) => ({ name, role: 'co_organizer' })),
          supportingOrgs: splitList(form.supportingOrgs).map((name) => ({ name, role: 'supporter' })),
          participantOrgs: splitList(form.participantOrgs).map((name) => ({ name, role: 'participant' })),
          guests: splitList(form.guests).map((name) => ({ name })),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || '創建失敗')
        return
      }
      router.push(`/e/${data.event.slug}`)
    } catch {
      setError('網絡錯誤，請重試')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary">創建活動主頁</h1>
        <Link href="/user/events" className="text-sm text-gray-500 hover:text-primary">返回</Link>
      </div>

      {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">活動標題 *</label>
          <input name="title" value={form.title} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">活動簡介</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-xl" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">開始日期 *</label>
            <input type="date" name="eventDate" value={form.eventDate} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">結束日期</label>
            <input type="date" name="endDate" value={form.endDate} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">地點</label>
          <input name="location" value={form.location} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">主辦方</label>
          <input name="organizers" value={form.organizers} onChange={handleChange} placeholder="多個用逗號分隔" className="w-full px-4 py-3 border border-gray-300 rounded-xl" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">協辦方</label>
          <input name="coOrganizers" value={form.coOrganizers} onChange={handleChange} placeholder="多個用逗號分隔" className="w-full px-4 py-3 border border-gray-300 rounded-xl" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">支持機構</label>
          <input name="supportingOrgs" value={form.supportingOrgs} onChange={handleChange} placeholder="多個用逗號分隔" className="w-full px-4 py-3 border border-gray-300 rounded-xl" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">參加單位</label>
          <input name="participantOrgs" value={form.participantOrgs} onChange={handleChange} placeholder="多個用逗號分隔" className="w-full px-4 py-3 border border-gray-300 rounded-xl" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">嘉賓</label>
          <input name="guests" value={form.guests} onChange={handleChange} placeholder="多個用逗號分隔" className="w-full px-4 py-3 border border-gray-300 rounded-xl" />
        </div>

        <button disabled={loading} className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-dark transition disabled:opacity-50">
          {loading ? '創建中...' : '創建活動主頁'}
        </button>
      </form>
    </div>
  )
}
