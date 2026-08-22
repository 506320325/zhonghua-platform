import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, nickname: true, email: true, phone: true } },
      },
    })
    if (!post) return NextResponse.json({ error: '內容不存在' }, { status: 404 })
    return NextResponse.json({ data: post })
  } catch (error) {
    console.error('讀取內容詳情錯誤:', error)
    return NextResponse.json({ error: '讀取失敗' }, { status: 500 })
  }
}
