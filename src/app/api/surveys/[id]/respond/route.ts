import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) return NextResponse.json({ error: '未授權' }, { status: 401 })
    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: '無效的 token' }, { status: 401 })
    const { id } = await params
    const body = await req.json()
    const survey = await prisma.survey.findUnique({ where: { id } })
    if (!survey) return NextResponse.json({ error: '問卷不存在' }, { status: 404 })
    const data = await prisma.surveyResponse.create({
      data: {
        surveyId: id,
        userId: survey.isAnonymous ? null : decoded.userId,
        answers: body.answers || [],
      },
    })
    await prisma.survey.update({ where: { id }, data: { responseCount: { increment: 1 } } })
    return NextResponse.json({ message: '提交成功', data }, { status: 201 })
  } catch (error) {
    console.error('提交問卷錯誤:', error)
    return NextResponse.json({ error: '提交失敗' }, { status: 500 })
  }
}
