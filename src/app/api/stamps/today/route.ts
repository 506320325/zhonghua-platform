import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

function todayString() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: '未授權' }, { status: 401 })
    }
    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: '無效的 token' }, { status: 401 })

    const date = todayString()
    let daily = await prisma.dailyStamp.findUnique({
      where: { userId_date: { userId: decoded.userId, date } },
    })
    if (!daily) {
      daily = await prisma.dailyStamp.create({
        data: { userId: decoded.userId, date, remaining: 3 },
      })
    }

    return NextResponse.json({ date, remaining: daily.remaining, dailyGranted: 3 })
  } catch (error) {
    console.error('讀取今日信貼錯誤:', error)
    return NextResponse.json({ error: '讀取失敗' }, { status: 500 })
  }
}
