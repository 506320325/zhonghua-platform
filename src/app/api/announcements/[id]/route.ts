import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) return NextResponse.json({ error: '未授權' }, { status: 401 })
    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: '無效的 token' }, { status: 401 })

    const { id } = await params
    const ann = await prisma.announcement.findUnique({ where: { id } })
    if (!ann) return NextResponse.json({ error: '公告不存在' }, { status: 404 })
    if (ann.createdBy !== decoded.userId) return NextResponse.json({ error: '無權限刪除' }, { status: 403 })

    await prisma.announcement.update({ where: { id }, data: { isActive: false } })
    return NextResponse.json({ message: '公告已下架' })
  } catch (error) {
    console.error('刪除公告錯誤:', error)
    return NextResponse.json({ error: '刪除失敗' }, { status: 500 })
  }
}
