import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

function slugify(text: string) {
  const base = text.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  return base || `event-${Date.now().toString(36)}`
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const mine = searchParams.get('mine') === '1'

    let where: any = { status: { in: ['PUBLISHED', 'ENDED', 'ARCHIVED'] } }

    if (mine) {
      const authHeader = req.headers.get('authorization')
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: '未授權' }, { status: 401 })
      }
      const token = authHeader.split(' ')[1]
      const decoded = verifyToken(token)
      if (!decoded) return NextResponse.json({ error: '無效的 token' }, { status: 401 })
      where = { ...where, createdBy: decoded.userId }
    }

    const events = await prisma.eventPage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
    })
    return NextResponse.json({ data: events })
  } catch (error) {
    console.error('讀取活動主頁錯誤:', error)
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
    const {
      title,
      description,
      eventDate,
      endDate,
      location,
      organizers,
      coOrganizers,
      supportingOrgs,
      participantOrgs,
      guests,
      commentEnabled,
      ratingEnabled,
    } = body

    if (!title || !eventDate) {
      return NextResponse.json({ error: '請填寫活動標題和日期' }, { status: 400 })
    }

    let slug = slugify(String(title))
    const existing = await prisma.eventPage.findUnique({ where: { slug } })
    if (existing) slug = `${slug}-${Date.now().toString(36)}`

    const event = await prisma.eventPage.create({
      data: {
        title: String(title),
        slug,
        description: description ? String(description) : null,
        eventDate: new Date(eventDate),
        endDate: endDate ? new Date(endDate) : null,
        location: location ? String(location) : null,
        organizers: organizers || [],
        coOrganizers: coOrganizers || [],
        supportingOrgs: supportingOrgs || [],
        participantOrgs: participantOrgs || [],
        guests: guests || [],
        commentEnabled: commentEnabled !== false,
        ratingEnabled: ratingEnabled !== false,
        status: 'DRAFT',
        createdBy: decoded.userId,
      },
    })

    return NextResponse.json({ message: '活動主頁已創建', event }, { status: 201 })
  } catch (error) {
    console.error('創建活動主頁錯誤:', error)
    return NextResponse.json({ error: '創建失敗' }, { status: 500 })
  }
}
