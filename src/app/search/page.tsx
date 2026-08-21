'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function SearchContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [q, setQ] = useState(searchParams.get('q') || '')
  const [results, setResults] = useState<any>({ pages: [], branches: [], users: [], posts: [] })
  const [loading, setLoading] = useState(false)

  const runSearch = async (query?: string) => {
    const keyword = query ?? q
    if (!keyword.trim()) return
    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(keyword)}`)
      const data = await res.json()
      setResults(data.data || { pages: [], branches: [], users: [], posts: [] })
    } catch {
      setResults({ pages: [], branches: [], users: [], posts: [] })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const initial = searchParams.get('q')
    if (initial) {
      setQ(initial)
      runSearch(initial)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/search?q=${encodeURIComponent(q)}`)
    runSearch()
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-24">
      <h1 className="text-2xl font-bold text-primary mb-6">搜尋</h1>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜尋主頁、分會、用戶、內容..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none"
        />
        <button className="bg-primary text-white px-5 py-3 rounded-xl hover:bg-primary-dark transition">
          搜尋
        </button>
      </form>

      {loading && <p className="text-gray-400 text-sm">搜尋中...</p>}

      {!loading && (
        <div className="space-y-6">
          <div>
            <h2 className="font-semibold text-gray-800 mb-2">主頁</h2>
            {results.pages.length === 0 ? (
              <p className="text-xs text-gray-400">無</p>
            ) : (
              results.pages.map((p: any) => (
                <Link key={p.id} href={`/p/${p.slug}`} className="block bg-white rounded-xl p-3 border border-gray-100 mb-2 hover:border-primary">
                  <p className="font-medium text-gray-800">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.category} · {p.communityCode}</p>
                </Link>
              ))
            )}
          </div>

          <div>
            <h2 className="font-semibold text-gray-800 mb-2">分會</h2>
            {results.branches.length === 0 ? (
              <p className="text-xs text-gray-400">無</p>
            ) : (
              results.branches.map((b: any) => (
                <Link key={b.id} href={`/b/${b.slug}`} className="block bg-white rounded-xl p-3 border border-gray-100 mb-2 hover:border-primary">
                  <p className="font-medium text-gray-800">{b.name}</p>
                  <p className="text-xs text-gray-400">{b.branchType} · {b.communityCode}</p>
                </Link>
              ))
            )}
          </div>

          <div>
            <h2 className="font-semibold text-gray-800 mb-2">用戶</h2>
            {results.users.length === 0 ? (
              <p className="text-xs text-gray-400">無</p>
            ) : (
              results.users.map((u: any) => (
                <div key={u.id} className="bg-white rounded-xl p-3 border border-gray-100 mb-2">
                  <p className="font-medium text-gray-800">{u.nickname || u.email || u.phone}</p>
                  <p className="text-xs text-gray-400">學歷：{u.education || '—'} · 特長：{u.skills || '—'} · 愛好：{u.hobbies || '—'}</p>
                </div>
              ))
            )}
          </div>

          <div>
            <h2 className="font-semibold text-gray-800 mb-2">內容</h2>
            {results.posts.length === 0 ? (
              <p className="text-xs text-gray-400">無</p>
            ) : (
              results.posts.map((post: any) => (
                <div key={post.id} className="bg-white rounded-xl p-3 border border-gray-100 mb-2">
                  <p className="font-medium text-gray-800">{post.title || '無標題'}</p>
                  <p className="text-xs text-gray-400 line-clamp-2">{post.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-gray-400">載入中...</div>}>
      <SearchContent />
    </Suspense>
  )
}
