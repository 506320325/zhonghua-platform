'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function MyEventsPage() {
  const router = useRouter()
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/login')
      return
    }

    fetch('/api/event-pages?mine=1', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => setEvents(d.data || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false))
  }, [router])

  if (loading) return <div className="text-center py-12 text-gray-400">載入中...</div>

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary">我的活動主頁</h1>
        <Link href="/event/create" className="bg-primary text-white px-4 py-2 rounded-xl text-sm hover:bg-primary-dark transition">
          + 創建活動主頁
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12 text-gray-400">還沒有活動主頁</div>
      ) : (
        <div className="space-y-3">
          {events.map((e) => (
            <Link key={e.id} href={`/e/${e.slug}`} className="block bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-primary transition">
              <h3 className="font-semibold text-gray-800">{e.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{new Date(e.eventDate).toLocaleDateString('zh-HK')} · {e.location || ''}</p>
              <p className="text-xs text-gray-400 mt-1">狀態：{e.status}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
