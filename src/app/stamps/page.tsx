'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const patterns = ['誠心', '可靠', '推薦', '靠譜', '熱心', '專業', '友善', '承諾']
const colorMap: Record<string, string> = {
  '誠心': 'bg-yellow-100 text-yellow-700',
  '可靠': 'bg-blue-100 text-blue-700',
  '推薦': 'bg-red-100 text-red-700',
  '靠譜': 'bg-green-100 text-green-700',
  '熱心': 'bg-orange-100 text-orange-700',
  '專業': 'bg-purple-100 text-purple-700',
  '友善': 'bg-pink-100 text-pink-700',
  '承諾': 'bg-gray-100 text-gray-700',
}

export default function StampsPage() {
  const router = useRouter()
  const [remaining, setRemaining] = useState(0)
  const [toType, setToType] = useState('user')
  const [toId, setToId] = useState('')
  const [pattern, setPattern] = useState('誠心')
  const [message, setMessage] = useState('')
  const [received, setReceived] = useState<any[]>([])
  const [sent, setSent] = useState<any[]>([])
  const [feedback, setFeedback] = useState('')

  const load = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/login')
      return
    }
    try {
      const [todayRes, recvRes, sentRes] = await Promise.all([
        fetch('/api/stamps/today', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/stamps/received', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/stamps/sent', { headers: { Authorization: `Bearer ${token}` } }),
      ])
      const today = await todayRes.json()
      const recv = await recvRes.json()
      const sentData = await sentRes.json()
      if (today.remaining !== undefined) setRemaining(today.remaining)
      setReceived(recv.data || [])
      setSent(sentData.data || [])
    } catch {
      setFeedback('讀取失敗')
    }
  }

  useEffect(() => {
    load()
  }, [router])

  const sendStamp = async () => {
    const token = localStorage.getItem('token')
    if (!token) return
    setFeedback('')
    const res = await fetch('/api/stamps', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ toType, toId, pattern, message }),
    })
    const data = await res.json()
    if (!res.ok) {
      setFeedback(data.error || '貼信貼失敗')
      return
    }
    setFeedback(data.message || '已貼出')
    setToId('')
    setMessage('')
    load()
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary">信貼牆</h1>
        <Link href="/user" className="text-sm text-gray-500 hover:text-primary">返回</Link>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
        <p className="text-sm text-gray-600">今日尚有 <span className="text-primary font-bold text-xl">{remaining}</span> 張信貼</p>
        <p className="text-xs text-gray-400 mt-1">“今日你有 3 張信貼，貼俾你信得過嘅人。”</p>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
        <h2 className="font-semibold text-gray-800 mb-3">貼信貼</h2>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <select value={toType} onChange={(e) => setToType(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm">
              <option value="user">個人</option>
              <option value="branch">分會</option>
              <option value="tenant">租戶</option>
            </select>
            <input value={toId} onChange={(e) => setToId(e.target.value)} placeholder="對象 ID" className="px-4 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {patterns.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPattern(p)}
                className={`text-xs px-3 py-1 rounded-full ${colorMap[p]} ${pattern === p ? 'ring-2 ring-primary' : ''}`}
              >
                {p}
              </button>
            ))}
          </div>
          <input value={message} onChange={(e) => setMessage(e.target.value)} maxLength={20} placeholder="留言（20字以內）" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm" />
          <button onClick={sendStamp} className="w-full bg-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition">
            貼出信貼
          </button>
          {feedback && <p className="text-xs text-gray-500">{feedback}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-800 mb-3">我收到的</h2>
          {received.length === 0 ? (
            <p className="text-sm text-gray-400">暫無</p>
          ) : (
            <div className="space-y-2">
              {received.map((s) => (
                <div key={s.id} className="text-sm border border-gray-100 rounded-xl p-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${colorMap[s.pattern]}`}>{s.pattern}</span>
                  <p className="text-gray-600 mt-1">{s.fromUser?.nickname || s.fromUser?.email} {s.message ? `| ${s.message}` : ''}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-800 mb-3">我發出的</h2>
          {sent.length === 0 ? (
            <p className="text-sm text-gray-400">暫無</p>
          ) : (
            <div className="space-y-2">
              {sent.map((s) => (
                <div key={s.id} className="text-sm border border-gray-100 rounded-xl p-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${colorMap[s.pattern]}`}>{s.pattern}</span>
                  <p className="text-gray-600 mt-1">{s.toUser?.nickname || s.toUser?.email} {s.message ? `| ${s.message}` : ''}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
