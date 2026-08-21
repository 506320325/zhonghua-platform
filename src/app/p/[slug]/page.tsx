import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function PublicPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const page = await prisma.page.findUnique({
    where: { slug },
    include: {
      creator: {
        select: {
          id: true,
          nickname: true,
          email: true,
          phone: true,
        },
      },
      staff: {
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
      },
    },
  })

  if (!page || page.status !== 'APPROVED') {
    notFound()
  }

  const staff = page.staff || []
  const owner = staff.find((s) => s.role === 'OWNER') || null

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-24">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl font-bold text-primary shrink-0">
            {page.name.slice(0, 1)}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-800">{page.name}</h1>
            <p className="text-sm text-gray-500 mt-1">{page.category}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-xs bg-warm text-gray-600 px-2 py-0.5 rounded-full">
                📍 {page.communityCode}
              </span>
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {page.orgType}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">組織簡介</h2>
        <p className="text-gray-600 whitespace-pre-wrap leading-7">
          {page.description || '暫時未有簡介'}
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">聯絡方式</h2>
        <div className="space-y-3 text-sm">
          {page.phone && (
            <div className="flex items-center gap-3">
              <span className="text-gray-500 w-16">電話</span>
              <a href={`tel:${page.phone}`} className="text-primary hover:underline">{page.phone}</a>
            </div>
          )}
          {page.email && (
            <div className="flex items-center gap-3">
              <span className="text-gray-500 w-16">電郵</span>
              <a href={`mailto:${page.email}`} className="text-primary hover:underline">{page.email}</a>
            </div>
          )}
          {!page.phone && !page.email && (
            <p className="text-gray-400">暫時未有聯絡方式</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">負責人</h2>
        <p className="text-sm text-gray-600">
          {owner?.user?.nickname || page.creator?.nickname || '—'}
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">內容與服務</h2>
        <div className="space-y-2">
          <div className="bg-warm rounded-xl p-4 text-sm text-gray-500">
            📢 資訊與活動即將推出
          </div>
          <div className="bg-warm rounded-xl p-4 text-sm text-gray-500">
            👥 會員招募即將推出
          </div>
          <div className="bg-warm rounded-xl p-4 text-sm text-gray-500">
            📅 預約服務即將推出
          </div>
        </div>
      </div>

      <div className="text-center mt-8">
        <Link href="/" className="text-sm text-gray-400 hover:text-primary">
          返回首頁
        </Link>
      </div>
    </div>
  )
}
