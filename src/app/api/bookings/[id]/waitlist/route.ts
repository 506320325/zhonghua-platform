import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) return NextResponse.json({ error: '未授權' }, { status: 401 })
    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: '無效的 token' }, { status: 401 })

    const { id } = await params
    const booking = await prisma.booking.findUnique({ where: { id } })
    if (!booking) return NextResponse.json({ error: '預約不存在' }, { status: 404 })

    const updated = await prisma.booking.update({
      where: { id },
      data: { isWaitlist: true, waitlistPosition: (booking.waitlistCount || 0) + 1 },
    })
    return NextResponse.json({ message: '已加入候補', data: updated })
  } catch (error) {
    console.error('加入候補錯誤:', error)
    return NextResponse.json({ error: '加入失敗' }, { status: 500 })
  }
}
