import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

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

    const body = await req.json()
    const { userId, email, canPublishVideo } = body

    if (typeof canPublishVideo !== 'boolean') {
      return NextResponse.json({ error: '請提供 canPublishVideo 布爾值' }, { status: 400 })
    }

    const user = userId
      ? await prisma.user.findUnique({ where: { id: String(userId) } })
      : email
        ? await prisma.user.findUnique({ where: { email: String(email) } })
        : null

    if (!user) {
      return NextResponse.json({ error: '用戶不存在' }, { status: 404 })
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { canPublishVideo },
      select: {
        id: true,
        email: true,
        nickname: true,
        canPublishVideo: true,
      },
    })

    return NextResponse.json({
      message: updated.canPublishVideo ? '已授予影片發布授權' : '已取消影片發布授權',
      user: updated,
    })
  } catch (error) {
    console.error('設定影片發布授權錯誤:', error)
    return NextResponse.json({ error: '操作失敗，請重試' }, { status: 500 })
  }
}
