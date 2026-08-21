import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
      take: 50,
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
      communityCode: post.communityCode,
      images: post.images ? JSON.parse(post.images) : [],
      videoUrl: post.videoUrl,
      videoDuration: post.videoDuration,
      status: post.status,
      createdAt: post.createdAt,
      author: post.user?.nickname || post.user?.email || post.user?.phone || '',
    }))

    return NextResponse.json({ data })
  } catch (error) {
    console.error('讀取內容列表錯誤:', error)
    return NextResponse.json({ error: '讀取失敗，請重試' }, { status: 500 })
  }
}
