import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

function createBaseSlug(name: string): string {
  const base = name
    .trim()
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  if (base) return base
  return `page-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

async function generateUniqueSlug(name: string): Promise<string> {
  const base = createBaseSlug(name)
  let slug = base
  let i = 1

  while (await prisma.page.findUnique({ where: { slug } })) {
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
      name,
      orgType,
      certType,
      category,
      communityCode,
      phone,
      email,
      description,
      certNumber,
      parentOrg,
      declaration,
    } = body

    if (!name || !orgType || !certType || !category || !communityCode) {
      return NextResponse.json({ error: '請填寫完整資料' }, { status: 400 })
    }

    const slug = await generateUniqueSlug(String(name))

    const page = await prisma.$transaction(async (tx) => {
      const created = await tx.page.create({
        data: {
          slug,
          name: String(name).trim(),
          orgType: String(orgType),
          certType: String(certType),
          category: String(category),
          communityCode: String(communityCode),
          phone: phone ? String(phone) : null,
          email: email ? String(email) : null,
          description: description ? String(description) : null,
          certNumber: certNumber ? String(certNumber) : null,
          parentOrg: parentOrg ? String(parentOrg) : null,
          declaration: declaration ? String(declaration) : null,
          status: 'PENDING',
          createdById: decoded.userId,
        },
      })

      await tx.pageStaff.create({
        data: {
          pageId: created.id,
          userId: decoded.userId,
          role: 'OWNER',
        },
      })

      return created
    })

    return NextResponse.json({
      message: '主頁申請已提交',
      pageId: page.id,
      slug: page.slug,
      status: page.status,
    }, { status: 201 })
  } catch (error) {
    console.error('建立主頁錯誤:', error)
    return NextResponse.json({ error: '提交失敗，請重試' }, { status: 500 })
  }
}
