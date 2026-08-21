'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Message {
  id: string
  title: string
  content: string
  type: 'system' | 'user' | 'tenant'
  isRead: boolean
  createdAt: string
}

export default function MessagesPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/login')
      return
    }

    // 模拟消息数据（后续替换为真实API）
    const mockMessages: Message[] = [
      {
        id: '1',
        title: '歡迎加入中華促進會',
        content: '感謝您註冊中華促進會平台，您現在可以瀏覽活動、預約服務和申請分會了。',
        type: 'system',
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: '新活動通知',
        content: '火炭社區街市改造完成，將於本週六舉辦開放日活動，歡迎報名參加。',
        type: 'tenant',
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: '3',
        title: '系統維護通知',
        content: '平台將於2026年8月25日凌晨2:00-4:00進行系統維護，屆時可能無法訪問。',
        type: 'system',
        isRead: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ]
    setMessages(mockMessages)
    setLoading(false)
  }, [router])

  const markAsRead = (id: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === id ? { ...msg, isRead: true } : msg
      )
    )
    // 后续可以调用API更新已读状态
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
        <h1 className="text-2xl font-bold text-primary">我的訊息</h1>
        <Link href="/user" className="text-sm text-gray-500 hover:text-primary">
          返回
        </Link>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-12 text-gray-400">暫無訊息</div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`bg-white rounded-xl p-4 shadow-sm border ${
                msg.isRead ? 'border-gray-100' : 'border-primary/30 bg-primary/5'
              } cursor-pointer hover:shadow-md transition`}
              onClick={() => markAsRead(msg.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800">{msg.title}</span>
                    {!msg.isRead && (
                      <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                        新
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{msg.content}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(msg.createdAt).toLocaleString('zh-HK')}
                  </p>
                </div>
                <span className="text-xs text-gray-400">
                  {msg.type === 'system' ? '系統' : msg.type === 'tenant' ? '租戶' : '用戶'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}