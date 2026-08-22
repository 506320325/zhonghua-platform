import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')

    const posts = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        ...(type ? { type } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 80,
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            email: true,
            phone: true,
          },
        },
      },
    })

    const data = posts.map((post) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      category: post.category,
      type: post.type,
      communityCode: post.communityCode,
      images: post.images ? JSON.parse(post.images) : [],
      videoUrl: post.videoUrl,
      videoDuration: post.videoDuration,
      location: post.location,
      inviteCategory: post.inviteCategory,
      maxParticipants: post.maxParticipants,
      currentCount: post.currentCount,
      deadline: post.deadline,
      isPinned: post.isPinned,
      status: post.status,
      createdAt: post.createdAt,
      author: post.user?.nickname || post.user?.email || post.user?.phone || '',
    }))

    return NextResponse.json({ data })
  } catch (error) {
    console.error('讀取內容列表錯誤:', error)
    return NextResponse.json({ error: '讀取失敗' }, { status: 500 })
  }
}
