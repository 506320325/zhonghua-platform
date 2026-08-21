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

    const staffRows = await prisma.pageStaff.findMany({
      where: { userId: decoded.userId },
      include: { page: true },
      orderBy: { createdAt: 'desc' },
    })

    const data = staffRows.map((staff) => ({
      id: staff.page.id,
      name: staff.page.name,
      type: staff.page.orgType,
      category: staff.page.category,
      communityCode: staff.page.communityCode,
      status: staff.page.status,
      slug: staff.page.slug,
      role: staff.role,
      createdAt: staff.page.createdAt,
    }))

    return NextResponse.json({ data })
  } catch (error) {
    console.error('讀取我的主頁錯誤:', error)
    return NextResponse.json({ error: '讀取失敗，請重試' }, { status: 500 })
  }
}
