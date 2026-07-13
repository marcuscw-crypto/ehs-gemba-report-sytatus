'use client'

import { useState, useTransition } from 'react'
import { updateAssignee } from '@/lib/supabase/actions'

export function AssigneeControls({
  reportId,
  currentAssignee,
}: {
  reportId: string
  currentAssignee: string | null
}) {
  const [assignee, setAssignee] = useState(currentAssignee ?? '')
  const [editValue, setEditValue] = useState(currentAssignee ?? '')
  const [actorName, setActorName] = useState('')
  const [editing, setEditing] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleSave() {
    if (editValue === assignee) { setEditing(false); return }
    const old = assignee
    setAssignee(editValue)
    setEditing(false)
    startTransition(async () => {
      try {
        await updateAssignee(reportId, old || null, editValue, actorName || 'Team Member')
      } catch {
        setAssignee(old)
        setEditValue(old)
      }
    })
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Assigned To</p>
      {editing ? (
        <div className="space-y-2">
          <input
            type="text"
            value={editValue}
            onChange={e => setEditValue(e.target.value)}
            placeholder="Team member name"
            autoFocus
            className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-green-600"
          />
          <input
            type="text"
            placeholder="Changed by (your name)"
            value={actorName}
            onChange={e => setActorName(e.target.value)}
            className="w-full rounded border border-gray-200 px-2 py-1.5 text-xs text-gray-600 focus:outline-none focus:ring-1 focus:ring-green-600"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isPending}
              className="bg-green-700 hover:bg-green-800 text-white text-xs font-medium px-3 py-1.5 rounded transition-colors disabled:opacity-50"
            >
              Save
            </button>
            <button
              onClick={() => { setEditValue(assignee); setEditing(false) }}
              className="text-gray-500 hover:text-gray-700 text-xs px-2 py-1.5"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-800">{assignee || <span className="text-gray-400 italic">Unassigned</span>}</span>
          <button
            onClick={() => setEditing(true)}
            className="text-xs text-green-700 hover:underline"
          >
            Edit
          </button>
        </div>
      )}
      {isPending && <p className="text-xs text-gray-400">Saving…</p>}
    </div>
  )
}
