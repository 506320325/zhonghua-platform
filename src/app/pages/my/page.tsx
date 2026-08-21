'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Page {
  id: string
  name: string
  type: string
  category: string
  communityCode: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
}

export default function MyPages() {
  const router = useRouter()
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/login')
      return
    }

    // 模拟数据
    const mockPages: Page[] = [
      {
        id: '1',
        name: '火炭羽毛球會',
        type: 'SPORTS',
        category: '社區服務',
        communityCode: '火炭',
        status: 'APPROVED',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: '香港福建同鄉會',
        type: 'FELLOWSHIP',
        category: '社區服務',
        communityCode: '銅鑼灣',
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      },
    ]
    setPages(mockPages)
    setLoading(false)
  }, [router])

  const statusMap = {
    PENDING: { label: '審核中', color: 'bg-yellow-100 text-yellow-700' },
    APPROVED: { label: '已通過', color: 'bg-green-100 text-green-700' },
    REJECTED: { label: '已拒絕', color: 'bg-red-100 text-red-700' },
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">載入中...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary">我建立的主頁</h1>
        <Link href="/pages/create" className="bg-primary text-white px-4 py-2 rounded-xl text-sm hover:bg-primary-dark transition">
          + 建立主頁
        </Link>
      </div>

      {pages.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">尚未建立主頁</p>
          <Link href="/pages/create" className="text-primary hover:underline">立即建立</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {pages.map((page) => (
            <div key={page.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">{page.name}</h3>
                  <p className="text-sm text-gray-500">{page.type} · {page.category}</p>
                  <p className="text-xs text-gray-400">📍 {page.communityCode}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-3 py-1 rounded-full ${statusMap[page.status].color}`}>
                    {statusMap[page.status].label}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(page.createdAt).toLocaleDateString('zh-HK')}
                  </p>
                </div>
              </div>
              {page.status === 'APPROVED' && (
                <div className="mt-3 flex gap-2">
                  <Link
                    href={`/p/${page.id}`}
                    className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full hover:bg-primary/20"
                  >
                    查看主頁
                  </Link>
                  <Link
                    href={`/pages/${page.id}/manage`}
                    className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full hover:bg-gray-200"
                  >
                    管理
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}