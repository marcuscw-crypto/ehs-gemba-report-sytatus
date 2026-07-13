'use client'
export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-6 text-center">
      <p className="text-sm text-red-700 font-medium">Could not load reports. Try refreshing.</p>
      <button onClick={reset} className="mt-3 text-sm text-red-600 underline">Retry</button>
    </div>
  )
}
