'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function InvitesPage() {
  const router = useRouter()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  const load = async () => {
    try {
      const res = await fetch('/api/posts?type=INVITE')
      const data = await res.json()
      setItems(data.data || [])
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const join = async (id: string) => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/login')
      return
    }
    const res = await fetch(`/api/posts/${id}/join`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    setMsg(res.ok ? data.message : (data.error || '操作失敗'))
    if (res.ok) load()
  }

  const leave = async (id: string) => {
    const token = localStorage.getItem('token')
    if (!token) return
    const res = await fetch(`/api/posts/${id}/join`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    setMsg(res.ok ? data.message : (data.error || '操作失敗'))
    if (res.ok) load()
  }

  if (loading) return <div className="text-center py-12 text-gray-400">載入中...</div>

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary">🔥 揪局中</h1>
        <Link href="/posts/create" className="bg-primary text-white px-4 py-2 rounded-xl text-sm hover:bg-primary-dark transition">
          + 發起邀約
        </Link>
      </div>

      {msg && <div className="bg-blue-50 text-blue-700 text-sm p-3 rounded-xl mb-4">{msg}</div>}

      {items.length === 0 ? (
        <div className="text-center py-12 text-gray-400">暫無邀約</div>
      ) : (
        <div className="space-y-3">
          {items.map((post) => (
            <div key={post.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-gray-800">{post.title || post.content?.slice(0, 30)}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {post.inviteCategory || '邀約'} · {post.location || '地點待定'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    已報 {post.currentCount || 0} / {post.maxParticipants || '不限'}
                    {post.deadline ? ` · 截止 ${new Date(post.deadline).toLocaleString('zh-HK')}` : ''}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  {post.status === 'FULL' ? (
                    <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full">已滿</span>
                  ) : (
                    <button onClick={() => join(post.id)} className="text-xs bg-primary text-white px-3 py-1 rounded-full">
                      我去
                    </button>
                  )}
                  {post.currentCount > 0 && (
                    <button onClick={() => leave(post.id)} className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
                      取消
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
