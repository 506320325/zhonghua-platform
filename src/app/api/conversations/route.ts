import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

function parseParticipants(value: any): string[] {
  return Array.isArray(value) ? value : []
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) return NextResponse.json({ error: '未授權' }, { status: 401 })
    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: '無效的 token' }, { status: 401 })

    const all = await prisma.conversation.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 100,
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    })

    const data = all.filter((c) => parseParticipants(c.participants).includes(decoded.userId))
    return NextResponse.json({ data })
  } catch (error) {
    console.error('讀取會話列表錯誤:', error)
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
    const { type, targetId } = body
    if (!type || !['USER_TO_PLATFORM', 'USER_TO_TENANT', 'USER_TO_BRANCH'].includes(type)) {
      return NextResponse.json({ error: '無效的會話類型' }, { status: 400 })
    }

    const target = targetId ? String(targetId) : 'platform'
    const participants = [decoded.userId, target]

    const existing = await prisma.conversation.findMany({ where: { type }, take: 100 })
    const found = existing.find((c) => {
      const parts = parseParticipants(c.participants)
      return parts.includes(decoded.userId) && parts.includes(target)
    })

    if (found) return NextResponse.json({ data: found })

    const conv = await prisma.conversation.create({
      data: {
        participants,
        type,
      },
    })
    return NextResponse.json({ data: conv }, { status: 201 })
  } catch (error) {
    console.error('創建會話錯誤:', error)
    return NextResponse.json({ error: '創建失敗' }, { status: 500 })
  }
}
