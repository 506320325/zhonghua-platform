import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) return NextResponse.json({ error: '未授權' }, { status: 401 })
    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: '無效的 token' }, { status: 401 })

    const { id } = await params
    const body = await req.json()
    if (typeof body.blocked !== 'boolean') return NextResponse.json({ error: '請提供 blocked 布爾值' }, { status: 400 })

    const user = await prisma.user.update({
      where: { id },
      data: { blocked: body.blocked },
      select: { id: true, email: true, nickname: true, blocked: true },
    })
    return NextResponse.json({ message: body.blocked ? '已封禁' : '已解封', data: user })
  } catch (error) {
    console.error('更新用戶封禁錯誤:', error)
    return NextResponse.json({ error: '操作失敗' }, { status: 500 })
  }
}
