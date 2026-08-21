'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Branch {
  id: string
  name: string
  type: string
  communityCode: string
  role: 'owner' | 'member'
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
}

export default function MyBranches() {
  const router = useRouter()
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/login')
      return
    }

    // 模拟数据
    const mockBranches: Branch[] = [
      {
        id: '1',
        name: '火炭調解分會',
        type: 'MEDIATION',
        communityCode: '火炭',
        role: 'owner',
        status: 'APPROVED',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: '沙田法律服務分會',
        type: 'LEGAL',
        communityCode: '沙田',
        role: 'member',
        status: 'APPROVED',
        createdAt: new Date().toISOString(),
      },
    ]
    setBranches(mockBranches)
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
        <h1 className="text-2xl font-bold text-primary">我的分會</h1>
        <Link href="/branches/apply" className="bg-primary text-white px-4 py-2 rounded-xl text-sm hover:bg-primary-dark transition">
          + 申請分會
        </Link>
      </div>

      {branches.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">尚未加入或建立分會</p>
          <Link href="/branches/apply" className="text-primary hover:underline">立即申請</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {branches.map((branch) => (
            <div key={branch.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-800">{branch.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      branch.role === 'owner' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {branch.role === 'owner' ? '建立者' : '成員'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{branch.type} · 📍 {branch.communityCode}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-3 py-1 rounded-full ${statusMap[branch.status].color}`}>
                    {statusMap[branch.status].label}
                  </span>
                </div>
              </div>
              {branch.status === 'APPROVED' && (
                <div className="mt-3 flex gap-2">
                  <Link
                    href={`/branches/${branch.id}`}
                    className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full hover:bg-primary/20"
                  >
                    查看分會
                  </Link>
                  {branch.role === 'owner' && (
                    <Link
                      href={`/branches/${branch.id}/manage`}
                      className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full hover:bg-gray-200"
                    >
                      管理
                    </Link>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}