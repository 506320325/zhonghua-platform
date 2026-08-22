import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET() {
  try {
    const data = await prisma.service.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })
    return NextResponse.json({ data })
  } catch (error) {
    console.error('讀取服務錯誤:', error)
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
    if (!body.name || !body.category) return NextResponse.json({ error: '請填寫服務名稱和分類' }, { status: 400 })

    const data = await prisma.service.create({
      data: {
        name: String(body.name),
        category: String(body.category),
        description: body.description ? String(body.description) : null,
        price: body.price ? Number(body.price) : null,
        duration: body.duration ? Number(body.duration) : null,
        tenantId: body.tenantId ? String(body.tenantId) : decoded.userId,
        confirmType: body.confirmType === 'AUTO' ? 'AUTO' : 'MANUAL',
        status: 'PUBLISHED',
      },
    })

    return NextResponse.json({ message: '服務已發布', data }, { status: 201 })
  } catch (error) {
    console.error('發布服務錯誤:', error)
    return NextResponse.json({ error: '發布失敗' }, { status: 500 })
  }
}
