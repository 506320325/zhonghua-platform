import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = 'zhonghua-platform-secret-key-2026'

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: '未授權' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    let userId: string
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
      userId = decoded.userId
    } catch {
      return NextResponse.json({ error: '無效的 token' }, { status: 401 })
    }

    const body = await req.json()
    const { name, type, category, communityCode, phone, email, description } = body

    if (!name || !type || !category || !communityCode) {
      return NextResponse.json({ error: '請填寫完整資料' }, { status: 400 })
    }

    const tenant = await prisma.tenant.create({
      data: {
        name,
        type,
        category,
        communityCode,
        adCode: communityCode,
        phone: phone || null,
        email: email || null,
        description: description || null,
        status: 'PENDING',
        verified: false,
      },
    })

    // 将当前用户添加为租户管理员
    await prisma.tenantStaff.create({
      data: {
        tenantId: tenant.id,
        userId: userId,
        role: 'ADMIN',
      },
    })

    return NextResponse.json({
      message: '入駐申請已提交',
      tenantId: tenant.id,
    }, { status: 201 })
  } catch (error) {
    console.error('租户入驻错误:', error)
    return NextResponse.json({ error: '提交失敗，請重試' }, { status: 500 })
  }
}