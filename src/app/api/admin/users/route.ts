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

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: {
        id: true,
        email: true,
        phone: true,
        nickname: true,
        role: true,
        blocked: true,
        createdAt: true,
      },
    })
    return NextResponse.json({ data: users })
  } catch (error) {
    console.error('讀取用戶列表錯誤:', error)
    return NextResponse.json({ error: '讀取失敗' }, { status: 500 })
  }
}
