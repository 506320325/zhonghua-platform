import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

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
    const { targetId, targetType, reason } = body

    if (!targetId || !reason) {
      return NextResponse.json({ error: '請提供投訴目標和原因' }, { status: 400 })
    }

    if (targetType !== 'POST') {
      return NextResponse.json({ error: '目前只支持投訴內容' }, { status: 400 })
    }

    const post = await prisma.post.findUnique({
      where: { id: String(targetId) },
    })

    if (!post) {
      return NextResponse.json({ error: '內容不存在' }, { status: 404 })
    }

    const report = await prisma.report.create({
      data: {
        reporterId: decoded.userId,
        targetId: String(targetId),
        targetType: 'POST',
        communityBranchId: post.branchId || null,
        reason: String(reason),
        status: 'PENDING',
      },
    })

    await prisma.post.update({
      where: { id: post.id },
      data: { status: 'REPORTED' },
    })

    await prisma.notification.create({
      data: {
        userId: post.userId,
        title: '你的內容被投訴',
        content: '你發布的內容被投訴，目前已暫停顯示。請在後續處理中查看詳情。',
        type: 'REPORT',
      },
    })

    const admins = await prisma.user.findMany({
      where: { role: 'PLATFORM_ADMIN' },
      select: { id: true },
    })

    if (admins.length > 0) {
      await prisma.notification.createMany({
        data: admins.map((admin) => ({
          userId: admin.id,
          title: '收到新的內容投訴',
          content: `內容 ID：${post.id}\n投訴原因：${String(reason)}`,
          type: 'REPORT',
        })),
      })
    }

    return NextResponse.json({
      message: '投訴已提交，內容已暫停顯示',
      reportId: report.id,
    }, { status: 201 })
  } catch (error) {
    console.error('提交投訴錯誤:', error)
    return NextResponse.json({ error: '提交失敗，請重試' }, { status: 500 })
  }
}

