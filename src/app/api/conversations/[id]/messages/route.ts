import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const messages = await prisma.message.findMany({
      where: { conversationId: id },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: { select: { id: true, nickname: true, email: true, phone: true } },
      },
    })
    return NextResponse.json({ data: messages })
  } catch (error) {
    console.error('讀取訊息錯誤:', error)
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
    if (!body.content) return NextResponse.json({ error: '請輸入內容' }, { status: 400 })

    const conv = await prisma.conversation.findUnique({ where: { id } })
    if (!conv) return NextResponse.json({ error: '會話不存在' }, { status: 404 })

    const message = await prisma.message.create({
      data: {
        conversationId: id,
        senderId: decoded.userId,
        content: String(body.content),
      },
    })

    await prisma.conversation.update({
      where: { id },
      data: { lastMessageAt: new Date() },
    })

    return NextResponse.json({ message: '已發送', data: message }, { status: 201 })
  } catch (error) {
    console.error('發送訊息錯誤:', error)
    return NextResponse.json({ error: '發送失敗' }, { status: 500 })
  }
}
