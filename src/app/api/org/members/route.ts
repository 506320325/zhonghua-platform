import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

function getOrgWhere(type: string, id: string) {
  if (type === 'page') return { pageId: id }
  if (type === 'branch') return { branchId: id }
  if (type === 'tenant') return { tenantId: id }
  return null
}

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
    const { type, id, email, userId, roleId } = body

    if (!type || !id || !roleId || (!email && !userId)) {
      return NextResponse.json({ error: '請提供完整資料' }, { status: 400 })
    }

    const where = getOrgWhere(type, String(id))
    if (!where) {
      return NextResponse.json({ error: '不支持的類型' }, { status: 400 })
    }

    const user = userId
      ? await prisma.user.findUnique({ where: { id: String(userId) } })
      : await prisma.user.findUnique({ where: { email: String(email) } })

    if (!user) {
      return NextResponse.json({ error: '用戶不存在' }, { status: 404 })
    }

    const role = await prisma.organizationRole.findUnique({ where: { id: String(roleId) } })
    if (!role) {
      return NextResponse.json({ error: '職位不存在' }, { status: 404 })
    }

    const existing = await prisma.organizationMember.findFirst({
      where: {
        ...(where as any),
        userId: user.id,
        roleId: role.id,
      },
    })

    if (existing) {
      return NextResponse.json({ message: '該用戶已有此職位' })
    }

    const member = await prisma.organizationMember.create({
      data: {
        ...(where as any),
        userId: user.id,
        roleId: role.id,
      },
    })

    return NextResponse.json({ message: '已分配職位', member }, { status: 201 })
  } catch (error) {
    console.error('分配職位錯誤:', error)
    return NextResponse.json({ error: '分配失敗' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
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

    const { searchParams } = new URL(req.url)
    const memberId = searchParams.get('id')

    if (!memberId) {
      return NextResponse.json({ error: '請提供 id' }, { status: 400 })
    }

    await prisma.organizationMember.delete({ where: { id: memberId } })

    return NextResponse.json({ message: '已取消職位' })
  } catch (error) {
    console.error('取消職位錯誤:', error)
    return NextResponse.json({ error: '取消失敗' }, { status: 500 })
  }
}
