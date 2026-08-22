import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

const PATTERNS: Record<string, string> = {
  '誠心': '金色',
  '可靠': '藍色',
  '推薦': '紅色',
  '靠譜': '綠色',
  '熱心': '橙色',
  '專業': '紫色',
  '友善': '粉色',
  '承諾': '銀灰',
}

function todayString() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: '未授權' }, { status: 401 })
    }
    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: '無效的 token' }, { status: 401 })

    const body = await req.json()
    const { toType, toId, pattern, message } = body

    if (!toType || !toId || !pattern) {
      return NextResponse.json({ error: '請選擇對象和信貼類型' }, { status: 400 })
    }
    if (!PATTERNS[pattern]) {
      return NextResponse.json({ error: '無效的信貼類型' }, { status: 400 })
    }
    if (message && message.length > 20) {
      return NextResponse.json({ error: '留言不能超過 20 字' }, { status: 400 })
    }

    const date = todayString()
    const daily = await prisma.dailyStamp.upsert({
      where: { userId_date: { userId: decoded.userId, date } },
      update: {},
      create: { userId: decoded.userId, date, remaining: 3 },
    })

    if (daily.remaining <= 0) {
      return NextResponse.json({ error: '今日信貼已用完' }, { status: 400 })
    }

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const sameTarget = await prisma.stamp.findFirst({
      where: {
        fromUserId: decoded.userId,
        createdAt: { gte: todayStart },
        OR: [
          toType === 'user' ? { toUserId: String(toId) } : {},
          toType === 'tenant' ? { toTenantId: String(toId) } : {},
          toType === 'branch' ? { toBranchId: String(toId) } : {},
        ],
      },
    })

    if (sameTarget) {
      return NextResponse.json({ error: '你今天已貼過這個對象' }, { status: 400 })
    }

    const stamp = await prisma.stamp.create({
      data: {
        fromUserId: decoded.userId,
        toUserId: toType === 'user' ? String(toId) : null,
        toTenantId: toType === 'tenant' ? String(toId) : null,
        toBranchId: toType === 'branch' ? String(toId) : null,
        pattern,
        color: PATTERNS[pattern],
        message: message ? String(message) : null,
      },
    })

    await prisma.dailyStamp.update({
      where: { id: daily.id },
      data: { remaining: { decrement: 1 } },
    })

    return NextResponse.json({ message: '信貼已貼出', stampId: stamp.id, remaining: daily.remaining - 1 }, { status: 201 })
  } catch (error) {
    console.error('貼信貼錯誤:', error)
    return NextResponse.json({ error: '貼信貼失敗' }, { status: 500 })
  }
}
