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

    const data = await prisma.demand.findMany({
      where: { userId: decoded.userId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })
    return NextResponse.json({ data })
  } catch (error) {
    console.error('讀取我的需求錯誤:', error)
    return NextResponse.json({ error: '讀取失敗' }, { status: 500 })
  }
}
