import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) return NextResponse.json({ error: '未授權' }, { status: 401 })
    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: '無效的 token' }, { status: 401 })

    const { id } = await params
    const body = await req.json()
    const event = await prisma.eventPage.findUnique({ where: { id } })
    if (!event) return NextResponse.json({ error: '活動主頁不存在' }, { status: 404 })
    if (event.createdBy !== decoded.userId) return NextResponse.json({ error: '無權限編輯' }, { status: 403 })

    const updated = await prisma.eventPage.update({
      where: { id },
      data: {
        title: body.title ? String(body.title) : undefined,
        description: body.description !== undefined ? String(body.description) : undefined,
        eventDate: body.eventDate ? new Date(body.eventDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
        location: body.location !== undefined ? String(body.location) : undefined,
        organizers: body.organizers !== undefined ? body.organizers : undefined,
        coOrganizers: body.coOrganizers !== undefined ? body.coOrganizers : undefined,
        supportingOrgs: body.supportingOrgs !== undefined ? body.supportingOrgs : undefined,
        participantOrgs: body.participantOrgs !== undefined ? body.participantOrgs : undefined,
        guests: body.guests !== undefined ? body.guests : undefined,
        commentEnabled: body.commentEnabled !== undefined ? body.commentEnabled : undefined,
        ratingEnabled: body.ratingEnabled !== undefined ? body.ratingEnabled : undefined,
      },
    })

    return NextResponse.json({ message: '已更新', event: updated })
  } catch (error) {
    console.error('更新活動主頁錯誤:', error)
    return NextResponse.json({ error: '更新失敗' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) return NextResponse.json({ error: '未授權' }, { status: 401 })
    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: '無效的 token' }, { status: 401 })

    const { id } = await params
    const event = await prisma.eventPage.findUnique({ where: { id } })
    if (!event) return NextResponse.json({ error: '活動主頁不存在' }, { status: 404 })
    if (event.createdBy !== decoded.userId) return NextResponse.json({ error: '無權限刪除' }, { status: 403 })

    await prisma.eventPage.delete({ where: { id } })
    return NextResponse.json({ message: '已刪除' })
  } catch (error) {
    console.error('刪除活動主頁錯誤:', error)
    return NextResponse.json({ error: '刪除失敗' }, { status: 500 })
  }
}
