import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import EventComments from '@/components/EventComments'

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const event = await prisma.eventPage.findUnique({
    where: { slug },
    include: {
      createdByUser: {
        select: { id: true, nickname: true, email: true, phone: true },
      },
    },
  })

  if (!event || !['PUBLISHED', 'ENDED', 'ARCHIVED'].includes(event.status)) {
    notFound()
  }

  const parse = (value: any) => (Array.isArray(value) ? value : [])

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-24">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{event.title}</h1>
        <p className="text-sm text-gray-500 mt-2">
          📅 {new Date(event.eventDate).toLocaleString('zh-HK')}
          {event.endDate ? ` 至 ${new Date(event.endDate).toLocaleString('zh-HK')}` : ''}
        </p>
        {event.location && <p className="text-sm text-gray-500 mt-1">📍 {event.location}</p>}
        <span className="inline-block mt-2 text-xs bg-warm text-gray-600 px-2 py-0.5 rounded-full">{event.status}</span>
      </div>

      {event.description && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">活動簡介</h2>
          <p className="text-gray-600 whitespace-pre-wrap">{event.description}</p>
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">主辦 / 協辦 / 支持 / 參加</h2>
        <div className="space-y-3 text-sm">
          {parse(event.organizers).length > 0 && (
            <div>
              <span className="text-gray-500">主辦：</span>
              {parse(event.organizers).map((o: any, i: number) => <span key={i} className="mr-2 text-gray-700">{o.name || o}</span>)}
            </div>
          )}
          {parse(event.coOrganizers).length > 0 && (
            <div>
              <span className="text-gray-500">協辦：</span>
              {parse(event.coOrganizers).map((o: any, i: number) => <span key={i} className="mr-2 text-gray-700">{o.name || o}</span>)}
            </div>
          )}
          {parse(event.supportingOrgs).length > 0 && (
            <div>
              <span className="text-gray-500">支持機構：</span>
              {parse(event.supportingOrgs).map((o: any, i: number) => <span key={i} className="mr-2 text-gray-700">{o.name || o}</span>)}
            </div>
          )}
          {parse(event.participantOrgs).length > 0 && (
            <div>
              <span className="text-gray-500">參加單位：</span>
              {parse(event.participantOrgs).map((o: any, i: number) => <span key={i} className="mr-2 text-gray-700">{o.name || o}</span>)}
            </div>
          )}
        </div>
      </div>

      {parse(event.guests).length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">特邀嘉賓</h2>
          <div className="space-y-2 text-sm">
            {parse(event.guests).map((g: any, i: number) => (
              <div key={i} className="border border-gray-100 rounded-xl p-3">
                <p className="font-medium text-gray-800">{g.name || g}</p>
                {g.title && <p className="text-gray-500 text-xs">{g.title}</p>}
                {g.bio && <p className="text-gray-500 text-xs mt-1">{g.bio}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {event.commentEnabled && <EventComments eventId={event.id} />}

      <div className="text-center mt-8">
        <Link href="/" className="text-sm text-gray-400 hover:text-primary">返回首頁</Link>
      </div>
    </div>
  )
}
