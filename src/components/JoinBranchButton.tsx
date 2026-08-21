'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function JoinBranchButton({ branchId }: { branchId: string }) {
  const router = useRouter()
  const [referrerEmail, setReferrerEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleJoin = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/login')
      return
    }

    setLoading(true)
    setMessage('')
    try {
      const res = await fetch('/api/branches/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ branchId, referrerEmail }),
      })
      const data = await res.json()
      if (!res.ok) {
        setMessage(data.error || '加入失敗')
        return
      }
      setMessage(data.message || '已加入分會')
    } catch {
      setMessage('網絡錯誤，請重試')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <input
        type="email"
        value={referrerEmail}
        onChange={(e) => setReferrerEmail(e.target.value)}
        placeholder="推薦人 Email（如需要）"
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none"
      />
      <button
        onClick={handleJoin}
        disabled={loading}
        className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-dark transition disabled:opacity-50"
      >
        {loading ? '加入中...' : '加入分會'}
      </button>
      {message && <p className="text-sm text-gray-500 mt-2 text-center">{message}</p>}
    </div>
  )
}
