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

    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')
    const id = searchParams.get('id')

    if (type !== 'branch' || !id) {
      return NextResponse.json({ error: '目前只支持分會加入審核' }, { status: 400 })
    }

    const requests = await prisma.branchStaff.findMany({
      where: {
        branchId: String(id),
        status: 'PENDING',
        role: 'MEMBER',
      },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      data: requests.map((r) => ({
        id: r.id,
        userId: r.userId,
        user: r.user,
        referrerEmail: r.referrerEmail,
        createdAt: r.createdAt,
      })),
    })
  } catch (error) {
    console.error('讀取加入申請錯誤:', error)
    return NextResponse.json({ error: '讀取失敗' }, { status: 500 })
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
    const { id, action } = body

    if (!id || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: '請提供 id 和 action' }, { status: 400 })
    }

    const membership = await prisma.branchStaff.findUnique({ where: { id: String(id) } })
    if (!membership) {
      return NextResponse.json({ error: '申請不存在' }, { status: 404 })
    }

    await prisma.branchStaff.update({
      where: { id: membership.id },
      data: {
        status: action === 'approve' ? 'ACTIVE' : 'REJECTED',
      },
    })

    return NextResponse.json({
      message: action === 'approve' ? '已通過加入申請' : '已拒絕加入申請',
    })
  } catch (error) {
    console.error('處理加入申請錯誤:', error)
    return NextResponse.json({ error: '操作失敗' }, { status: 500 })
  }
}
