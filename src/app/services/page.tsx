'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function ServicesPage() {
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/services')
      .then((r) => r.json())
      .then((d) => setItems(d.data || []))
      .catch(() => setItems([]))
  }, [])

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary">服務預約</h1>
        <Link href="/bookings" className="text-sm text-gray-500 hover:text-primary">我的預約</Link>
      </div>

      {items.length === 0 ? (
        <p className="text-gray-400 text-center py-12">暫無服務</p>
      ) : (
        <div className="space-y-3">
          {items.map((s) => (
            <div key={s.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800">{s.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{s.category}{s.duration ? ` · ${s.duration}分鐘` : ''}{s.price ? ` · HK$${s.price}` : ''}</p>
              {s.description && <p className="text-sm text-gray-500 mt-1">{s.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
