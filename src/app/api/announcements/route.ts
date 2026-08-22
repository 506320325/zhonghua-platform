import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const scope = searchParams.get('scope') || 'PLATFORM'
    const tenantId = searchParams.get('tenantId')
    const branchId = searchParams.get('branchId')

    const where: any = {
      isActive: true,
      scope,
      ...(tenantId ? { tenantId } : {}),
      ...(branchId ? { branchId } : {}),
    }

    const data = await prisma.announcement.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 20,
    })

    return NextResponse.json({ data })
  } catch (error) {
    console.error('讀取公告錯誤:', error)
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
    if (!body.title || !body.content) {
      return NextResponse.json({ error: '請填寫標題和內容' }, { status: 400 })
    }

    const data = await prisma.announcement.create({
      data: {
        title: String(body.title),
        content: String(body.content),
        scope: body.scope || 'PLATFORM',
        tenantId: body.tenantId || null,
        branchId: body.branchId || null,
        startAt: body.startAt ? new Date(body.startAt) : new Date(),
        endAt: body.endAt ? new Date(body.endAt) : null,
        createdBy: decoded.userId,
      },
    })

    return NextResponse.json({ message: '公告已發佈', data }, { status: 201 })
  } catch (error) {
    console.error('發佈公告錯誤:', error)
    return NextResponse.json({ error: '發佈失敗' }, { status: 500 })
  }
}
