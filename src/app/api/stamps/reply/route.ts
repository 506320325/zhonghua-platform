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

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) return NextResponse.json({ error: '未授權' }, { status: 401 })
    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: '無效的 token' }, { status: 401 })

    const body = await req.json()
    const { stampId, pattern, message } = body
    const original = await prisma.stamp.findUnique({ where: { id: String(stampId) } })
    if (!original) return NextResponse.json({ error: '信貼不存在' }, { status: 404 })
    if (!PATTERNS[pattern]) return NextResponse.json({ error: '無效的信貼類型' }, { status: 400 })

    const stamp = await prisma.stamp.create({
      data: {
        fromUserId: decoded.userId,
        toUserId: original.fromUserId,
        pattern,
        color: PATTERNS[pattern],
        message: message ? String(message).slice(0, 20) : null,
      },
    })

    return NextResponse.json({ message: '回貼成功', stampId: stamp.id }, { status: 201 })
  } catch (error) {
    console.error('回貼信貼錯誤:', error)
    return NextResponse.json({ error: '回貼失敗' }, { status: 500 })
  }
}
