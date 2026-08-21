import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('zh-HK', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

export default async function PublicBranchPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const branch = await prisma.branch.findUnique({
    where: { slug },
    include: {
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

  if (!branch || branch.status !== 'APPROVED') {
    notFound()
  }

  const staff = branch.staff || []
  const president = staff.find((s) => s.role === 'PRESIDENT') || null
  const vicePresidents = staff.filter((s) => s.role === 'VICE_PRESIDENT')
  const members = staff.filter((s) => !['PRESIDENT', 'VICE_PRESIDENT'].includes(s.role))

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-24">
      {/* 分會頭部 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl font-bold text-primary shrink-0">
            {branch.name.slice(0, 1)}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-800">{branch.name}</h1>
            <p className="text-sm text-gray-500 mt-1">{branch.branchType}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-xs bg-warm text-gray-600 px-2 py-0.5 rounded-full">
                📍 {branch.communityCode}
              </span>
              {branch.category && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {branch.category}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 簡介 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">分會簡介</h2>
        <p className="text-gray-600 whitespace-pre-wrap leading-7">
          {branch.description || '暫時未有簡介'}
        </p>
      </div>

      {/* 任職時間 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">本屆任職時間</h2>
        <p className="text-sm text-gray-600">
          {formatDate(branch.termStart)} 至 {formatDate(branch.termEnd)}
        </p>
      </div>

      {/* 會長與成員 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">會長與成員</h2>
        {president && (
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">會長</span>
            <span className="text-sm font-medium text-gray-800">
              {president.user.nickname || president.user.email || president.user.phone || '—'}
            </span>
          </div>
        )}
        {vicePresidents.map((v) => (
          <div key={v.id} className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">副會長</span>
            <span className="text-sm font-medium text-gray-800">
              {v.user.nickname || v.user.email || v.user.phone || '—'}
            </span>
          </div>
        ))}
        {members.map((m) => (
          <div key={m.id} className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">成員</span>
            <span className="text-sm font-medium text-gray-800">
              {m.user.nickname || m.user.email || m.user.phone || '—'}
            </span>
          </div>
        ))}
        {staff.length === 0 && (
          <p className="text-sm text-gray-400">暫時未有成員資料</p>
        )}
      </div>

      {/* 即將推出 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">分會活動與加入</h2>
        <div className="space-y-2">
          <div className="bg-warm rounded-xl p-4 text-sm text-gray-500">
            📢 分會活動即將推出
          </div>
          <div className="bg-warm rounded-xl p-4 text-sm text-gray-500">
            👥 加入分會入口即將推出
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
