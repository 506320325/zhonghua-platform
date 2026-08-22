import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const comments = await prisma.eventComment.findMany({
      where: { eventPageId: id, isHidden: false },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, nickname: true, email: true, phone: true } },
      },
    })
    return NextResponse.json({ data: comments })
  } catch (error) {
    console.error('讀取評論錯誤:', error)
    return NextResponse.json({ error: '讀取失敗' }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) return NextResponse.json({ error: '未授權' }, { status: 401 })
    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: '無效的 token' }, { status: 401 })

    const { id } = await params
    const body = await req.json()
    if (!body.content) return NextResponse.json({ error: '請輸入評論內容' }, { status: 400 })

    const event = await prisma.eventPage.findUnique({ where: { id } })
    if (!event) return NextResponse.json({ error: '活動主頁不存在' }, { status: 404 })
    if (!event.commentEnabled) return NextResponse.json({ error: '評論已關閉' }, { status: 400 })

    const comment = await prisma.eventComment.create({
      data: {
        eventPageId: id,
        userId: decoded.userId,
        content: String(body.content),
      },
    })

    return NextResponse.json({ message: '評論已發佈', comment }, { status: 201 })
  } catch (error) {
    console.error('發佈評論錯誤:', error)
    return NextResponse.json({ error: '發佈失敗' }, { status: 500 })
  }
}
