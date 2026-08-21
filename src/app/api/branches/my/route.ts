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

    const staffRows = await prisma.branchStaff.findMany({
      where: { userId: decoded.userId },
      include: { branch: true },
      orderBy: { createdAt: 'desc' },
    })

    const data = staffRows.map((staff) => ({
      id: staff.branch.id,
      name: staff.branch.name,
      type: staff.branch.branchType,
      communityCode: staff.branch.communityCode,
      status: staff.branch.status,
      slug: staff.branch.slug,
      role: staff.role,
      createdAt: staff.branch.createdAt,
    }))

    return NextResponse.json({ data })
  } catch (error) {
    console.error('讀取我的分會錯誤:', error)
    return NextResponse.json({ error: '讀取失敗，請重試' }, { status: 500 })
  }
}
