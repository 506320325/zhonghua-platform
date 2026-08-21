import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, phone, password, nickname } = body
    if (!email && !phone) {
      return NextResponse.json({ error: 'Email 或 手机号 至少填一项' }, { status: 400 })
    }
    if (!password || password.length < 6) {
      return NextResponse.json({ error: '密码至少6位' }, { status: 400 })
    }
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          email ? { email } : {},
          phone ? { phone } : {},
        ],
      },
    })
    if (existingUser) {
      return NextResponse.json({ error: '用户已存在' }, { status: 409 })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        email: email || null,
        phone: phone || null,
        password: hashedPassword,
        nickname: nickname || '用户',
        role: 'USER',
      },
    })
    return NextResponse.json({ message: '注册成功', userId: user.id }, { status: 201 })
  } catch (error) {
    console.error('注册错误:', error)
    return NextResponse.json({ error: '注册失败，请重试' }, { status: 500 })
  }
}