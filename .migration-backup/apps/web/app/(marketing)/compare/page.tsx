import Link from 'next/link'
import { COMPETITORS } from '@/data/competitors'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Compare Email Verification Tools | CleanBounce',
  description: 'Compare CleanBounce vs legacy email verification tools. See why modern teams switch to CleanBounce for predictive deliverability and real-time form protection.',
  alternates: {
    canonical: 'https://cleanbounce.io/compare'
  }
}

export default function CompareHubPage() {
  const competitorsList = Object.values(COMPETITORS)

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 font-sans antialiased pt-24 pb-36">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
            The Modern Alternative to Legacy Email Verification
          </h1>
          <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto">
            Traditional tools just clean lists. CleanBounce predicts bounce behavior, monitors domain health, and blocks disposable emails at the form level.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {competitorsList.map((comp) => (
            <Link 
              key={comp.id} 
              href={`/compare/cleanbounce-vs-${comp.slug}`}
              className="bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-${comp.themeColor}-50 text-${comp.themeColor}-600 flex items-center justify-center font-bold text-xl`}>
                    {comp.name.charAt(0)}
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    vs {comp.name}
                  </h2>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
              <p className="text-slate-600">
                See why teams are switching from {comp.name} to get predictive deliverability intelligence and sub-85ms API speeds.
              </p>
            </Link>
          ))}
        </div>

      </div>
    </div>
  )
}
