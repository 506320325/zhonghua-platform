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
    const { branchId, referrerEmail } = body
    if (!branchId) {
      return NextResponse.json({ error: '請提供分會 ID' }, { status: 400 })
    }

    const branch = await prisma.branch.findUnique({ where: { id: String(branchId) } })
    if (!branch || branch.status !== 'APPROVED') {
      return NextResponse.json({ error: '分會不存在或未通過審批' }, { status: 404 })
    }

    if (branch.joinRequiresReferrer && !referrerEmail) {
      return NextResponse.json({ error: '此分會需要推薦人 Email' }, { status: 400 })
    }

    const existing = await prisma.branchStaff.findFirst({
      where: {
        branchId: branch.id,
        userId: decoded.userId,
      },
    })

    if (existing) {
      if (existing.status === 'PENDING') {
        return NextResponse.json({ message: '已提交加入申請，等待審核' })
      }
      return NextResponse.json({ message: '你已經是這個分會的成員' })
    }

    const referrer = referrerEmail
      ? await prisma.user.findUnique({ where: { email: String(referrerEmail) } })
      : null

    const status = branch.joinRequiresApproval ? 'PENDING' : 'ACTIVE'

    await prisma.branchStaff.create({
      data: {
        branchId: branch.id,
        userId: decoded.userId,
        role: 'MEMBER',
        status,
        referrerId: referrer?.id || null,
        referrerEmail: referrerEmail ? String(referrerEmail) : null,
      },
    })

    return NextResponse.json({
      message: status === 'PENDING' ? '加入申請已提交，等待審核' : '已加入分會',
      branchId: branch.id,
      status,
    }, { status: 201 })
  } catch (error) {
    console.error('加入分會錯誤:', error)
    return NextResponse.json({ error: '加入失敗，請重試' }, { status: 500 })
  }
}
