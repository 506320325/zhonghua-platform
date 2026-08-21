import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

function getApplicant(user: { nickname: string | null; email: string | null; phone: string | null } | null | undefined): string {
  if (!user) return ''
  return user.nickname || user.email || user.phone || ''
}

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

    const [pages, branches] = await Promise.all([
      prisma.page.findMany({
        where: { status: 'PENDING' },
        orderBy: { createdAt: 'desc' },
        include: {
          creator: {
            select: { id: true, nickname: true, email: true, phone: true },
          },
        },
      }),
      prisma.branch.findMany({
        where: { status: 'PENDING' },
        orderBy: { createdAt: 'desc' },
        include: {
          staff: {
            where: { role: 'PRESIDENT' },
            include: {
              user: {
                select: { id: true, nickname: true, email: true, phone: true },
              },
            },
            take: 1,
          },
        },
      }),
    ])

    const pageItems = pages.map((p) => ({
      type: 'page',
      id: p.id,
      slug: p.slug,
      name: p.name,
      category: p.category,
      communityCode: p.communityCode,
      status: p.status,
      applicant: getApplicant(p.creator),
      createdAt: p.createdAt,
    }))

    const branchItems = branches.map((b) => ({
      type: 'branch',
      id: b.id,
      slug: b.slug,
      name: b.name,
      branchType: b.branchType,
      category: b.category,
      communityCode: b.communityCode,
      status: b.status,
      applicant: getApplicant(b.staff[0]?.user),
      createdAt: b.createdAt,
    }))

    const data = [...pageItems, ...branchItems].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return NextResponse.json({ data })
  } catch (error) {
    console.error('讀取後台申請列表錯誤:', error)
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
    const { type, id, action } = body

    if (!type || !id || !action) {
      return NextResponse.json({ error: '請提供 type、id、action' }, { status: 400 })
    }

    if (!['page', 'branch'].includes(type)) {
      return NextResponse.json({ error: '無效的申請類型' }, { status: 400 })
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: '無效的操作' }, { status: 400 })
    }

    const status = action === 'approve' ? 'APPROVED' : 'REJECTED'

    if (type === 'page') {
      const existing = await prisma.page.findUnique({ where: { id } })
      if (!existing) {
        return NextResponse.json({ error: '主頁申請不存在' }, { status: 404 })
      }
      await prisma.page.update({
        where: { id },
        data: { status: status as 'APPROVED' | 'REJECTED' },
      })
    } else {
      const existing = await prisma.branch.findUnique({ where: { id } })
      if (!existing) {
        return NextResponse.json({ error: '分會申請不存在' }, { status: 404 })
      }
      await prisma.branch.update({
        where: { id },
        data: { status },
      })
    }

    return NextResponse.json({
      message: action === 'approve' ? '已通過' : '已拒絕',
      type,
      id,
      status,
    })
  } catch (error) {
    console.error('處理後台申請錯誤:', error)
    return NextResponse.json({ error: '操作失敗，請重試' }, { status: 500 })
  }
}
