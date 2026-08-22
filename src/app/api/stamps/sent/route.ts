import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) return NextResponse.json({ error: '未授權' }, { status: 401 })
    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: '無效的 token' }, { status: 401 })

    const stamps = await prisma.stamp.findMany({
      where: { fromUserId: decoded.userId },
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        toUser: { select: { id: true, nickname: true, email: true, phone: true } },
      },
    })

    return NextResponse.json({
      data: stamps.map((s) => ({
        id: s.id,
        pattern: s.pattern,
        color: s.color,
        message: s.message,
        createdAt: s.createdAt,
        toUser: s.toUser,
      })),
    })
  } catch (error) {
    console.error('讀取發出的信貼錯誤:', error)
    return NextResponse.json({ error: '讀取失敗' }, { status: 500 })
  }
}
