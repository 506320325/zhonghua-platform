'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AnnouncementsPage() {
  const router = useRouter()
  const [items, setItems] = useState<any[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [msg, setMsg] = useState('')

  const load = async () => {
    const res = await fetch('/api/announcements?scope=PLATFORM')
    const data = await res.json()
    setItems(data.data || [])
  }

  useEffect(() => {
    load()
  }, [])

  const publish = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/login')
      return
    }
    const res = await fetch('/api/announcements', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content, scope: 'PLATFORM' }),
    })
    const data = await res.json()
    setMsg(res.ok ? data.message : (data.error || '發佈失敗'))
    if (res.ok) {
      setTitle('')
      setContent('')
      load()
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary">公告</h1>
        <Link href="/" className="text-sm text-gray-500 hover:text-primary">返回</Link>
      </div>

      {msg && <div className="bg-blue-50 text-blue-700 text-sm p-3 rounded-xl mb-4">{msg}</div>}

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
        <h2 className="font-semibold text-gray-800 mb-3">發佈平台公告</h2>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="公告標題" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm mb-2" />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4} placeholder="公告內容" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm mb-2" />
        <button onClick={publish} className="bg-primary text-white text-sm px-4 py-2 rounded-lg">發佈</button>
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-gray-400 text-sm">暫無公告</p>
        ) : (
          items.map((a) => (
            <div key={a.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800">{a.title}</h3>
              <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{a.content}</p>
              <p className="text-xs text-gray-400 mt-2">{new Date(a.createdAt).toLocaleString('zh-HK')}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
