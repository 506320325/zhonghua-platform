'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DemandsPage() {
  const router = useRouter()
  const [items, setItems] = useState<any[]>([])
  const [type, setType] = useState('BUY')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [location, setLocation] = useState('')
  const [msg, setMsg] = useState('')

  const load = async () => {
    const res = await fetch('/api/demands')
    const data = await res.json()
    setItems(data.data || [])
  }

  useEffect(() => { load() }, [])

  const create = async () => {
    const token = localStorage.getItem('token')
    if (!token) { router.push('/auth/login'); return }
    const res = await fetch('/api/demands', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ type, title, content, location }),
    })
    const data = await res.json()
    setMsg(res.ok ? data.message : (data.error || '發布失敗'))
    if (res.ok) { setTitle(''); setContent(''); setLocation(''); load() }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-24">
      <h1 className="text-2xl font-bold text-primary mb-6">需求</h1>
      {msg && <div className="bg-blue-50 text-blue-700 text-sm p-3 rounded-xl mb-4">{msg}</div>}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
        <div className="grid grid-cols-2 gap-2 mb-2">
          <select value={type} onChange={(e) => setType(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm">
            <option value="BUY">買</option><option value="SELL">賣</option><option value="FIND">找</option><option value="HELP">幫</option><option value="ASK">問</option><option value="RECOMMEND">薦</option>
          </select>
          <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="地區" className="px-4 py-2 border border-gray-300 rounded-lg text-sm" />
        </div>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="標題" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm mb-2" />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={3} placeholder="內容" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm mb-2" />
        <button onClick={create} className="w-full bg-primary text-white py-2 rounded-lg text-sm">發布需求</button>
      </div>
      <div className="space-y-3">
        {items.length === 0 ? <p className="text-gray-400 text-center py-12">暫無需求</p> : items.map((d) => (
          <div key={d.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2"><span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{d.type}</span><span className="text-xs text-gray-400">{d.status}</span></div>
            <h3 className="font-semibold text-gray-800 mt-1">{d.title}</h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{d.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
