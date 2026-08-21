import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

const MAX_TEXT_LENGTH = 300
const MAX_IMAGES = 3
const MAX_IMAGE_BYTES = 1024 * 1024
const MAX_VIDEO_DURATION_SECONDS = 15

function estimateBase64Bytes(dataUrl: string): number {
  const base64 = dataUrl.split(',')[1] || ''
  return Math.floor(base64.length * 3 / 4)
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: '未授權' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: '無效的 token' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    })
    if (!user) {
      return NextResponse.json({ error: '用戶不存在' }, { status: 404 })
    }

    const body = await req.json()
    const {
      title,
      content,
      images,
      videoUrl,
      videoDuration,
      pageId,
      branchId,
    } = body

    const text = content ? String(content).trim() : ''
    if (text.length > MAX_TEXT_LENGTH) {
      return NextResponse.json({ error: `文字不能超過 ${MAX_TEXT_LENGTH} 字` }, { status: 400 })
    }

    if (!text && (!images || images.length === 0) && !videoUrl) {
      return NextResponse.json({ error: '請輸入文字或上傳圖片/影片' }, { status: 400 })
    }

    let imageList: string[] = []
    if (images) {
      if (!Array.isArray(images)) {
        return NextResponse.json({ error: '圖片格式不正確' }, { status: 400 })
      }
      if (images.length > MAX_IMAGES) {
        return NextResponse.json({ error: `最多上傳 ${MAX_IMAGES} 張圖片` }, { status: 400 })
      }
      for (const img of images) {
        if (typeof img !== 'string' || !img.startsWith('data:image/')) {
          return NextResponse.json({ error: '圖片格式不正確' }, { status: 400 })
        }
        if (estimateBase64Bytes(img) > MAX_IMAGE_BYTES) {
          return NextResponse.json({ error: '單張圖片不能超過 1MB' }, { status: 400 })
        }
      }
      imageList = images
    }

    if (videoUrl) {
      if (!user.canPublishVideo) {
        return NextResponse.json({ error: '你未有影片發布授權' }, { status: 403 })
      }
      const duration = Number(videoDuration || 0)
      if (!duration || duration > MAX_VIDEO_DURATION_SECONDS) {
        return NextResponse.json({ error: '短片不能超過 15 秒' }, { status: 400 })
      }
    }

    const post = await prisma.post.create({
      data: {
        title: title ? String(title).trim() : null,
        content: text || null,
        category: body.category ? String(body.category) : '動態',
        communityCode: body.communityCode ? String(body.communityCode) : null,
        images: imageList.length > 0 ? JSON.stringify(imageList) : null,
        videoUrl: videoUrl ? String(videoUrl) : null,
        videoDuration: videoUrl ? Number(videoDuration) : null,
        status: 'PUBLISHED',
        userId: decoded.userId,
        pageId: pageId ? String(pageId) : null,
        branchId: branchId ? String(branchId) : null,
      },
    })

    return NextResponse.json({
      message: '發布成功',
      postId: post.id,
    }, { status: 201 })
  } catch (error) {
    console.error('發布內容錯誤:', error)
    return NextResponse.json({ error: '發布失敗，請重試' }, { status: 500 })
  }
}
