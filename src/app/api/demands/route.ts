import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')
    const location = searchParams.get('location')
    const q = searchParams.get('q')

    const where: any = { status: { in: ['PUBLISHED', 'IN_PROGRESS', 'RESOLVED'] } }
    if (type) where.type = type
    if (location) where.location = { contains: location }
    if (q) {
      where.OR = [
        { title: { contains: q } },
        { content: { contains: q } },
      ]
    }

    const data = await prisma.demand.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
    })
    return NextResponse.json({ data })
  } catch (error) {
    console.error('讀取需求錯誤:', error)
    return NextResponse.json({ error: '讀取失敗' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) return NextResponse.json({ error: '未授權' }, { status: 401 })
    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: '無效的 token' }, { status: 401 })

    const body = await req.json()
    if (!body.type || !body.title || !body.content) {
      return NextResponse.json({ error: '請填寫分類、標題和內容' }, { status: 400 })
    }

    const startOfDay = new Date(); startOfDay.setHours(0,0,0,0)
    const countToday = await prisma.demand.count({
      where: { userId: decoded.userId, createdAt: { gte: startOfDay } },
    })
    if (countToday >= 3) {
      return NextResponse.json({ error: '普通用戶每日最多發 3 條需求' }, { status: 429 })
    }

    const data = await prisma.demand.create({
      data: {
        type: String(body.type),
        title: String(body.title),
        content: String(body.content),
        budgetMin: body.budgetMin ? Number(body.budgetMin) : null,
        budgetMax: body.budgetMax ? Number(body.budgetMax) : null,
        location: body.location ? String(body.location) : null,
        images: body.images ? JSON.stringify(body.images) : null,
        recommendTarget: body.recommendTarget ? String(body.recommendTarget) : null,
        userId: decoded.userId,
        tenantId: body.tenantId || null,
        branchId: body.branchId || null,
        surveyId: body.surveyId || null,
      },
    })
    return NextResponse.json({ message: '需求已發布', data }, { status: 201 })
  } catch (error) {
    console.error('發布需求錯誤:', error)
    return NextResponse.json({ error: '發布失敗' }, { status: 500 })
  }
}
