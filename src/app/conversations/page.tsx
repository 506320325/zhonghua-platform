'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ConversationsPage() {
  const router = useRouter()
  const [items, setItems] = useState<any[]>([])
  const [msg, setMsg] = useState('')

  const load = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/login')
      return
    }
    const res = await fetch('/api/conversations', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    setItems(data.data || [])
  }

  useEffect(() => {
    load()
  }, [router])

  const startPlatform = async () => {
    const token = localStorage.getItem('token')
    if (!token) return
    const res = await fetch('/api/conversations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ type: 'USER_TO_PLATFORM' }),
    })
    const data = await res.json()
    if (res.ok) {
      router.push(`/conversations/${data.data.id}`)
    } else {
      setMsg(data.error || '操作失敗')
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary">在線會話</h1>
        <Link href="/user" className="text-sm text-gray-500 hover:text-primary">返回</Link>
      </div>

      {msg && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4">{msg}</div>}

      <button onClick={startPlatform} className="w-full bg-primary text-white py-3 rounded-xl mb-6">
        發起平台客服會話
      </button>

      {items.length === 0 ? (
        <p className="text-gray-400 text-center py-12">暫無會話</p>
      ) : (
        <div className="space-y-3">
          {items.map((c) => (
            <Link key={c.id} href={`/conversations/${c.id}`} className="block bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-primary">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800">{c.type}</span>
                <span className="text-xs text-gray-400">
                  {c.messages?.[0] ? new Date(c.messages[0].createdAt).toLocaleString('zh-HK') : ''}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1 truncate">{c.messages?.[0]?.content || '尚未開始對話'}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
