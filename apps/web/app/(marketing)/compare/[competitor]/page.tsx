import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { COMPETITORS } from '@/data/competitors'

interface ComparePageProps {
  params: {
    competitor: string
  }
}

// 1. Generate Static Routes during build
export function generateStaticParams() {
  return Object.keys(COMPETITORS).map((slug) => ({
    competitor: `cleanbounce-vs-${slug}`,
  }))
}

// 2. Dynamic SEO Metadata
export function generateMetadata({ params }: ComparePageProps): Metadata {
  const competitorSlug = params.competitor.replace('cleanbounce-vs-', '')
  const data = COMPETITORS[competitorSlug]

  if (!data) {
    return { title: 'Compare | CleanBounce' }
  }

  return {
    title: `CleanBounce vs ${data.name} | The Modern Alternative`,
    description: data.heroSubheadline,
    alternates: {
      canonical: `https://cleanbounce.io/compare/cleanbounce-vs-${data.slug}`,
    },
    openGraph: {
      title: `CleanBounce vs ${data.name} | The Modern Alternative`,
      description: data.heroSubheadline,
      url: `https://cleanbounce.io/compare/cleanbounce-vs-${data.slug}`,
      type: 'website',
    },
  }
}

// 3. Page Component
export default function CompareCompetitorPage({ params }: ComparePageProps) {
  const competitorSlug = params.competitor.replace('cleanbounce-vs-', '')
  const data = COMPETITORS[competitorSlug]

  if (!data) {
    notFound()
  }

  const otherCompetitors = Object.values(COMPETITORS).filter(c => c.slug !== data.slug)

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 font-sans antialiased overflow-x-hidden">
      
      {/* HERO SECTION */}
      <section className="relative pt-20 pb-24 md:pt-28 md:pb-32 bg-slate-950 text-white overflow-hidden text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
            Compare CleanBounce
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-none bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            {data.heroHeadline}
          </h1>
          
          <p className="mt-6 text-lg sm:text-xl text-slate-400 leading-relaxed max-w-3xl mx-auto">
            {data.heroSubheadline}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all text-base active:scale-[0.98]"
            >
              Start Free Trial →
            </Link>
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Feature Comparison</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-slate-200/80 rounded-xl overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-5 text-sm font-bold text-slate-500 uppercase tracking-wider">Capabilities</th>
                  <th className="p-5 text-lg font-extrabold text-blue-600 bg-blue-50/30 border-x border-slate-200/80 w-1/3">CleanBounce</th>
                  <th className="p-5 text-lg font-bold text-slate-700 w-1/3">{data.name}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-semibold">
                <tr className="hover:bg-slate-50/40">
                  <td className="p-5 text-slate-900 font-bold">API Speed & Latency</td>
                  <td className="p-5 text-blue-700 bg-blue-50/10 border-x border-slate-200/80 flex items-center gap-2"><span className="text-emerald-500">✓</span> {data.table.cleanbounce.speed}</td>
                  <td className="p-5 text-slate-500">{data.table.competitor.speed}</td>
                </tr>
                <tr className="hover:bg-slate-50/40">
                  <td className="p-5 text-slate-900 font-bold">Inbound Form Protection</td>
                  <td className="p-5 text-blue-700 bg-blue-50/10 border-x border-slate-200/80 flex items-center gap-2"><span className="text-emerald-500">✓</span> {data.table.cleanbounce.inbound}</td>
                  <td className="p-5 text-slate-500">{data.table.competitor.inbound}</td>
                </tr>
                <tr className="hover:bg-slate-50/40">
                  <td className="p-5 text-slate-900 font-bold">Predictive Intelligence</td>
                  <td className="p-5 text-blue-700 bg-blue-50/10 border-x border-slate-200/80 flex items-center gap-2"><span className="text-emerald-500">✓</span> {data.table.cleanbounce.predictive}</td>
                  <td className="p-5 text-slate-500">{data.table.competitor.predictive}</td>
                </tr>
                <tr className="hover:bg-slate-50/40">
                  <td className="p-5 text-slate-900 font-bold">Catch-All Accuracy</td>
                  <td className="p-5 text-blue-700 bg-blue-50/10 border-x border-slate-200/80 flex items-center gap-2"><span className="text-emerald-500">✓</span> {data.table.cleanbounce.accuracy}</td>
                  <td className="p-5 text-slate-500">{data.table.competitor.accuracy}</td>
                </tr>
                <tr className="hover:bg-slate-50/40">
                  <td className="p-5 text-slate-900 font-bold">Pricing Model</td>
                  <td className="p-5 text-blue-700 bg-blue-50/10 border-x border-slate-200/80 flex items-center gap-2"><span className="text-emerald-500">✓</span> {data.table.cleanbounce.pricing}</td>
                  <td className="p-5 text-slate-500">{data.table.competitor.pricing}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* WHY TEAMS SWITCH */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Why Teams Switch From {data.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.reasons.map((reason, idx) => (
              <div key={idx} className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <div className="text-4xl mb-6">{reason.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{reason.title}</h3>
                <p className="text-slate-600 leading-relaxed">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900">Migration FAQ</h2>
          </div>
          <div className="space-y-6">
            {data.faqs.map((faq, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 p-6 rounded-xl">
                <h4 className="font-bold text-slate-900 mb-2">{faq.question}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RELATED COMPETITORS */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-8">Compare Other Alternatives</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {otherCompetitors.map((comp) => (
              <Link 
                key={comp.id}
                href={`/compare/cleanbounce-vs-${comp.slug}`}
                className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all"
              >
                vs {comp.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 bg-blue-600 text-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold tracking-tight">Ready to make the switch?</h2>
          <p className="mt-6 text-xl text-blue-100 max-w-2xl mx-auto">
            Join thousands of modern teams upgrading from legacy verification tools. Get 100 free credits when you sign up today.
          </p>
          <div className="mt-10">
            <Link
              href="/signup"
              className="px-8 py-4 bg-white text-blue-600 hover:bg-slate-50 font-bold rounded-xl shadow-lg transition-all text-lg active:scale-[0.98] inline-block"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
