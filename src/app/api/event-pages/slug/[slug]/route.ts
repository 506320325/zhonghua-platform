import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const event = await prisma.eventPage.findUnique({
      where: { slug },
      include: {
        createdByUser: {
          select: { id: true, nickname: true, email: true, phone: true },
        },
        comments: {
          where: { isHidden: false },
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { id: true, nickname: true, email: true, phone: true } },
          },
        },
      },
    })

    if (!event) return NextResponse.json({ error: '活動主頁不存在' }, { status: 404 })

    return NextResponse.json({ data: event })
  } catch (error) {
    console.error('讀取活動主頁詳情錯誤:', error)
    return NextResponse.json({ error: '讀取失敗' }, { status: 500 })
  }
}
