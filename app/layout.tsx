import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EHS Gemba Report Status',
  description: 'Track gemba walk findings, corrective actions, and closure statuses.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 min-h-screen">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div>
              <a href="/reports" className="text-xl font-bold text-gray-900 hover:text-green-700">
                EHS Gemba Reports
              </a>
              <p className="text-xs text-gray-500 mt-0.5">EHS Operations · Environment Health &amp; Safety</p>
            </div>
            <a
              href="/reports/new"
              className="bg-green-700 hover:bg-green-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              + Log New Report
            </a>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
      </body>
    </html>
  )
}
