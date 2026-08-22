'use client'

import { useEffect, useState } from 'react'

export default function EventComments({ eventId }: { eventId: string }) {
  const [comments, setComments] = useState<any[]>([])
  const [content, setContent] = useState('')
  const [message, setMessage] = useState('')

  const load = async () => {
    const token = localStorage.getItem('token')
    const headers: Record<string, string> = {}
    if (token) headers.Authorization = `Bearer ${token}`
    const res = await fetch(`/api/event-pages/${eventId}/comments`, { headers })
    const data = await res.json()
    if (res.ok) setComments(data.data || [])
  }

  useEffect(() => {
    load()
  }, [eventId])

  const submit = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setMessage('請先登入')
      return
    }
    if (!content.trim()) return
    const res = await fetch(`/api/event-pages/${eventId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    })
    const data = await res.json()
    if (!res.ok) {
      setMessage(data.error || '發佈失敗')
      return
    }
    setContent('')
    setMessage('')
    load()
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">評論</h2>
      <div className="space-y-3">
        {comments.length === 0 ? (
          <p className="text-sm text-gray-400">暫無評論</p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="border border-gray-100 rounded-xl p-3 text-sm">
              <p className="text-gray-800">{c.user?.nickname || c.user?.email}</p>
              <p className="text-gray-600 mt-1">{c.content}</p>
            </div>
          ))
        )}
      </div>
      <div className="flex gap-2 mt-4">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="寫下你的評論"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none"
        />
        <button onClick={submit} className="bg-primary text-white text-sm px-4 py-2 rounded-lg hover:bg-primary-dark transition">
          發佈
        </button>
      </div>
      {message && <p className="text-xs text-red-500 mt-2">{message}</p>}
    </div>
  )
}

