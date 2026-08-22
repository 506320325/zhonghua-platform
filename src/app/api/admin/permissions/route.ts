import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) return NextResponse.json({ error: '未授權' }, { status: 401 })
    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: '無效的 token' }, { status: 401 })

    const body = await req.json()
    if (!body.userId) return NextResponse.json({ error: '請提供 userId' }, { status: 400 })

    const user = await prisma.user.update({
      where: { id: String(body.userId) },
      data: {
        canManagePlatform: !!body.canManagePlatform,
        canManageTenant: !!body.canManageTenant,
        canManageBranch: !!body.canManageBranch,
      },
      select: { id: true, email: true, canManagePlatform: true, canManageTenant: true, canManageBranch: true },
    })

    return NextResponse.json({ message: '權限已更新', data: user })
  } catch (error) {
    console.error('更新權限錯誤:', error)
    return NextResponse.json({ error: '更新失敗' }, { status: 500 })
  }
}
