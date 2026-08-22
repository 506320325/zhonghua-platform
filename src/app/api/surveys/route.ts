import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET() {
  try {
    const data = await prisma.survey.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })
    return NextResponse.json({ data })
  } catch (error) {
    console.error('讀取問卷錯誤:', error)
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
    if (!body.title || !Array.isArray(body.questions)) return NextResponse.json({ error: '請填寫標題和問題' }, { status: 400 })
    const data = await prisma.survey.create({
      data: {
        title: String(body.title),
        description: body.description ? String(body.description) : null,
        questions: body.questions,
        deadline: body.deadline ? new Date(body.deadline) : null,
        isAnonymous: body.isAnonymous !== false,
        status: 'PUBLISHED',
        visibilityScope: body.visibilityScope || 'PUBLIC',
        regionLimit: body.regionLimit || null,
        ageMin: body.ageMin ? Number(body.ageMin) : null,
        ageMax: body.ageMax ? Number(body.ageMax) : null,
        genderLimit: body.genderLimit || '不限',
        userId: decoded.userId,
        tenantId: body.tenantId || null,
        branchId: body.branchId || null,
        demandId: body.demandId || null,
      },
    })
    return NextResponse.json({ message: '問卷已發布', data }, { status: 201 })
  } catch (error) {
    console.error('創建問卷錯誤:', error)
    return NextResponse.json({ error: '創建失敗' }, { status: 500 })
  }
}
