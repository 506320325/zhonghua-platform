import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) return NextResponse.json({ error: '未授權' }, { status: 401 })
    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: '無效的 token' }, { status: 401 })

    const { id } = await params
    const body = await req.json()
    const status = body.status

    const allowed = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']
    if (!allowed.includes(status)) {
      return NextResponse.json({ error: '無效的狀態' }, { status: 400 })
    }

    const booking = await prisma.booking.findUnique({ where: { id } })
    if (!booking) return NextResponse.json({ error: '預約不存在' }, { status: 404 })

    const data: any = { status }
    if (status === 'CONFIRMED') data.confirmedAt = new Date()
    if (status === 'COMPLETED') data.completedAt = new Date()
    if (status === 'CANCELLED') data.cancelledAt = new Date()
    if (status === 'NO_SHOW') { data.isNoShow = true; data.noShowAt = new Date() }

    const updated = await prisma.booking.update({ where: { id }, data })
    return NextResponse.json({ message: '狀態已更新', data: updated })
  } catch (error) {
    console.error('更新預約錯誤:', error)
    return NextResponse.json({ error: '更新失敗' }, { status: 500 })
  }
}
