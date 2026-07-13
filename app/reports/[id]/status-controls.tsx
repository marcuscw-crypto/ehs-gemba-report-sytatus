'use client'

import { useState, useTransition } from 'react'
import { updateStatus } from '@/lib/supabase/actions'
import type { Status } from '@/lib/supabase/types'

const STATUSES: { value: Status; label: string }[] = [
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'closed', label: 'Closed' },
]

export function StatusControls({
  reportId,
  currentStatus,
}: {
  reportId: string
  currentStatus: Status
}) {
  const [status, setStatus] = useState<Status>(currentStatus)
  const [actorName, setActorName] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleChange(newStatus: Status) {
    if (newStatus === status) return
    const old = status
    setStatus(newStatus)
    startTransition(async () => {
      try {
        await updateStatus(reportId, old, newStatus, actorName || 'Team Member')
      } catch {
        setStatus(old)
      }
    })
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Update Status</p>
      <div className="flex gap-2 flex-wrap">
        {STATUSES.map(s => (
          <button
            key={s.value}
            onClick={() => handleChange(s.value)}
            disabled={isPending}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
              status === s.value
                ? 'bg-green-700 text-white border-green-700'
                : 'bg-white text-gray-600 border-gray-300 hover:border-green-600 hover:text-green-700'
            } disabled:opacity-50`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <input
        type="text"
        placeholder="Your name (optional)"
        value={actorName}
        onChange={e => setActorName(e.target.value)}
        className="w-full rounded border border-gray-200 px-2 py-1.5 text-xs text-gray-600 focus:outline-none focus:ring-1 focus:ring-green-600"
      />
      {isPending && <p className="text-xs text-gray-400">Saving…</p>}
    </div>
  )
}
