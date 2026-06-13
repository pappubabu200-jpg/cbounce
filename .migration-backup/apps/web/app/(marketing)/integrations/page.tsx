import { Metadata } from 'next'
import Link from 'next/link'
import { INTEGRATIONS } from '@/data/integrations'
import IntegrationsClient from './IntegrationsClient'

export const metadata: Metadata = {
  title: 'Integrations — Connect CleanBounce to 15+ Tools',
  description: 'Connect CleanBounce to HubSpot, Mailchimp, Shopify, Zapier, Google Sheets, and 15+ more tools. Real-time email verification for every platform in your stack.',
  alternates: {
    canonical: 'https://cleanbounce.ai/integrations',
  },
  openGraph: {
    title: 'CleanBounce Integrations — Connect to 15+ Tools',
    description: 'Connect CleanBounce to HubSpot, Mailchimp, Shopify, Zapier, and more.',
    url: '/integrations',
    type: 'website',
  },
}

export default function IntegrationsPage() {
  const totalCount = INTEGRATIONS.length

  return (
    <div className="min-h-screen bg-white font-sans antialiased">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-28 pb-20 border-b border-slate-200">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-blue-500/8 blur-[130px]" />
          <div className="absolute bottom-[-5%] right-[-5%] w-[400px] h-[400px] rounded-full bg-indigo-500/8 blur-[110px]" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold tracking-widest uppercase mb-8">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {totalCount}+ Integrations Available
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.08] mb-8">
            CleanBounce Works With{' '}
            <span className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
              Your Whole Stack
            </span>
          </h1>

          <p className="text-xl text-slate-600 leading-relaxed mb-12 max-w-2xl mx-auto">
            Connect real-time email verification to the CRMs, ESPs, e-commerce platforms, and automation tools your team already uses.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-lg shadow-xl shadow-blue-500/25 transition-all hover:scale-[1.02]"
            >
              Start Free — 200 Credits
            </Link>
            <Link
              href="/developers"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-lg transition-all shadow-sm"
            >
              Read API Docs →
            </Link>
          </div>

          {/* Quick category links */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: '⭐ Featured', href: '#featured' },
              { label: '📧 Marketing', href: '#marketing' },
              { label: '🛒 E-Commerce', href: '#ecommerce' },
              { label: '🛠 Developer', href: '#developer' },
            ].map(item => (
              <a
                key={item.href}
                href={item.href}
                className="px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-sm font-semibold hover:border-blue-300 hover:text-blue-600 transition-all"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Bar ── */}
      <section className="py-8 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { icon: '🔒', label: 'SOC2 Certified' },
              { icon: '🇪🇺', label: 'GDPR Ready' },
              { icon: '⚡', label: 'Sub-100ms API' },
              { icon: '🎯', label: '99.9% Accuracy SLA' },
              { icon: '🌐', label: 'Global Edge Network' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-slate-600 text-sm font-semibold">
                <span>{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Dynamic Client Section (tabs + cards) ── */}
      <IntegrationsClient />

      {/* ── Final CTA ── */}
      <section className="py-32 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-600/15 blur-[130px] rounded-full" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">
            Ready to protect your stack?
          </h2>
          <p className="text-xl text-slate-400 mb-10 max-w-xl mx-auto">
            Get started with 200 free credits. No credit card required. Works with your tools in minutes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white hover:bg-slate-50 text-blue-600 font-bold text-lg shadow-2xl shadow-white/10 transition-all hover:scale-[1.02]"
            >
              Get Started Free
            </Link>
            <Link
              href="/compare"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl border border-slate-700 hover:border-slate-600 text-slate-300 font-semibold text-lg transition-all"
            >
              Compare CleanBounce →
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
