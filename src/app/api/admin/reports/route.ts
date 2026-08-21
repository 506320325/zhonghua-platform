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
        handler: {
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
      resolution: report.resolution,
      communityBranchId: report.communityBranchId,
      createdAt: report.createdAt,
      reporter: report.reporter?.nickname || report.reporter?.email || report.reporter?.phone || '',
      handler: report.handler?.nickname || report.handler?.email || report.handler?.phone || '',
    }))

    return NextResponse.json({ data })
  } catch (error) {
    console.error('讀取投訴記錄錯誤:', error)
    return NextResponse.json({ error: '讀取失敗，請重試' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
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

    const body = await req.json()
    const { id, action, resolution } = body

    if (!id || !['valid', 'invalid'].includes(action)) {
      return NextResponse.json({ error: '請提供正確的 id 和 action' }, { status: 400 })
    }

    const report = await prisma.report.findUnique({ where: { id: String(id) } })
    if (!report) {
      return NextResponse.json({ error: '投訴記錄不存在' }, { status: 404 })
    }

    const status = action === 'valid' ? 'VALID' : 'INVALID'
    await prisma.report.update({
      where: { id: report.id },
      data: {
        status,
        resolution: resolution ? String(resolution) : null,
        handlerId: decoded.userId,
        handlerRole: 'PLATFORM_ADMIN',
      },
    })

    if (action === 'invalid' && report.targetType === 'POST') {
      await prisma.post.update({
        where: { id: report.targetId },
        data: { status: 'PUBLISHED' },
      })
    }

    await prisma.notification.create({
      data: {
        userId: report.reporterId,
        title: action === 'valid' ? '投訴已確認有效' : '投訴已判定無效',
        content: resolution || '平台已處理你的投訴。',
        type: 'REPORT',
      },
    })

    return NextResponse.json({
      message: action === 'valid' ? '已確認投訴有效' : '已判定投訴無效',
      status,
    })
  } catch (error) {
    console.error('處理投訴錯誤:', error)
    return NextResponse.json({ error: '操作失敗，請重試' }, { status: 500 })
  }
}
