import { getReport, getActivities } from '@/lib/supabase/actions'
import { SeverityBadge, StatusBadge } from '@/app/components/badges'
import { StatusControls } from './status-controls'
import { AssigneeControls } from './assignee-controls'
import { CommentForm } from './comment-form'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { GembaReport, ReportActivity } from '@/lib/supabase/types'

function isOverdue(report: GembaReport) {
  if (!report.due_date || report.status === 'closed') return false
  return new Date(report.due_date) < new Date(new Date().toDateString())
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function ActivityItem({ activity }: { activity: ReportActivity }) {
  const isComment = activity.activity_type === 'comment'
  const isStatus = activity.activity_type === 'status_change'
  const isAssignee = activity.activity_type === 'assignee_change'

  return (
    <div className="flex gap-3 text-sm">
      <div className="flex-shrink-0 mt-0.5">
        <div className={`w-2 h-2 rounded-full mt-1.5 ${isComment ? 'bg-blue-400' : 'bg-green-500'}`} />
      </div>
      <div className="flex-1 pb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-gray-800">{activity.actor_name ?? 'Team Member'}</span>
          {isStatus && (
            <span className="text-gray-500">
              changed status from <strong>{activity.old_value ?? 'none'}</strong> to <strong>{activity.new_value}</strong>
            </span>
          )}
          {isAssignee && (
            <span className="text-gray-500">
              changed assignee from <strong>{activity.old_value ?? 'unassigned'}</strong> to <strong>{activity.new_value}</strong>
            </span>
          )}
          {isComment && <span className="text-gray-500">commented</span>}
          <span className="text-gray-400 text-xs ml-auto">{formatDate(activity.created_at)}</span>
        </div>
        {activity.note && (
          <p className="mt-1 text-gray-600 bg-gray-50 rounded px-3 py-2">{activity.note}</p>
        )}
      </div>
    </div>
  )
}

export default async function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let report: GembaReport | null = null
  let activities: ReportActivity[] = []

  try {
    report = await getReport(id) as GembaReport
  } catch {
    notFound()
  }

  if (!report) notFound()

  try {
    activities = await getActivities(id) as ReportActivity[]
  } catch {
    // non-fatal
  }

  const overdue = isOverdue(report)

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div>
        <Link href="/reports" className="text-sm text-gray-500 hover:text-gray-700">← Back to dashboard</Link>
      </div>

      {/* Header card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <SeverityBadge severity={report.severity as any} />
              <StatusBadge status={report.status as any} />
              {overdue && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700 border border-red-200">
                  ⚠ Overdue
                </span>
              )}
            </div>
            <h1 className="text-xl font-bold text-gray-900">{report.title}</h1>
            <p className="text-sm text-gray-500 mt-1">{report.location}</p>
          </div>
        </div>

        <div className="mt-4 bg-gray-50 rounded-lg px-4 py-3">
          <p className="text-sm text-gray-700 leading-relaxed">{report.finding_text}</p>
        </div>

        <dl className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Reported By</dt>
            <dd className="mt-1 text-gray-800">{report.reported_by ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</dt>
            <dd className={`mt-1 ${overdue ? 'text-red-600 font-medium' : 'text-gray-800'}`}>
              {report.due_date ? new Date(report.due_date + 'T00:00:00').toLocaleDateString() : '—'}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Team</dt>
            <dd className="mt-1 text-gray-800">{(report as any).teams?.name ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Created</dt>
            <dd className="mt-1 text-gray-800">{new Date(report.created_at).toLocaleDateString()}</dd>
          </div>
        </dl>
      </div>

      {/* Update controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatusControls reportId={report.id} currentStatus={report.status as any} />
        <AssigneeControls reportId={report.id} currentAssignee={report.assigned_to} />
      </div>

      {/* Activity log */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Activity Log</h2>
        {activities.length === 0 ? (
          <p className="text-sm text-gray-400">No activity yet.</p>
        ) : (
          <div className="divide-y divide-transparent">
            {activities.map(a => <ActivityItem key={a.id} activity={a} />)}
          </div>
        )}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <CommentForm reportId={report.id} />
        </div>
      </div>
    </div>
  )
}
