'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import OrgRoleManager from '@/components/OrgRoleManager'
import OrgJoinSettings from '@/components/OrgJoinSettings'
import JoinRequests from '@/components/JoinRequests'

export default function ManageBranchPage() {
  const params = useParams()
  const id = params.id as string

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary">分會職位管理</h1>
        <Link href="/branches/my" className="text-sm text-gray-500 hover:text-primary">返回</Link>
      </div>
      <div className="space-y-5">
        <OrgRoleManager type="branch" id={id} />
        <OrgJoinSettings type="branch" id={id} />
        <JoinRequests branchId={id} />
      </div>
    </div>
  )
}
