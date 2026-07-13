import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="text-center py-24">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Report not found</h1>
      <p className="text-gray-500 text-sm mb-6">The report you're looking for doesn't exist or was deleted.</p>
      <Link href="/reports" className="bg-green-700 hover:bg-green-800 text-white text-sm font-medium px-4 py-2 rounded-lg">
        Back to dashboard
      </Link>
    </div>
  )
}
