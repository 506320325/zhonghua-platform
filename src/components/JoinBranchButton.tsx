'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function JoinBranchButton({ branchId }: { branchId: string }) {
  const router = useRouter()
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
        body: JSON.stringify({ branchId }),
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
    <div>
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
