import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const responses = await prisma.surveyResponse.findMany({ where: { surveyId: id }, orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ data: responses })
  } catch (error) {
    console.error('讀取統計錯誤:', error)
    return NextResponse.json({ error: '讀取失敗' }, { status: 500 })
  }
}
