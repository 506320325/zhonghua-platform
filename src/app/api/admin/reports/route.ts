import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: '未授權' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: '無效的 token' }, { status: 401 })
    }

    const reports = await prisma.report.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        reporter: {
          select: {
            id: true,
            nickname: true,
            email: true,
            phone: true,
          },
        },
      },
    })

    const data = reports.map((report) => ({
      id: report.id,
      targetId: report.targetId,
      targetType: report.targetType,
      reason: report.reason,
      status: report.status,
      createdAt: report.createdAt,
      reporter: report.reporter?.nickname || report.reporter?.email || report.reporter?.phone || '',
    }))

    return NextResponse.json({ data })
  } catch (error) {
    console.error('讀取投訴記錄錯誤:', error)
    return NextResponse.json({ error: '讀取失敗，請重試' }, { status: 500 })
  }
}
