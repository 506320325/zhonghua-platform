import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) return NextResponse.json({ error: '未授權' }, { status: 401 })
    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: '無效的 token' }, { status: 401 })

    let pref = await prisma.userPreference.findUnique({ where: { userId: decoded.userId } })
    if (!pref) {
      pref = await prisma.userPreference.create({ data: { userId: decoded.userId } })
    }
    return NextResponse.json({ data: pref })
  } catch (error) {
    console.error('讀取偏好錯誤:', error)
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
    const data = await prisma.userPreference.upsert({
      where: { userId: decoded.userId },
      update: {
        noAd: !!body.noAd,
        noEventNotify: !!body.noEventNotify,
        noAllNotify: !!body.noAllNotify,
      },
      create: {
        userId: decoded.userId,
        noAd: !!body.noAd,
        noEventNotify: !!body.noEventNotify,
        noAllNotify: !!body.noAllNotify,
      },
    })
    return NextResponse.json({ message: '偏好已更新', data })
  } catch (error) {
    console.error('更新偏好錯誤:', error)
    return NextResponse.json({ error: '更新失敗' }, { status: 500 })
  }
}
