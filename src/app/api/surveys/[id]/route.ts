import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await prisma.survey.findUnique({ where: { id } })
    if (!data) return NextResponse.json({ error: '問卷不存在' }, { status: 404 })
    return NextResponse.json({ data })
  } catch (error) {
    console.error('讀取問卷詳情錯誤:', error)
    return NextResponse.json({ error: '讀取失敗' }, { status: 500 })
  }
}
