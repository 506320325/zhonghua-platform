import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

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

    if (!type || !id || !['page', 'branch'].includes(type)) {
      return NextResponse.json({ error: '參數不正確' }, { status: 400 })
    }

    if (type === 'page') {
      const page = await prisma.page.findUnique({
        where: { id: String(id) },
        select: { id: true, joinRequiresApproval: true, joinRequiresReferrer: true },
      })
      return NextResponse.json({ data: page })
    }

    const branch = await prisma.branch.findUnique({
      where: { id: String(id) },
      select: { id: true, joinRequiresApproval: true, joinRequiresReferrer: true },
    })
    return NextResponse.json({ data: branch })
  } catch (error) {
    console.error('讀取加入設置錯誤:', error)
    return NextResponse.json({ error: '讀取失敗' }, { status: 500 })
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
    const { type, id, joinRequiresApproval, joinRequiresReferrer } = body

    if (!type || !id || !['page', 'branch'].includes(type)) {
      return NextResponse.json({ error: '參數不正確' }, { status: 400 })
    }

    const data: any = {}
    if (typeof joinRequiresApproval === 'boolean') data.joinRequiresApproval = joinRequiresApproval
    if (typeof joinRequiresReferrer === 'boolean') data.joinRequiresReferrer = joinRequiresReferrer

    if (type === 'page') {
      await prisma.page.update({ where: { id: String(id) }, data })
    } else {
      await prisma.branch.update({ where: { id: String(id) }, data })
    }

    return NextResponse.json({ message: '加入設置已更新' })
  } catch (error) {
    console.error('更新加入設置錯誤:', error)
    return NextResponse.json({ error: '更新失敗' }, { status: 500 })
  }
}

