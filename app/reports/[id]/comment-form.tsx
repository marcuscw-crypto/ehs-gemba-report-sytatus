'use client'

import { useState, useTransition } from 'react'
import { addComment } from '@/lib/supabase/actions'

export function CommentForm({ reportId }: { reportId: string }) {
  const [note, setNote] = useState('')
  const [actorName, setActorName] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!note.trim()) return
    const text = note
    setNote('')
    startTransition(async () => {
      await addComment(reportId, text, actorName || 'Team Member')
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Add Comment</p>
      <textarea
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="Write a comment…"
        rows={2}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 resize-none"
      />
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Your name (optional)"
          value={actorName}
          onChange={e => setActorName(e.target.value)}
          className="flex-1 rounded border border-gray-200 px-2 py-1.5 text-xs text-gray-600 focus:outline-none focus:ring-1 focus:ring-green-600"
        />
        <button
          type="submit"
          disabled={isPending || !note.trim()}
          className="bg-green-700 hover:bg-green-800 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors disabled:opacity-40"
        >
          {isPending ? 'Posting…' : 'Post'}
        </button>
      </div>
    </form>
  )
}
