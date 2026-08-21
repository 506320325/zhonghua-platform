'use client'

import { useEffect, useState } from 'react'

interface JoinRequest {
  id: string
  user: { nickname?: string | null; email?: string | null; phone?: string | null }
  referrerEmail?: string | null
  createdAt: string
}

export default function JoinRequests({ branchId }: { branchId: string }) {
  const [requests, setRequests] = useState<JoinRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const load = async () => {
    const token = localStorage.getItem('token')
    if (!token) return
    try {
      const res = await fetch(`/api/org/join-requests?type=branch&id=${branchId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (res.ok) setRequests(data.data || [])
    } catch {
      setRequests([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [branchId])

  const handle = async (id: string, action: 'approve' | 'reject') => {
    const token = localStorage.getItem('token')
    if (!token) return
    const res = await fetch('/api/org/join-requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id, action }),
    })
    const data = await res.json()
    setMessage(res.ok ? data.message : (data.error || '操作失敗'))
    if (res.ok) load()
  }

  if (loading) return <p className="text-gray-400 text-sm">載入中...</p>

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <h2 className="font-semibold text-gray-800 mb-3">加入審核</h2>
      {requests.length === 0 ? (
        <p className="text-sm text-gray-400">暫無待審核加入申請</p>
      ) : (
        <div className="space-y-3">
          {requests.map((r) => (
            <div key={r.id} className="border border-gray-100 rounded-xl p-3 text-sm">
              <p className="text-gray-700">
                {r.user.nickname || r.user.email || r.user.phone}
              </p>
              {r.referrerEmail && (
                <p className="text-xs text-gray-400 mt-1">推薦人：{r.referrerEmail}</p>
              )}
              <div className="flex gap-2 mt-2">
                <button onClick={() => handle(r.id, 'approve')} className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full hover:bg-primary/20">
                  通過
                </button>
                <button onClick={() => handle(r.id, 'reject')} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full hover:bg-gray-200">
                  拒絕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {message && <p className="text-xs text-gray-500 mt-2">{message}</p>}
    </div>
  )
}
