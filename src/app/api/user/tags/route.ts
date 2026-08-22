import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    if (!userId) return NextResponse.json({ error: '缺少 userId' }, { status: 400 })
    const data = await prisma.userTag.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ data })
  } catch (error) {
    console.error('讀取標記錯誤:', error)
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
    if (!body.userId || !body.tag) return NextResponse.json({ error: '請提供 userId 和 tag' }, { status: 400 })

    const data = await prisma.userTag.create({
      data: {
        userId: String(body.userId),
        tenantId: body.tenantId || null,
        branchId: body.branchId || null,
        tag: String(body.tag),
        note: body.note ? String(body.note) : null,
        createdBy: decoded.userId,
      },
    })
    return NextResponse.json({ message: '標記已新增', data }, { status: 201 })
  } catch (error) {
    console.error('新增標記錯誤:', error)
    return NextResponse.json({ error: '新增失敗' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: '缺少 id' }, { status: 400 })
    await prisma.userTag.delete({ where: { id } })
    return NextResponse.json({ message: '已刪除標記' })
  } catch (error) {
    console.error('刪除標記錯誤:', error)
    return NextResponse.json({ error: '刪除失敗' }, { status: 500 })
  }
}
