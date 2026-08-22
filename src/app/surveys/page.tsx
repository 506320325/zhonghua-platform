'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SurveysPage() {
  const router = useRouter()
  const [items, setItems] = useState<any[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [questions, setQuestions] = useState('[{"type":"radio","question":"您的意見？","options":["A","B"]}]')
  const [msg, setMsg] = useState('')

  const load = async () => {
    const res = await fetch('/api/surveys')
    const data = await res.json()
    setItems(data.data || [])
  }

  useEffect(() => { load() }, [])

  const create = async () => {
    const token = localStorage.getItem('token')
    if (!token) { router.push('/auth/login'); return }
    let qs
    try { qs = JSON.parse(questions) } catch { setMsg('問題格式必須是 JSON'); return }
    const res = await fetch('/api/surveys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title, description, questions: qs }),
    })
    const data = await res.json()
    setMsg(res.ok ? data.message : (data.error || '發佈失敗'))
    if (res.ok) load()
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-24">
      <h1 className="text-2xl font-bold text-primary mb-6">問卷</h1>
      {msg && <div className="bg-blue-50 text-blue-700 text-sm p-3 rounded-xl mb-4">{msg}</div>}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="問卷標題" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm mb-2" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="說明" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm mb-2" />
        <textarea value={questions} onChange={(e) => setQuestions(e.target.value)} rows={5} placeholder="問題 JSON" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm mb-2" />
        <button onClick={create} className="w-full bg-primary text-white py-2 rounded-lg text-sm">發佈問卷</button>
      </div>
      <div className="space-y-3">
        {items.length === 0 ? <p className="text-gray-400 text-center py-12">暫無問卷</p> : items.map((s) => (
          <div key={s.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800">{s.title}</h3>
            <p className="text-xs text-gray-400 mt-1">已填 {s.responseCount} 人</p>
          </div>
        ))}
      </div>
    </div>
  )
}
