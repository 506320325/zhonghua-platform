'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Post {
  id: string
  title?: string
  content?: string
  category?: string
  communityCode?: string
  images?: string[]
  videoUrl?: string
  author?: string
  viewCount: number
  likeCount: number
  createdAt: string
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/posts')
        const data = await res.json()
        setPosts(data.data || [])
      } catch {
        setPosts([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6 pt-2">
        <div>
          <h1 className="text-2xl font-bold text-primary">中華促進會</h1>
          <p className="text-sm text-gray-500">信任社區 · 香港</p>
        </div>
        <div className="flex gap-3">
          <Link href="/auth/login" className="text-sm text-gray-600 hover:text-primary px-3 py-2">
            登入
          </Link>
          <Link href="/auth/register" className="text-sm bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition">
            註冊
          </Link>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
        <span className="px-4 py-1.5 bg-primary text-white text-sm rounded-full whitespace-nowrap">全部</span>
        <span className="px-4 py-1.5 bg-white text-gray-600 text-sm rounded-full whitespace-nowrap border">資訊服務</span>
        <span className="px-4 py-1.5 bg-white text-gray-600 text-sm rounded-full whitespace-nowrap border">社區服務</span>
        <span className="px-4 py-1.5 bg-white text-gray-600 text-sm rounded-full whitespace-nowrap border">預約服務</span>
        <span className="px-4 py-1.5 bg-white text-gray-600 text-sm rounded-full whitespace-nowrap border">教育服務</span>
        <span className="px-4 py-1.5 bg-white text-gray-600 text-sm rounded-full whitespace-nowrap border">醫療健康</span>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-gray-400">載入中...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-gray-400">暫無資訊，快來發布第一條內容</div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs bg-warm text-gray-600 px-2 py-0.5 rounded-full">{post.category || '動態'}</span>
                <span className="text-xs text-gray-400">{post.communityCode || ''}</span>
              </div>
              {post.title && <h2 className="font-medium text-gray-800 line-clamp-2">{post.title}</h2>}
              {post.content && <p className="text-sm text-gray-600 mt-1 line-clamp-3 whitespace-pre-wrap">{post.content}</p>}
              {post.images && post.images.length > 0 && (
                <div className="flex gap-2 mt-2 flex-wrap">
                  {post.images.slice(0, 3).map((img, idx) => (
                    <img key={idx} src={img} alt="" className="w-20 h-20 object-cover rounded-xl border border-gray-100" />
                  ))}
                </div>
              )}
              {post.videoUrl && (
                <div className="mt-2 text-xs bg-primary/10 text-primary px-3 py-1 rounded-full inline-block">
                  🎬 短片
                </div>
              )}
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                <span>👁 {post.viewCount}</span>
                <span>❤️ {post.likeCount}</span>
                <span>{post.author}</span>
                <span>{new Date(post.createdAt).toLocaleDateString('zh-HK')}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 flex justify-around max-w-4xl mx-auto">
        <button className="flex flex-col items-center text-primary text-xs">
          <span className="text-xl">🏠</span>
          <span>首頁</span>
        </button>
        <Link href="/posts/create" className="flex flex-col items-center text-gray-400 text-xs">
          <span className="text-xl">✏️</span>
          <span>發布</span>
        </Link>
        <Link href="/tenant/register" className="flex flex-col items-center text-gray-400 text-xs">
          <span className="text-xl">🏪</span>
          <span>入駐</span>
        </Link>
        <Link href="/branch/apply" className="flex flex-col items-center text-gray-400 text-xs">
          <span className="text-xl">🏛️</span>
          <span>申請分會</span>
        </Link>
        <Link href="/user" className="flex flex-col items-center text-gray-400 text-xs">
          <span className="text-xl">👤</span>
          <span>我的</span>
        </Link>
      </div>
    </div>
  )
}
