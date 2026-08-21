import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
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

    const notifications = await prisma.notification.findMany({
      where: { userId: decoded.userId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })

    return NextResponse.json({
      data: notifications.map((n) => ({
        id: n.id,
        title: n.title,
        content: n.content,
        type: n.type,
        isRead: n.isRead,
        createdAt: n.createdAt,
      })),
    })
  } catch (error) {
    console.error('讀取通知錯誤:', error)
    return NextResponse.json({ error: '讀取失敗，請重試' }, { status: 500 })
  }
}
