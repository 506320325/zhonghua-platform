import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

function getOrgWhere(type: string, id: string) {
  if (type === 'page') return { pageId: id }
  if (type === 'branch') return { branchId: id }
  if (type === 'tenant') return { tenantId: id }
  return null
}

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

    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')
    const id = searchParams.get('id')

    if (!type || !id || !['page', 'branch', 'tenant'].includes(type)) {
      return NextResponse.json({ error: '參數不正確' }, { status: 400 })
    }

    const where = getOrgWhere(type, id)
    if (!where) {
      return NextResponse.json({ error: '不支持的類型' }, { status: 400 })
    }

    const existingCount = await prisma.organizationRole.count({
      where: where as any,
    })

    if (existingCount === 0) {
      const defaults = type === 'branch'
        ? [
            { name: '會長', level: 100 },
            { name: '副會長', level: 80 },
            { name: '理事', level: 50 },
            { name: '會員', level: 10 },
          ]
        : [
            { name: '創建者', level: 100 },
            { name: '管理員', level: 80 },
            { name: '員工', level: 50 },
            { name: '會員', level: 10 },
          ]

      await prisma.organizationRole.createMany({
        data: defaults.map((item) => ({
          ...(where as any),
          ...item,
          isDefault: true,
        })),
      })
    }

    const roles = await prisma.organizationRole.findMany({
      where: where as any,
      orderBy: { level: 'desc' },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                nickname: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json({
      data: roles.map((role) => ({
        id: role.id,
        name: role.name,
        level: role.level,
        isDefault: role.isDefault,
        members: role.members.map((m) => ({
          id: m.id,
          user: m.user,
        })),
      })),
    })
  } catch (error) {
    console.error('讀取職位錯誤:', error)
    return NextResponse.json({ error: '讀取失敗' }, { status: 500 })
  }
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
    const { type, id, name, level } = body

    if (!type || !id || !name) {
      return NextResponse.json({ error: '請提供 type、id、name' }, { status: 400 })
    }

    const where = getOrgWhere(type, String(id))
    if (!where) {
      return NextResponse.json({ error: '不支持的類型' }, { status: 400 })
    }

    const role = await prisma.organizationRole.create({
      data: {
        ...(where as any),
        name: String(name),
        level: Number(level || 0),
        isDefault: false,
      },
    })

    return NextResponse.json({ message: '職位已新增', role }, { status: 201 })
  } catch (error) {
    console.error('新增職位錯誤:', error)
    return NextResponse.json({ error: '新增失敗' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
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
    const { roleId, name, level } = body

    if (!roleId) {
      return NextResponse.json({ error: '請提供 roleId' }, { status: 400 })
    }

    const role = await prisma.organizationRole.update({
      where: { id: String(roleId) },
      data: {
        ...(name !== undefined ? { name: String(name) } : {}),
        ...(level !== undefined ? { level: Number(level) } : {}),
      },
    })

    return NextResponse.json({ message: '職位已更新', role })
  } catch (error) {
    console.error('更新職位錯誤:', error)
    return NextResponse.json({ error: '更新失敗' }, { status: 500 })
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
    const roleId = searchParams.get('id')

    if (!roleId) {
      return NextResponse.json({ error: '請提供 id' }, { status: 400 })
    }

    const role = await prisma.organizationRole.findUnique({ where: { id: roleId } })
    if (!role) {
      return NextResponse.json({ error: '職位不存在' }, { status: 404 })
    }
    if (role.isDefault) {
      return NextResponse.json({ error: '默認職位不可刪除' }, { status: 400 })
    }

    await prisma.organizationRole.delete({ where: { id: roleId } })

    return NextResponse.json({ message: '職位已刪除' })
  } catch (error) {
    console.error('刪除職位錯誤:', error)
    return NextResponse.json({ error: '刪除失敗' }, { status: 500 })
  }
}

