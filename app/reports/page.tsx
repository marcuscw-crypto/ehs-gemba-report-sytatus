import { getReports } from '@/lib/supabase/actions'
import { SeverityBadge, StatusBadge } from '@/app/components/badges'
import type { GembaReport } from '@/lib/supabase/types'
import Link from 'next/link'

function isOverdue(report: GembaReport) {
  if (!report.due_date || report.status === 'closed') return false
  return new Date(report.due_date) < new Date(new Date().toDateString())
}

function severityWeight(s: string) {
  return { critical: 4, high: 3, medium: 2, low: 1 }[s] ?? 0
}

function sortReports(reports: GembaReport[]) {
  return [...reports].sort((a, b) => {
    const aOver = isOverdue(a) ? 1 : 0
    const bOver = isOverdue(b) ? 1 : 0
    if (bOver !== aOver) return bOver - aOver
    const sw = severityWeight(b.severity) - severityWeight(a.severity)
    if (sw !== 0) return sw
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })
}

export default async function ReportsPage() {
  let reports: GembaReport[] = []
  let fetchError = false

  try {
    reports = await getReports() as GembaReport[]
  } catch {
    fetchError = true
  }

  const sorted = sortReports(reports)

  const openCount = reports.filter(r => r.status === 'open').length
  const inProgressCount = reports.filter(r => r.status === 'in_progress').length
  const closedCount = reports.filter(r => r.status === 'closed').length
  const overdueCount = reports.filter(isOverdue).length

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SummaryCard label="Open" count={openCount} color="text-red-600" />
        <SummaryCard label="In Progress" count={inProgressCount} color="text-yellow-600" />
        <SummaryCard label="Closed" count={closedCount} color="text-green-600" />
        <SummaryCard label="Overdue" count={overdueCount} color="text-red-700" highlight />
      </div>

      {/* Error state */}
      {fetchError && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          Could not load reports. Try refreshing.
        </div>
      )}

      {/* Empty state */}
      {!fetchError && reports.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-500 text-sm">No reports yet — log the first one.</p>
          <Link
            href="/reports/new"
            className="mt-4 inline-block bg-green-700 hover:bg-green-800 text-white text-sm font-medium px-4 py-2 rounded-lg"
          >
            Log New Report
          </Link>
        </div>
      )}

      {/* Reports table */}
      {!fetchError && sorted.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Finding</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Location</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Assigned</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Due</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {sorted.map(report => {
                const overdue = isOverdue(report)
                return (
                  <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-start gap-2">
                        {overdue && (
                          <span className="mt-0.5 inline-block w-2 h-2 rounded-full bg-red-500 flex-shrink-0" title="Overdue" />
                        )}
                        <Link href={`/reports/${report.id}`} className="text-sm font-medium text-gray-900 hover:text-green-700 line-clamp-2">
                          {report.title}
                        </Link>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 hidden sm:table-cell max-w-xs truncate">{report.location}</td>
                    <td className="px-4 py-3"><SeverityBadge severity={report.severity as any} /></td>
                    <td className="px-4 py-3"><StatusBadge status={report.status as any} /></td>
                    <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">{report.assigned_to ?? '—'}</td>
                    <td className="px-4 py-3 text-sm hidden md:table-cell">
                      <span className={overdue ? 'text-red-600 font-medium' : 'text-gray-500'}>
                        {report.due_date ? new Date(report.due_date + 'T00:00:00').toLocaleDateString() : '—'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function SummaryCard({
  label, count, color, highlight,
}: {
  label: string; count: number; color: string; highlight?: boolean
}) {
  return (
    <div className={`bg-white rounded-lg border ${highlight && count > 0 ? 'border-red-300' : 'border-gray-200'} px-4 py-4`}>
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${color}`}>{count}</p>
    </div>
  )
}
