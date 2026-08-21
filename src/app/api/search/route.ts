import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = (searchParams.get('q') || '').trim()

    if (!q) {
      return NextResponse.json({ data: { pages: [], branches: [], users: [], posts: [] } })
    }

    const [pages, branches, users, posts] = await Promise.all([
      prisma.page.findMany({
        where: {
          status: 'APPROVED',
          OR: [
            { name: { contains: q } },
            { category: { contains: q } },
            { description: { contains: q } },
            { communityCode: { contains: q } },
          ],
        },
        take: 20,
        select: {
          id: true,
          name: true,
          slug: true,
          category: true,
          communityCode: true,
        },
      }),
      prisma.branch.findMany({
        where: {
          status: 'APPROVED',
          OR: [
            { name: { contains: q } },
            { communityCode: { contains: q } },
            { description: { contains: q } },
          ],
        },
        take: 20,
        select: {
          id: true,
          name: true,
          slug: true,
          branchType: true,
          communityCode: true,
        },
      }),
      prisma.user.findMany({
        where: {
          OR: [
            { nickname: { contains: q } },
            { email: { contains: q } },
            { phone: { contains: q } },
            { skills: { contains: q } },
            { hobbies: { contains: q } },
            { education: { contains: q } },
          ],
        },
        take: 20,
        select: {
          id: true,
          nickname: true,
          email: true,
          phone: true,
          skills: true,
          hobbies: true,
        },
      }),
      prisma.post.findMany({
        where: {
          status: 'PUBLISHED',
          OR: [
            { title: { contains: q } },
            { content: { contains: q } },
          ],
        },
        take: 20,
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
        },
      }),
    ])

    return NextResponse.json({
      data: {
        pages,
        branches,
        users,
        posts,
      },
    })
  } catch (error) {
    console.error('搜索錯誤:', error)
    return NextResponse.json({ error: '搜索失敗' }, { status: 500 })
  }
}

