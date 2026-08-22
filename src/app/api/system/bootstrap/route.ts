import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

const BOOTSTRAP_KEY = 'zhonghua-bootstrap-2026'

export async function POST(req: NextRequest) {
  try {
    const key = req.headers.get('x-bootstrap-key')
    if (key !== BOOTSTRAP_KEY) {
      return NextResponse.json({ error: '無權限' }, { status: 403 })
    }

    const email = '995abc@gmail.com'
    const phone = '65965865'
    const password = '965865'

    let user = await prisma.user.findFirst({
      where: { OR: [{ email }, { phone }] },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          phone,
          password: await bcrypt.hash(password, 10),
          nickname: '總會超級管理員',
          role: 'PLATFORM_ADMIN',
          superAdmin: true,
          canManagePlatform: true,
          canManageTenant: true,
          canManageBranch: true,
        },
      })
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          role: 'PLATFORM_ADMIN',
          superAdmin: true,
          canManagePlatform: true,
          canManageTenant: true,
          canManageBranch: true,
        },
      })
    }

    return NextResponse.json({
      message: '超級管理員已就緒',
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        superAdmin: user.superAdmin,
      },
    })
  } catch (error) {
    console.error('初始化超級管理員錯誤:', error)
    return NextResponse.json({ error: '初始化失敗' }, { status: 500 })
  }
}
