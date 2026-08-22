'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface StoredUser {
  canPublishVideo?: boolean
}

export default function CreatePostPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [type, setType] = useState('DAILY')
  const [inviteCategory, setInviteCategory] = useState('')
  const [maxParticipants, setMaxParticipants] = useState('')
  const [deadline, setDeadline] = useState('')
  const [location, setLocation] = useState('')
  const [visibilityScope, setVisibilityScope] = useState('PUBLIC')
  const [joinScope, setJoinScope] = useState('SAME')
  const [regionLimit, setRegionLimit] = useState('不限')
  const [ageMin, setAgeMin] = useState('')
  const [ageMax, setAgeMax] = useState('')
  const [genderLimit, setGenderLimit] = useState('不限')
  const [content, setContent] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [videoUrl, setVideoUrl] = useState('')
  const [videoDuration, setVideoDuration] = useState('')
  const [canPublishVideo, setCanPublishVideo] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/login')
      return
    }
    try {
      const userStr = localStorage.getItem('user')
      const user: StoredUser | null = userStr ? JSON.parse(userStr) : null
      setCanPublishVideo(!!user?.canPublishVideo)
    } catch {
      setCanPublishVideo(false)
    }
  }, [router])

  const handleImageFiles = (files: FileList | null) => {
    if (!files) return
    const remaining = 3 - images.length
    const selected = Array.from(files).slice(0, remaining)
    for (const file of selected) {
      if (!file.type.startsWith('image/')) {
        setError('只能上傳圖片')
        return
      }
      if (file.size > 1024 * 1024) {
        setError('單張圖片不能超過 1MB')
        return
      }
      const reader = new FileReader()
      reader.onload = (e) => {
        const url = e.target?.result as string
        setImages((prev) => (prev.length < 3 ? [...prev, url] : prev))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/login')
      return
    }

    if (content.length > 300) {
      setError('文字不能超過 300 字')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/posts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content,
          images,
          videoUrl: canPublishVideo ? videoUrl : '',
          videoDuration: canPublishVideo && videoUrl ? Number(videoDuration) : 0,
          category: '動態',
          type,
          inviteCategory,
          maxParticipants,
          deadline,
          location,
          visibilityScope,
          joinScope,
          regionLimit,
          ageMin,
          ageMax,
          genderLimit,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || '發布失敗')
        return
      }
      alert('發布成功')
      router.push('/')
    } catch (err) {
      setError('網絡錯誤，請重試')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary">發布內容</h1>
        <Link href="/user" className="text-sm text-gray-500 hover:text-primary">返回</Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">標題（可選）</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="請輸入標題"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">發布類型</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none"
          >
            <option value="DAILY">日常</option>
            <option value="INVITE">邀約</option>
            <option value="ACTIVITY">活動</option>
            <option value="BOOKING">預約</option>
            <option value="HELP">求助</option>
            <option value="SURVEY">問卷</option>
          </select>
        </div>

        {type === 'INVITE' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">邀約類別</label>
              <select value={inviteCategory} onChange={(e) => setInviteCategory(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl">
                <option value="">請選擇</option>
                <option value="打牌">打牌</option>
                <option value="行山">行山</option>
                <option value="羽毛球">羽毛球</option>
                <option value="吃飯">吃飯</option>
                <option value="運動">運動</option>
                <option value="遊戲">遊戲</option>
                <option value="其他">其他</option>
              </select>
            </div>
            <input value={maxParticipants} onChange={(e) => setMaxParticipants(e.target.value)} placeholder="人數上限" className="w-full px-4 py-3 border border-gray-300 rounded-xl" />
            <input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} placeholder="截止時間" className="w-full px-4 py-3 border border-gray-300 rounded-xl" />
            <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="地點" className="w-full px-4 py-3 border border-gray-300 rounded-xl" />
          </div>
        )}

        <div className="space-y-3 bg-gray-50 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-700">範圍設定</h3>
          <div>
            <label className="block text-xs text-gray-500 mb-1">誰可以看到</label>
            <select value={visibilityScope} onChange={(e) => setVisibilityScope(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm">
              <option value="PUBLIC">公開（所有人）</option>
              <option value="ORGANIZATION">僅限本組織</option>
              <option value="TENANT_MEMBERS">僅限本租戶會員</option>
              <option value="SPECIFIC_MEMBERS">僅限指定會員</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">報名範圍</label>
            <select value={joinScope} onChange={(e) => setJoinScope(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm">
              <option value="SAME">與可見範圍相同</option>
              <option value="PUBLIC">公開</option>
              <option value="SPECIFIC">指定</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">區域限制</label>
            <select value={regionLimit} onChange={(e) => setRegionLimit(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm">
              <option value="不限">不限</option>
              <option value="火炭">火炭</option>
              <option value="沙田">沙田</option>
              <option value="港島">港島</option>
              <option value="九龍">九龍</option>
              <option value="新界">新界</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input value={ageMin} onChange={(e) => setAgeMin(e.target.value)} placeholder="年齡下限" className="px-4 py-2 border border-gray-300 rounded-lg text-sm" />
            <input value={ageMax} onChange={(e) => setAgeMax(e.target.value)} placeholder="年齡上限" className="px-4 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">性別限制</label>
            <select value={genderLimit} onChange={(e) => setGenderLimit(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm">
              <option value="不限">不限</option>
              <option value="男">男</option>
              <option value="女">女</option>
            </select>
          </div>
        </div>



        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">內容</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            maxLength={300}
            placeholder="說點什麼...（300 字以內）"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none resize-none"
          />
          <p className="text-xs text-gray-400 text-right mt-1">{content.length}/300</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">圖片（最多 3 張，每張 1MB 內）</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleImageFiles(e.target.files)}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
          />
          {images.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {images.map((img, idx) => (
                <div key={idx} className="relative">
                  <img src={img} alt="" className="w-20 h-20 object-cover rounded-xl border border-gray-200" />
                  <button
                    type="button"
                    onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                    className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={`rounded-xl border p-4 ${canPublishVideo ? 'border-gray-200' : 'border-gray-100 bg-gray-50'}`}>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">短片（15 秒以內）</label>
            {canPublishVideo ? (
              <span className="text-xs text-green-600">已授權</span>
            ) : (
              <span className="text-xs text-gray-400">需要平台授權</span>
            )}
          </div>
          {canPublishVideo ? (
            <div className="space-y-3 mt-3">
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="貼上短片 URL"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none"
              />
              <input
                type="number"
                value={videoDuration}
                onChange={(e) => setVideoDuration(e.target.value)}
                placeholder="秒數（例如 10）"
                max={15}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          ) : (
            <p className="text-xs text-gray-400 mt-2">
              目前影片發布需要平台授權，未授權時按鈕不可用。
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-dark transition disabled:opacity-50"
        >
          {loading ? '發布中...' : '發布'}
        </button>
      </form>
    </div>
  )
}
