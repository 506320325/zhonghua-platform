'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Application {
  type: 'page' | 'branch'
  id: string
  slug: string
  name: string
  category?: string
  branchType?: string
  communityCode: string
  status: string
  applicant: string
  createdAt: string
}

export default function AdminPage() {
  const [items, setItems] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [hasToken, setHasToken] = useState(false)
  const [error, setError] = useState('')
  const [actionId, setActionId] = useState('')
  const [videoEmail, setVideoEmail] = useState('')
  const [videoMsg, setVideoMsg] = useState('')
  const [reports, setReports] = useState<any[]>([])
  const [reportsLoading, setReportsLoading] = useState(false)

  const load = async () => {
    const token = localStorage.getItem('token')
    setHasToken(!!token)
    if (!token) {
      setError('請先登入')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/admin/applications', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || '讀取失敗')
        return
      }
      setItems(data.data || [])
    } catch (err) {
      setError('網絡錯誤，請重試')
    } finally {
      setLoading(false)
    }
  }

  const loadReports = async () => {
    const token = localStorage.getItem('token')
    if (!token) return
    setReportsLoading(true)
    try {
      const res = await fetch('/api/admin/reports', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (res.ok) setReports(data.data || [])
    } catch {
      setReports([])
    } finally {
      setReportsLoading(false)
    }
  }

  useEffect(() => {
    load()
    loadReports()
  }, [])

  const handleAction = async (item: Application, action: 'approve' | 'reject') => {
    const token = localStorage.getItem('token')
    if (!token) return

    setActionId(`${item.type}-${item.id}`)
    setError('')

    try {
      const res = await fetch('/api/admin/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: item.type,
          id: item.id,
          action,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || '操作失敗')
        return
      }
      setItems((prev) => prev.filter((x) => !(x.type === item.type && x.id === item.id)))
    } catch (err) {
      setError('網絡錯誤，請重試')
    } finally {
      setActionId('')
    }
  }

  const statusLabel = (status: string) => {
    if (status === 'APPROVED') return { label: '已通過', color: 'bg-green-100 text-green-700' }
    if (status === 'REJECTED') return { label: '已拒絕', color: 'bg-red-100 text-red-700' }
    return { label: '待審批', color: 'bg-yellow-100 text-yellow-700' }
  }

  const typeLabel = (type: string) => (type === 'page' ? '主頁' : '分會')

  const handleVideoPermission = async (canPublishVideo: boolean) => {
    const token = localStorage.getItem('token')
    if (!token || !videoEmail) return
    setVideoMsg('')
    try {
      const res = await fetch('/api/admin/users/video-permission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ email: videoEmail, canPublishVideo }),
      })
      const data = await res.json()
      if (!res.ok) {
        setVideoMsg(data.error || '操作失敗')
        return
      }
      setVideoMsg(data.message || '操作完成')
    } catch {
      setVideoMsg('網絡錯誤，請重試')
    }
  }

  return (
    <div className="min-h-screen bg-warm px-4 py-6 pb-24">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-primary">總後台審批</h1>
          <button
            onClick={load}
            className="text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-50"
          >
            刷新
          </button>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
          <h2 className="font-semibold text-gray-800 mb-3">投訴記錄</h2>
          {reportsLoading ? (
            <p className="text-sm text-gray-400">載入中...</p>
          ) : reports.length === 0 ? (
            <p className="text-sm text-gray-400">暫無投訴記錄</p>
          ) : (
            <div className="space-y-3">
              {reports.map((r) => (
                <div key={r.id} className="text-sm border border-gray-100 rounded-xl p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">投訴內容：{r.targetId}</span>
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">{r.status}</span>
                  </div>
                  <p className="text-gray-500 mt-1">原因：{r.reason}</p>
                  <p className="text-xs text-gray-400 mt-1">投訴人：{r.reporter} · {new Date(r.createdAt).toLocaleString('zh-HK')}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <p className="text-gray-500 text-sm mb-6">管理所有主頁與分會申請</p>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
          <h2 className="font-semibold text-gray-800 mb-3">影片發布授權</h2>
          <div className="flex gap-2">
            <input
              type="email"
              value={videoEmail}
              onChange={(e) => setVideoEmail(e.target.value)}
              placeholder="輸入用戶 Email"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={() => handleVideoPermission(true)}
              className="bg-primary text-white text-sm px-4 py-2 rounded-lg hover:bg-primary-dark transition"
            >
              授予
            </button>
            <button
              onClick={() => handleVideoPermission(false)}
              className="bg-gray-200 text-gray-600 text-sm px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              取消
            </button>
          </div>
          {videoMsg && <p className="text-xs text-gray-500 mt-2">{videoMsg}</p>}
        </div>

        {!hasToken && (
          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <p className="text-gray-500 mb-3">請先登入</p>
            <Link href="/auth/login" className="text-primary hover:underline">前往登入</Link>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-400">載入中...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-gray-400">暫無待審批申請</div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => {
              const st = statusLabel(item.status)
              const isProcessing = actionId === `${item.type}-${item.id}`
              return (
                <div key={`${item.type}-${item.id}`} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          {typeLabel(item.type)}
                        </span>
                        <span className={`text-xs px-3 py-1 rounded-full ${st.color}`}>
                          {st.label}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-500">
                        {item.type === 'page' ? item.category : item.branchType}
                        {item.category ? ` · ${item.category}` : ''}
                      </p>
                      <p className="text-sm text-gray-400 mt-1">📍 {item.communityCode}</p>
                      <p className="text-sm text-gray-400 mt-1">申請人：{item.applicant || '—'}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(item.createdAt).toLocaleString('zh-HK')}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      disabled={isProcessing}
                      onClick={() => handleAction(item, 'approve')}
                      className="flex-1 bg-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition disabled:opacity-50"
                    >
                      {isProcessing ? '處理中...' : '批准'}
                    </button>
                    <button
                      disabled={isProcessing}
                      onClick={() => handleAction(item, 'reject')}
                      className="flex-1 bg-gray-200 text-gray-600 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition disabled:opacity-50"
                    >
                      拒絕
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}



