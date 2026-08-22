'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function BookingsPage() {
  const router = useRouter()
  const [items, setItems] = useState<any[]>([])
  const [serviceName, setServiceName] = useState('')
  const [bookingTime, setBookingTime] = useState('')
  const [duration, setDuration] = useState('')
  const [msg, setMsg] = useState('')

  const load = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/login')
      return
    }
    const res = await fetch('/api/bookings?mine=1', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    setItems(data.data || [])
  }

  useEffect(() => {
    load()
  }, [router])

  const create = async () => {
    const token = localStorage.getItem('token')
    if (!token) return
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ serviceName, bookingTime, duration }),
    })
    const data = await res.json()
    setMsg(res.ok ? data.message : (data.error || '預約失敗'))
    if (res.ok) {
      setServiceName('')
      setBookingTime('')
      setDuration('')
      load()
    }
  }

  const update = async (id: string, status: string) => {
    const token = localStorage.getItem('token')
    if (!token) return
    const res = await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    })
    if (res.ok) load()
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary">預約</h1>
        <Link href="/user" className="text-sm text-gray-500 hover:text-primary">返回</Link>
      </div>

      {msg && <div className="bg-blue-50 text-blue-700 text-sm p-3 rounded-xl mb-4">{msg}</div>}

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
        <h2 className="font-semibold text-gray-800 mb-3">新增預約</h2>
        <div className="space-y-2">
          <input value={serviceName} onChange={(e) => setServiceName(e.target.value)} placeholder="服務名稱" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm" />
          <input type="datetime-local" value={bookingTime} onChange={(e) => setBookingTime(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm" />
          <input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="時長（分鐘）" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm" />
          <button onClick={create} className="w-full bg-primary text-white py-2 rounded-lg text-sm">提交預約</button>
        </div>
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-gray-400 text-center py-12">暫無預約</p>
        ) : (
          items.map((b) => (
            <div key={b.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">{b.serviceName}</h3>
                  <p className="text-sm text-gray-500 mt-1">{new Date(b.bookingTime).toLocaleString('zh-HK')}</p>
                  <p className="text-xs text-gray-400 mt-1">狀態：{b.status}</p>
                </div>
                <div className="flex gap-2">
                  {b.status === 'PENDING' && <button onClick={() => update(b.id, 'CONFIRMED')} className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">確認</button>}
                  {b.status === 'CONFIRMED' && <button onClick={() => update(b.id, 'COMPLETED')} className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">完成</button>}
                  <button onClick={() => update(b.id, 'CANCELLED')} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">取消</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
