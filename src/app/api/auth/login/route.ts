import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = 'zhonghua-platform-secret-key-2026'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { account, password } = body

    if (!account || !password) {
      return NextResponse.json({ error: '账号和密码必填' }, { status: 400 })
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: account },
          { phone: account },
        ],
      },
    })

    if (!user) {
      return NextResponse.json({ error: '账号不存在' }, { status: 401 })
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return NextResponse.json({ error: '密码错误' }, { status: 401 })
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        nickname: user.nickname,
        role: user.role,
        canPublishVideo: user.canPublishVideo,
      },
    })
  } catch (error) {
    console.error('登录错误:', error)
    return NextResponse.json({ error: '登录失败，请重试' }, { status: 500 })
  }
}
