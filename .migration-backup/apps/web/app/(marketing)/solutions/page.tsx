import { SOLUTIONS } from '@/data/solutions'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Solutions by Industry | CleanBounce',
  description: 'Discover how CleanBounce solves email deliverability and bot protection for SaaS, Agencies, E-Commerce, Sales Teams, and more.',
  alternates: {
    canonical: 'https://cleanbounce.ai/solutions',
  },
}

const ICONS: Record<string, string> = {
  'email-marketers': '📧',
  'sales-teams': '🎯',
  'saas-companies': '🤖',
  'agencies': '🏢',
  'ecommerce': '🛒',
  'cold-email-outreach': '📤',
}

export default function SolutionsIndexPage() {
  const solutions = Object.values(SOLUTIONS)

  return (
    <div className="min-h-screen bg-white font-sans antialiased">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-28 pb-24 border-b border-slate-200">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-blue-500/8 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-indigo-500/8 blur-[100px]" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold tracking-widest uppercase mb-8">
            Solutions by Industry
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.08] mb-8">
            Built for Your{' '}
            <span className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
              Industry
            </span>
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Whether you're protecting SaaS trials, verifying B2B prospects, or cleaning massive agency databases — CleanBounce has a tailored solution for your workflow.
          </p>
        </div>
      </section>

      {/* ── Solutions Grid ── */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((solution) => (
              <Link
                key={solution.slug}
                href={`/solutions/${solution.slug}`}
                className="group bg-white rounded-2xl border border-slate-200 p-8 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col"
              >
                <div className="text-4xl mb-4">{ICONS[solution.slug] || '✉️'}</div>
                <div className="inline-flex px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold tracking-widest uppercase mb-4 self-start">
                  {solution.hero.badge}
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors leading-snug">
                  {solution.hero.headline}
                </h2>
                <p className="text-slate-600 mb-8 flex-1 leading-relaxed text-sm">
                  {solution.hero.subheadline}
                </p>

                <div className="border-t border-slate-100 pt-5 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm group-hover:gap-3 transition-all">
                    Explore Solution
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                  <div className="text-xs text-slate-400 font-medium">{solution.results.length} outcomes</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-600/15 blur-[120px] rounded-full" />
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">Don't see your use case?</h2>
          <p className="text-slate-400 text-lg mb-10">CleanBounce powers any workflow that requires email quality. Talk to our team.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/signup" className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white hover:bg-slate-50 text-blue-600 font-bold text-lg shadow-xl transition-all hover:scale-[1.02]">
              Start Free — 200 Credits
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
