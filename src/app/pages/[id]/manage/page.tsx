'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import OrgRoleManager from '@/components/OrgRoleManager'
import OrgJoinSettings from '@/components/OrgJoinSettings'

export default function ManagePage() {
  const params = useParams()
  const id = params.id as string

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary">主頁職位管理</h1>
        <Link href="/pages/my" className="text-sm text-gray-500 hover:text-primary">返回</Link>
      </div>
      <div className="space-y-5">
        <OrgRoleManager type="page" id={id} />
        <OrgJoinSettings type="page" id={id} />
      </div>
    </div>
  )
}
