'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Post {
  id: string
  title: string
  category: string
  communityCode: string
  viewCount: number
  likeCount: number
  createdAt: string
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 模拟加载资讯列表
    const mockPosts: Post[] = [
      {
        id: '1',
        title: '2026年施政報告：香港北部都會區發展規劃出爐',
        category: '全港熱點資訊',
        communityCode: '81010101',
        viewCount: 1234,
        likeCount: 89,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: '火炭社區街市改造完成 新增AI智能秤',
        category: '分區社區話題',
        communityCode: '81030323',
        viewCount: 567,
        likeCount: 45,
        createdAt: new Date().toISOString(),
      },
      {
        id: '3',
        title: '沙田區公屋揀樓通知 逾千戶獲派新單位',
        category: '通知公告',
        communityCode: '81030301',
        viewCount: 890,
        likeCount: 67,
        createdAt: new Date().toISOString(),
      },
    ]
    setPosts(mockPosts)
    setLoading(false)
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* 顶部品牌栏 */}
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

      {/* PWA安装提示 */}
      <div id="pwa-install-banner" className="hidden bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">📱 添加到主屏幕</span>
          <button className="text-xs bg-primary text-white px-3 py-1 rounded-full">安裝</button>
        </div>
      </div>

      {/* 分类导航 */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
        <span className="px-4 py-1.5 bg-primary text-white text-sm rounded-full whitespace-nowrap">全部</span>
        <span className="px-4 py-1.5 bg-white text-gray-600 text-sm rounded-full whitespace-nowrap border">資訊服務</span>
        <span className="px-4 py-1.5 bg-white text-gray-600 text-sm rounded-full whitespace-nowrap border">社區服務</span>
        <span className="px-4 py-1.5 bg-white text-gray-600 text-sm rounded-full whitespace-nowrap border">預約服務</span>
        <span className="px-4 py-1.5 bg-white text-gray-600 text-sm rounded-full whitespace-nowrap border">教育服務</span>
        <span className="px-4 py-1.5 bg-white text-gray-600 text-sm rounded-full whitespace-nowrap border">醫療健康</span>
      </div>

      {/* 资讯列表 */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-gray-400">載入中...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-gray-400">暫無資訊</div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs bg-warm text-gray-600 px-2 py-0.5 rounded-full">{post.category}</span>
                    <span className="text-xs text-gray-400">{post.communityCode}</span>
                  </div>
                  <h2 className="font-medium text-gray-800 line-clamp-2">{post.title}</h2>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                    <span>👁 {post.viewCount}</span>
                    <span>❤️ {post.likeCount}</span>
                    <span>{new Date(post.createdAt).toLocaleDateString('zh-HK')}</span>
                  </div>
                </div>
                <button className="text-gray-300 hover:text-primary text-sm px-2">⋯</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 底部快捷入口 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 flex justify-around max-w-4xl mx-auto">
        <button className="flex flex-col items-center text-primary text-xs">
          <span className="text-xl">🏠</span>
          <span>首頁</span>
        </button>
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