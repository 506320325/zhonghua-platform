'use client'

import { useEffect, useState } from 'react'

interface RoleMember {
  id: string
  user: {
    id: string
    nickname?: string | null
    email?: string | null
    phone?: string | null
  }
}

interface Role {
  id: string
  name: string
  level: number
  isDefault: boolean
  members: RoleMember[]
}

export default function OrgRoleManager({ type, id }: { type: 'page' | 'branch'; id: string }) {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [selectedRoleId, setSelectedRoleId] = useState('')
  const [message, setMessage] = useState('')

  const load = async () => {
    const token = localStorage.getItem('token')
    if (!token) return
    try {
      const res = await fetch(`/api/org/roles?type=${type}&id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (res.ok) setRoles(data.data || [])
    } catch {
      setRoles([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [type, id])

  const addRole = async () => {
    const token = localStorage.getItem('token')
    if (!token || !name.trim()) return
    setMessage('')
    const res = await fetch('/api/org/roles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ type, id, name: name.trim() }),
    })
    const data = await res.json()
    if (!res.ok) {
      setMessage(data.error || '新增失敗')
      return
    }
    setName('')
    setMessage('職位已新增')
    load()
  }

  const renameRole = async (role: Role) => {
    const newName = prompt('新的職位名稱', role.name)
    if (!newName) return
    const token = localStorage.getItem('token')
    if (!token) return
    const res = await fetch('/api/org/roles', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ roleId: role.id, name: newName }),
    })
    const data = await res.json()
    setMessage(res.ok ? data.message : (data.error || '更新失敗'))
    if (res.ok) load()
  }

  const deleteRole = async (role: Role) => {
    if (!confirm(`確定刪除職位「${role.name}」？`)) return
    const token = localStorage.getItem('token')
    if (!token) return
    const res = await fetch(`/api/org/roles?id=${role.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    setMessage(res.ok ? data.message : (data.error || '刪除失敗'))
    if (res.ok) load()
  }

  const assignMember = async () => {
    const token = localStorage.getItem('token')
    if (!token || !email.trim() || !selectedRoleId) return
    const res = await fetch('/api/org/members', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ type, id, email: email.trim(), roleId: selectedRoleId }),
    })
    const data = await res.json()
    setMessage(res.ok ? data.message : (data.error || '分配失敗'))
    if (res.ok) {
      setEmail('')
      setSelectedRoleId('')
      load()
    }
  }

  const removeMember = async (memberId: string) => {
    const token = localStorage.getItem('token')
    if (!token) return
    const res = await fetch(`/api/org/members?id=${memberId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    setMessage(res.ok ? data.message : (data.error || '取消失敗'))
    if (res.ok) load()
  }

  if (loading) return <p className="text-gray-400 py-8 text-center">載入中...</p>

  return (
    <div className="space-y-5">
      {message && <div className="bg-blue-50 text-blue-700 text-sm p-3 rounded-xl">{message}</div>}

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h2 className="font-semibold text-gray-800 mb-3">新增職位</h2>
        <div className="flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="職位名稱，例如：理事長 / 榮譽會長"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
          />
          <button onClick={addRole} className="bg-primary text-white text-sm px-4 py-2 rounded-lg hover:bg-primary-dark transition">
            新增
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h2 className="font-semibold text-gray-800 mb-3">分配成員</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="用戶 Email"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
          />
          <select
            value={selectedRoleId}
            onChange={(e) => setSelectedRoleId(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="">選擇職位</option>
            {roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
          <button onClick={assignMember} className="bg-primary text-white text-sm px-4 py-2 rounded-lg hover:bg-primary-dark transition">
            分配
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {roles.map((role) => (
          <div key={role.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-800">{role.name}</h3>
                <p className="text-xs text-gray-400">
                  {role.isDefault ? '默認職位' : '自定義職位'} · 層級 {role.level}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => renameRole(role)} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full hover:bg-gray-200">
                  改名
                </button>
                {!role.isDefault && (
                  <button onClick={() => deleteRole(role)} className="text-xs bg-red-50 text-red-500 px-3 py-1 rounded-full hover:bg-red-100">
                    刪除
                  </button>
                )}
              </div>
            </div>

            <div className="mt-3 space-y-1">
              {role.members.length === 0 ? (
                <p className="text-xs text-gray-400">暫無成員</p>
              ) : (
                role.members.map((m) => (
                  <div key={m.id} className="flex items-center justify-between text-sm text-gray-600 border-t border-gray-50 pt-2">
                    <span>{m.user.nickname || m.user.email || m.user.phone}</span>
                    <button onClick={() => removeMember(m.id)} className="text-xs text-red-400 hover:text-red-600">
                      取消
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
