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
    const allowed = ['DRAFT', 'PUBLISHED', 'ENDED', 'ARCHIVED']
    if (!body.status || !allowed.includes(body.status)) {
      return NextResponse.json({ error: '無效的狀態' }, { status: 400 })
    }

    const event = await prisma.eventPage.findUnique({ where: { id } })
    if (!event) return NextResponse.json({ error: '活動主頁不存在' }, { status: 404 })
    if (event.createdBy !== decoded.userId) return NextResponse.json({ error: '無權限操作' }, { status: 403 })

    const updated = await prisma.eventPage.update({
      where: { id },
      data: { status: body.status },
    })

    return NextResponse.json({ message: '狀態已更新', event: updated })
  } catch (error) {
    console.error('更新活動主頁狀態錯誤:', error)
    return NextResponse.json({ error: '更新失敗' }, { status: 500 })
  }
}
