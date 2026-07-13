import type { Severity, Status } from '@/lib/supabase/types'

export function SeverityBadge({ severity }: { severity: Severity }) {
  const map: Record<Severity, string> = {
    critical: 'bg-red-100 text-red-800 border-red-200',
    high: 'bg-orange-100 text-orange-800 border-orange-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-blue-100 text-blue-800 border-blue-200',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${map[severity] ?? 'bg-gray-100 text-gray-700 border-gray-200'}`}>
      {severity}
    </span>
  )
}

export function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, string> = {
    open: 'bg-red-50 text-red-700 border-red-200',
    in_progress: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    closed: 'bg-green-50 text-green-700 border-green-200',
  }
  const labels: Record<Status, string> = {
    open: 'Open',
    in_progress: 'In Progress',
    closed: 'Closed',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${map[status] ?? 'bg-gray-100 text-gray-700 border-gray-200'}`}>
      {labels[status] ?? status}
    </span>
  )
}
