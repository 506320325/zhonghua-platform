import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

function parseParticipants(value: string | null): string[] {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) return NextResponse.json({ error: '未授權' }, { status: 401 })
    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: '無效的 token' }, { status: 401 })

    const { id } = await params
    const post = await prisma.post.findUnique({ where: { id } })
    if (!post || post.type !== 'INVITE' || post.status === 'CANCELLED') {
      return NextResponse.json({ error: '邀約不存在或已取消' }, { status: 404 })
    }

    const participants = parseParticipants(post.participants)
    if (participants.includes(decoded.userId)) {
      return NextResponse.json({ message: '你已報名' })
    }

    if (post.maxParticipants && post.currentCount >= post.maxParticipants) {
      return NextResponse.json({ error: '邀約已滿' }, { status: 400 })
    }

    participants.push(decoded.userId)
    const newCount = post.currentCount + 1
    const full = post.maxParticipants ? newCount >= post.maxParticipants : false

    await prisma.post.update({
      where: { id },
      data: {
        participants: JSON.stringify(participants),
        currentCount: newCount,
        status: full ? 'FULL' : 'PUBLISHED',
      },
    })

    return NextResponse.json({ message: full ? '已報名，人數已滿' : '已報名' }, { status: 200 })
  } catch (error) {
    console.error('邀約報名錯誤:', error)
    return NextResponse.json({ error: '報名失敗' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) return NextResponse.json({ error: '未授權' }, { status: 401 })
    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: '無效的 token' }, { status: 401 })

    const { id } = await params
    const post = await prisma.post.findUnique({ where: { id } })
    if (!post || post.type !== 'INVITE') {
      return NextResponse.json({ error: '邀約不存在' }, { status: 404 })
    }

    const participants = parseParticipants(post.participants).filter((uid) => uid !== decoded.userId)
    const newCount = Math.max(0, post.currentCount - 1)

    await prisma.post.update({
      where: { id },
      data: {
        participants: JSON.stringify(participants),
        currentCount: newCount,
        status: 'PUBLISHED',
      },
    })

    return NextResponse.json({ message: '已取消報名' })
  } catch (error) {
    console.error('取消邀約報名錯誤:', error)
    return NextResponse.json({ error: '取消失敗' }, { status: 500 })
  }
}
