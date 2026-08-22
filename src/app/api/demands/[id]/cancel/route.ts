import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await prisma.demand.update({ where: { id }, data: { status: 'CANCELLED' } })
    return NextResponse.json({ message: '需求已取消', data })
  } catch (error) {
    console.error('取消需求錯誤:', error)
    return NextResponse.json({ error: '操作失敗' }, { status: 500 })
  }
}
