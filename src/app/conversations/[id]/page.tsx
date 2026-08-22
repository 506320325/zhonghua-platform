'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ConversationPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [messages, setMessages] = useState<any[]>([])
  const [content, setContent] = useState('')

  const load = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/login')
      return
    }
    const res = await fetch(`/api/conversations/${id}/messages`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    setMessages(data.data || [])
  }

  useEffect(() => {
    load()
  }, [id])

  const send = async () => {
    const token = localStorage.getItem('token')
    if (!token || !content.trim()) return
    const res = await fetch(`/api/conversations/${id}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    })
    if (res.ok) {
      setContent('')
      load()
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary">對話</h1>
        <Link href="/conversations" className="text-sm text-gray-500 hover:text-primary">返回</Link>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-3 min-h-[300px]">
        {messages.length === 0 ? (
          <p className="text-gray-400 text-sm">暫無訊息</p>
        ) : (
          messages.map((m) => (
            <div key={m.id} className="border border-gray-100 rounded-xl p-3 text-sm">
              <p className="text-gray-800">{m.sender?.nickname || m.sender?.email || m.senderId}</p>
              <p className="text-gray-600 mt-1">{m.content}</p>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2 mt-4">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="輸入訊息"
          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none"
        />
        <button onClick={send} className="bg-primary text-white px-5 py-3 rounded-xl">發送</button>
      </div>
    </div>
  )
}
