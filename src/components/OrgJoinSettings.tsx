'use client'

import { useEffect, useState } from 'react'

export default function OrgJoinSettings({ type, id }: { type: 'page' | 'branch'; id: string }) {
  const [requiresApproval, setRequiresApproval] = useState(false)
  const [requiresReferrer, setRequiresReferrer] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    fetch(`/api/org/settings?type=${type}&id=${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.data) {
          setRequiresApproval(d.data.joinRequiresApproval || false)
          setRequiresReferrer(d.data.joinRequiresReferrer || false)
        }
      })
      .catch(() => {})
  }, [type, id])

  const save = async () => {
    const token = localStorage.getItem('token')
    if (!token) return
    const res = await fetch('/api/org/settings', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        type,
        id,
        joinRequiresApproval: requiresApproval,
        joinRequiresReferrer: requiresReferrer,
      }),
    })
    const data = await res.json()
    setMessage(res.ok ? data.message || '已儲存' : (data.error || '儲存失敗'))
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <h2 className="font-semibold text-gray-800 mb-3">加入設置</h2>
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={requiresApproval}
            onChange={(e) => setRequiresApproval(e.target.checked)}
          />
          加入需要審核
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={requiresReferrer}
            onChange={(e) => setRequiresReferrer(e.target.checked)}
          />
          加入需要推薦人
        </label>
      </div>
      <button onClick={save} className="mt-3 bg-primary text-white text-sm px-4 py-2 rounded-lg hover:bg-primary-dark transition">
        儲存設置
      </button>
      {message && <p className="text-xs text-gray-500 mt-2">{message}</p>}
    </div>
  )
}
