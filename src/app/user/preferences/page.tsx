'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function UserPreferencesPage() {
  const router = useRouter()
  const [noAd, setNoAd] = useState(false)
  const [noEventNotify, setNoEventNotify] = useState(false)
  const [noAllNotify, setNoAllNotify] = useState(false)
  const [tags, setTags] = useState<any[]>([])
  const [tagUserId, setTagUserId] = useState('')
  const [tagName, setTagName] = useState('')
  const [tagNote, setTagNote] = useState('')
  const [msg, setMsg] = useState('')

  const load = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/login')
      return
    }
    const prefRes = await fetch('/api/user/preferences', { headers: { Authorization: `Bearer ${token}` } })
    const prefData = await prefRes.json()
    if (prefData.data) {
      setNoAd(!!prefData.data.noAd)
      setNoEventNotify(!!prefData.data.noEventNotify)
      setNoAllNotify(!!prefData.data.noAllNotify)
    }
  }

  useEffect(() => {
    load()
  }, [router])

  const savePref = async () => {
    const token = localStorage.getItem('token')
    if (!token) return
    const res = await fetch('/api/user/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ noAd, noEventNotify, noAllNotify }),
    })
    const data = await res.json()
    setMsg(res.ok ? data.message : (data.error || '保存失敗'))
  }

  const addTag = async () => {
    const token = localStorage.getItem('token')
    if (!token || !tagUserId || !tagName) return
    const res = await fetch('/api/user/tags', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId: tagUserId, tag: tagName, note: tagNote }),
    })
    const data = await res.json()
    setMsg(res.ok ? data.message : (data.error || '新增失敗'))
    if (res.ok) {
      setTagUserId('')
      setTagName('')
      setTagNote('')
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary">通知偏好與標記</h1>
        <Link href="/user" className="text-sm text-gray-500 hover:text-primary">返回</Link>
      </div>

      {msg && <div className="bg-blue-50 text-blue-700 text-sm p-3 rounded-xl mb-4">{msg}</div>}

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
        <h2 className="font-semibold text-gray-800 mb-3">我的通知偏好</h2>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={noAd} onChange={(e) => setNoAd(e.target.checked)} /> 不想收到廣告訊息</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={noEventNotify} onChange={(e) => setNoEventNotify(e.target.checked)} /> 不想收到活動通知</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={noAllNotify} onChange={(e) => setNoAllNotify(e.target.checked)} /> 不想收到任何通知</label>
        </div>
        <button onClick={savePref} className="mt-3 bg-primary text-white text-sm px-4 py-2 rounded-lg">保存</button>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h2 className="font-semibold text-gray-800 mb-3">內部標記</h2>
        <div className="space-y-2">
          <input value={tagUserId} onChange={(e) => setTagUserId(e.target.value)} placeholder="被標記用戶 ID" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm" />
          <input value={tagName} onChange={(e) => setTagName(e.target.value)} placeholder="標記：VIP / 黑名單 / 常客 / 待跟進" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm" />
          <input value={tagNote} onChange={(e) => setTagNote(e.target.value)} placeholder="備註" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm" />
          <button onClick={addTag} className="w-full bg-primary text-white py-2 rounded-lg text-sm">新增標記</button>
        </div>
      </div>
    </div>
  )
}
