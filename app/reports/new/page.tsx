import { createReport } from '@/lib/supabase/actions'
import Link from 'next/link'

export default function NewReportPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/reports" className="text-sm text-gray-500 hover:text-gray-700">← Back to dashboard</Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Log New Report</h1>
        <p className="text-sm text-gray-500 mt-1">Record a finding from today's gemba walk.</p>
      </div>

      <form action={createReport} className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            placeholder="Short label for the finding"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="location">
            Location <span className="text-red-500">*</span>
          </label>
          <input
            id="location"
            name="location"
            type="text"
            required
            placeholder="e.g. Warehouse B – East Wing"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
          />
        </div>

        {/* Finding text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="finding_text">
            Finding Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="finding_text"
            name="finding_text"
            required
            rows={4}
            placeholder="Describe what was observed..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent resize-none"
          />
        </div>

        {/* Severity + Due date row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="severity">
              Severity <span className="text-red-500">*</span>
            </label>
            <select
              id="severity"
              name="severity"
              required
              defaultValue="medium"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent bg-white"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="due_date">
              Due Date
            </label>
            <input
              id="due_date"
              name="due_date"
              type="date"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
            />
          </div>
        </div>

        {/* Assigned to + Reported by row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="assigned_to">
              Assigned To
            </label>
            <input
              id="assigned_to"
              name="assigned_to"
              type="text"
              placeholder="Team member name"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="reported_by">
              Reported By
            </label>
            <input
              id="reported_by"
              name="reported_by"
              type="text"
              placeholder="Your name"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="bg-green-700 hover:bg-green-800 text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors"
          >
            Submit Report
          </button>
          <Link href="/reports" className="text-sm text-gray-500 hover:text-gray-700">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
