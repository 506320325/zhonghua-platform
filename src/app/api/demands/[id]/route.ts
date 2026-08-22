import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await prisma.demand.findUnique({ where: { id } })
    if (!data) return NextResponse.json({ error: '需求不存在' }, { status: 404 })
    return NextResponse.json({ data })
  } catch (error) {
    console.error('讀取需求詳情錯誤:', error)
    return NextResponse.json({ error: '讀取失敗' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const data = await prisma.demand.update({
      where: { id },
      data: {
        title: body.title !== undefined ? String(body.title) : undefined,
        content: body.content !== undefined ? String(body.content) : undefined,
        budgetMin: body.budgetMin !== undefined ? Number(body.budgetMin) : undefined,
        budgetMax: body.budgetMax !== undefined ? Number(body.budgetMax) : undefined,
        location: body.location !== undefined ? String(body.location) : undefined,
      },
    })
    return NextResponse.json({ message: '已更新', data })
  } catch (error) {
    console.error('更新需求錯誤:', error)
    return NextResponse.json({ error: '更新失敗' }, { status: 500 })
  }
}
