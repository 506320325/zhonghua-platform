import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) return NextResponse.json({ error: '未授權' }, { status: 401 })
    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: '無效的 token' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const mine = searchParams.get('mine') === '1'
    const where = mine ? { userId: decoded.userId } : {}

    const data = await prisma.booking.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
    })
    return NextResponse.json({ data })
  } catch (error) {
    console.error('讀取預約錯誤:', error)
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
    if (!body.serviceName || !body.bookingTime) {
      return NextResponse.json({ error: '請填寫服務名稱和預約時間' }, { status: 400 })
    }

    const data = await prisma.booking.create({
      data: {
        tenantId: body.tenantId || null,
        branchId: body.branchId || null,
        serviceName: String(body.serviceName),
        userId: decoded.userId,
        userName: body.userName ? String(body.userName) : '',
        userPhone: body.userPhone ? String(body.userPhone) : '',
        bookingTime: new Date(body.bookingTime),
        duration: body.duration ? Number(body.duration) : null,
        status: 'PENDING',
      },
    })

    return NextResponse.json({ message: '預約已提交，等待確認', data }, { status: 201 })
  } catch (error) {
    console.error('創建預約錯誤:', error)
    return NextResponse.json({ error: '預約失敗' }, { status: 500 })
  }
}
