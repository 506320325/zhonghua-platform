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
    const demand = await prisma.demand.findUnique({ where: { id } })
    if (!demand) return NextResponse.json({ error: '需求不存在' }, { status: 404 })
    const responses = demand.responses ? JSON.parse(demand.responses) : []
    responses.push({ userId: decoded.userId, content: body.content || '', createdAt: new Date().toISOString() })
    const data = await prisma.demand.update({
      where: { id },
      data: { responses: JSON.stringify(responses), status: demand.status === 'PUBLISHED' ? 'IN_PROGRESS' : demand.status },
    })
    return NextResponse.json({ message: '已響應需求', data })
  } catch (error) {
    console.error('響應需求錯誤:', error)
    return NextResponse.json({ error: '響應失敗' }, { status: 500 })
  }
}
