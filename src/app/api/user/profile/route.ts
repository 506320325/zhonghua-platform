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

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        nickname: true,
        email: true,
        phone: true,
        education: true,
        skills: true,
        hobbies: true,
        bio: true,
        tags: true,
        pets: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: '用戶不存在' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('讀取個人資料錯誤:', error)
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
    const {
      education,
      skills,
      hobbies,
      bio,
      tags,
      pets,
    } = body

    const user = await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        education: education !== undefined ? String(education) : null,
        skills: skills !== undefined ? String(skills) : null,
        hobbies: hobbies !== undefined ? String(hobbies) : null,
        bio: bio !== undefined ? String(bio) : null,
        tags: tags !== undefined ? String(tags) : null,
        pets: pets !== undefined ? String(pets) : null,
      },
      select: {
        id: true,
        nickname: true,
        email: true,
        phone: true,
        education: true,
        skills: true,
        hobbies: true,
        bio: true,
        tags: true,
        pets: true,
      },
    })

    return NextResponse.json({
      message: '個人資料已更新',
      user,
    })
  } catch (error) {
    console.error('更新個人資料錯誤:', error)
    return NextResponse.json({ error: '更新失敗' }, { status: 500 })
  }
}
