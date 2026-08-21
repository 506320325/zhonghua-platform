import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

const BRANCH_TYPES = [
  'MEDIATION',
  'LEGAL',
  'CHARITY',
  'COMMUNITY',
  'COMMUNITY_LIFE',
  'PROFESSIONAL',
  'SUPPLY_CHAIN',
  'CUSTOM',
]

function createBaseSlug(name: string): string {
  const base = name
    .trim()
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  if (base) return base
  return `branch-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

async function generateUniqueSlug(name: string): Promise<string> {
  const base = createBaseSlug(name)
  let slug = base
  let i = 1

  while (await prisma.branch.findUnique({ where: { slug } })) {
    slug = `${base}-${i}`
    i += 1
  }

  return slug
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
      branchType,
      name,
      communityCode,
      category,
      description,
      termStart,
      termEnd,
    } = body

    if (!branchType || !name || !communityCode || !termStart || !termEnd) {
      return NextResponse.json({ error: '請填寫完整資料' }, { status: 400 })
    }

    if (!BRANCH_TYPES.includes(branchType)) {
      return NextResponse.json({ error: '無效的分會類型' }, { status: 400 })
    }

    const start = new Date(termStart)
    const end = new Date(termEnd)
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
      return NextResponse.json({ error: '任職時間不正確' }, { status: 400 })
    }

    const slug = await generateUniqueSlug(String(name))

    const branch = await prisma.$transaction(async (tx) => {
      const created = await tx.branch.create({
        data: {
          slug,
          name: String(name).trim(),
          branchType,
          communityCode: String(communityCode),
          category: category ? String(category) : null,
          description: description ? String(description) : null,
          isExclusive: branchType === 'COMMUNITY' ? true : false,
          scope: branchType === 'COMMUNITY_LIFE' ? 'community' : null,
          canAllResidentsJoin: branchType === 'COMMUNITY_LIFE' ? true : false,
          councillorWeighted: branchType === 'COMMUNITY_LIFE' ? true : false,
          joinRequiresApproval: branchType === 'COMMUNITY' ? true : false,
          joinRequiresReferrer: branchType === 'COMMUNITY' ? true : false,
          termStart: start,
          termEnd: end,
          status: 'PENDING',
        },
      })

      await tx.branchStaff.create({
        data: {
          branchId: created.id,
          userId: decoded.userId,
          role: 'PRESIDENT',
        },
      })

      return created
    })

    return NextResponse.json({
      message: '分會申請已提交',
      branchId: branch.id,
      slug: branch.slug,
      status: branch.status,
    }, { status: 201 })
  } catch (error) {
    console.error('申請分會錯誤:', error)
    return NextResponse.json({ error: '提交失敗，請重試' }, { status: 500 })
  }
}
