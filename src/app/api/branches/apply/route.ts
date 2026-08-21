import { NextRequest, NextResponse } from 'next/server'
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
    console.log('申請分會請求:', { userId, ...body })

    return NextResponse.json({
      message: '分會申請已提交',
      branchId: 'mock-branch-id',
    }, { status: 201 })
  } catch (error) {
    console.error('申請分會錯誤:', error)
    return NextResponse.json({ error: '提交失敗，請重試' }, { status: 500 })
  }
}