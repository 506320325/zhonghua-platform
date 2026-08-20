'use client'

import { useState } from 'react'

export default function AdminBranchesPage() {
  const [applications] = useState([
    {
      id: '1',
      name: '火炭調解分會',
      branchType: 'MEDIATION',
      community: '火炭',
      applicant: '陳先生',
      status: 'PENDING',
      createdAt: '2026-08-19',
    },
    {
      id: '2',
      name: '沙田法律服務分會',
      branchType: 'LEGAL',
      community: '沙田市中心',
      applicant: '李律師',
      status: 'PENDING',
      createdAt: '2026-08-18',
    },
  ])

  return (
    <div className="min-h-screen bg-warm px-4 py-6 pb-24">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-primary mb-2">分會審批</h1>
        <p className="text-gray-500 text-sm mb-6">管理所有分會申請</p>

        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">{app.name}</h3>
                  <p className="text-sm text-gray-500">{app.branchType} · {app.community}</p>
                  <p className="text-sm text-gray-400 mt-1">申請人：{app.applicant}</p>
                </div>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">待審批</span>
              </div>
              <div className="flex gap-2 mt-4">
                <button className="flex-1 bg-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition">
                  批准
                </button>
                <button className="flex-1 bg-gray-200 text-gray-600 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition">
                  拒絕
                </button>
              </div>
            </div>
          ))}
        </div>

        {applications.length === 0 && (
          <div className="text-center py-12 text-gray-400">暫無待審批申請</div>
        )}
      </div>
    </div>
  )
}