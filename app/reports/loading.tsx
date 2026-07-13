export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 px-4 py-4 h-20" />
        ))}
      </div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-12 border-b border-gray-100 bg-gray-50/50" />
        ))}
      </div>
    </div>
  )
}
