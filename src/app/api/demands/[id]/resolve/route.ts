import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await prisma.demand.update({ where: { id }, data: { status: 'RESOLVED' } })
    return NextResponse.json({ message: '已標記完成', data })
  } catch (error) {
    console.error('標記完成錯誤:', error)
    return NextResponse.json({ error: '操作失敗' }, { status: 500 })
  }
}
