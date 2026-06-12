'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  INTEGRATIONS,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  Integration,
  IntegrationCategory,
} from '@/data/integrations'

// ─── Animation ────────────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
}
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

// ─── Badge ────────────────────────────────────────────────────────────────────
function Badge({ text }: { text: string }) {
  const styles: Record<string, string> = {
    Popular: 'bg-amber-50 text-amber-700 border-amber-200',
    New: 'bg-violet-50 text-violet-700 border-violet-200',
    Enterprise: 'bg-blue-50 text-blue-700 border-blue-200',
  }
  return (
    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${styles[text] ?? ''}`}>
      {text}
    </span>
  )
}

// ─── Icon Tile ────────────────────────────────────────────────────────────────
function IconTile({ intg }: { intg: Integration }) {
  const isDeveloper = intg.category === 'developer'
  return (
    <div
      className={`w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-sm flex-shrink-0
        ${isDeveloper ? 'bg-slate-800 text-slate-100 border border-slate-700' : `${intg.color} ${intg.textColor} border border-slate-200`}`}
    >
      {intg.initial}
    </div>
  )
}

// ─── Featured Card (large) ────────────────────────────────────────────────────
function FeaturedCard({ intg }: { intg: Integration }) {
  return (
    <motion.div
      variants={fadeUp}
      className="group bg-white border border-slate-200 rounded-2xl p-7 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col gap-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-4">
          <IconTile intg={intg} />
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-lg font-bold text-slate-900">{intg.name}</h3>
              {intg.badge && <Badge text={intg.badge} />}
            </div>
            <span className="text-xs text-slate-400 font-medium">{intg.setupTime}</span>
          </div>
        </div>
      </div>

      <p className="text-slate-600 text-sm leading-relaxed flex-1">{intg.description}</p>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <Link
          href={intg.docsHref}
          className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 group-hover:gap-2.5 transition-all"
        >
          View Setup Guide
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
        <span className="text-[10px] text-slate-300 font-mono uppercase tracking-wider">Featured</span>
      </div>
    </motion.div>
  )
}

// ─── Standard Card (compact) ──────────────────────────────────────────────────
function StandardCard({ intg }: { intg: Integration }) {
  return (
    <motion.div
      variants={fadeUp}
      className="group bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 flex flex-col gap-4"
    >
      <div className="flex items-center gap-3">
        <IconTile intg={intg} />
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">{intg.name}</h3>
            {intg.badge && <Badge text={intg.badge} />}
          </div>
          <span className="text-[11px] text-slate-400 font-medium">{intg.setupTime}</span>
        </div>
      </div>

      <p className="text-slate-500 text-sm leading-relaxed flex-1">{intg.description}</p>

      <Link
        href={intg.docsHref}
        className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group-hover:gap-2 transition-all"
      >
        Setup Guide
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </Link>
    </motion.div>
  )
}

// ─── Developer Card (dark) ────────────────────────────────────────────────────
const CODE_SNIPPETS: Record<string, string> = {
  api: `curl -X GET \\
  "https://api.cleanbounce.ai/v1/verify" \\
  -H "Authorization: Bearer {API_KEY}" \\
  -d "email=user@example.com"`,
  webhooks: `// Payload example
{
  "event": "verification.complete",
  "email": "user@example.com",
  "status": "valid",
  "risk_score": 12
}`,
}

function DeveloperCard({ intg }: { intg: Integration }) {
  return (
    <motion.div
      variants={fadeUp}
      className="group bg-slate-950 border border-slate-800 rounded-2xl p-7 hover:border-blue-700/40 hover:shadow-xl hover:shadow-blue-900/20 transition-all duration-300 flex flex-col gap-5"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-extrabold text-sm text-slate-100">
          {intg.initial}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-lg font-bold text-white">{intg.name}</h3>
            {intg.badge && <Badge text={intg.badge} />}
          </div>
          <span className="text-xs text-slate-400 font-medium">{intg.setupTime}</span>
        </div>
      </div>

      <p className="text-slate-400 text-sm leading-relaxed">{intg.description}</p>

      {CODE_SNIPPETS[intg.slug] && (
        <pre className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs text-emerald-400 font-mono overflow-x-auto leading-relaxed">
          {CODE_SNIPPETS[intg.slug]}
        </pre>
      )}

      <Link
        href={intg.docsHref}
        className="inline-flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors"
      >
        View Docs
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </Link>
    </motion.div>
  )
}

// ─── Category Filter Tabs ─────────────────────────────────────────────────────
type FilterTab = 'all' | IntegrationCategory

const TABS: { id: FilterTab; label: string }[] = [
  { id: 'all', label: 'All Integrations' },
  { id: 'featured', label: 'Featured' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'ecommerce', label: 'Website & E-Commerce' },
  { id: 'developer', label: 'Developer' },
]

// ─── Main Client Component ────────────────────────────────────────────────────
export default function IntegrationsClient() {
  const [activeTab, setActiveTab] = useState<FilterTab>('all')

  const visibleCategories = activeTab === 'all'
    ? CATEGORY_ORDER
    : [activeTab as IntegrationCategory]

  return (
    <div>
      {/* ── Category Filter Tabs ── */}
      <div className="sticky top-16 z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto gap-1 py-3 scrollbar-hide">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150
                  ${activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Integration Sections ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {visibleCategories.map(category => {
            const items = INTEGRATIONS.filter(i => i.category === category)
            if (!items.length) return null

            return (
              <section
                key={category}
                id={category}
                className={`py-20 ${category === 'developer' ? 'bg-slate-950 border-t border-slate-800' : category === 'ecommerce' ? 'bg-slate-50 border-t border-slate-200' : 'bg-white border-t border-slate-200'}`}
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  {/* Section Header */}
                  <div className="mb-12">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-widest mb-4 ${
                      category === 'developer'
                        ? 'bg-slate-800 text-slate-300 border border-slate-700'
                        : 'bg-blue-50 text-blue-600 border border-blue-100'
                    }`}>
                      {CATEGORY_LABELS[category]}
                    </div>
                    <h2 className={`text-2xl sm:text-3xl font-extrabold mb-3 ${category === 'developer' ? 'text-white' : 'text-slate-900'}`}>
                      {category === 'featured' && 'The Most-Used Integrations'}
                      {category === 'marketing' && 'Email Service Providers'}
                      {category === 'ecommerce' && 'Websites & Online Stores'}
                      {category === 'developer' && 'For Developers — Connect Anything'}
                    </h2>
                    <p className={`text-lg ${category === 'developer' ? 'text-slate-400' : 'text-slate-500'}`}>
                      {category === 'featured' && 'CleanBounce connects to the tools most teams already rely on.'}
                      {category === 'marketing' && 'Protect your sender reputation and improve campaign deliverability.'}
                      {category === 'ecommerce' && 'Validate customer emails and block promo code abuse at checkout.'}
                      {category === 'developer' && 'Full REST API and real-time webhooks. If it can make an HTTP request, it works with CleanBounce.'}
                    </p>

                    {/* Solution cross-link */}
                    {category === 'marketing' && (
                      <Link href="/solutions/email-marketers" className="inline-flex items-center gap-1.5 mt-4 text-sm font-bold text-blue-600 hover:text-blue-700">
                        Using these for campaigns? See the Email Marketer Solution →
                      </Link>
                    )}
                    {category === 'ecommerce' && (
                      <Link href="/solutions/ecommerce" className="inline-flex items-center gap-1.5 mt-4 text-sm font-bold text-blue-600 hover:text-blue-700">
                        Running an online store? See the E-Commerce Solution →
                      </Link>
                    )}
                    {category === 'developer' && (
                      <Link href="/solutions/saas-companies" className="inline-flex items-center gap-1.5 mt-4 text-sm font-bold text-blue-400 hover:text-blue-300">
                        Building an app? See the SaaS Solution →
                      </Link>
                    )}
                  </div>

                  {/* Cards Grid */}
                  <motion.div
                    className={
                      category === 'featured'
                        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                        : category === 'developer'
                        ? 'grid grid-cols-1 lg:grid-cols-2 gap-6'
                        : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'
                    }
                    variants={stagger}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                  >
                    {items.map(intg =>
                      category === 'featured' ? (
                        <FeaturedCard key={intg.slug} intg={intg} />
                      ) : category === 'developer' ? (
                        <DeveloperCard key={intg.slug} intg={intg} />
                      ) : (
                        <StandardCard key={intg.slug} intg={intg} />
                      )
                    )}
                  </motion.div>
                </div>
              </section>
            )
          })}
        </motion.div>
      </AnimatePresence>

      {/* ── Request Integration Block ── */}
      {(activeTab === 'all' || activeTab === 'developer') && (
        <section className={`py-20 ${activeTab === 'developer' ? 'bg-slate-900' : 'bg-white'} border-t border-slate-800`}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="text-4xl mb-4">🔌</div>
            <h2 className="text-2xl font-extrabold text-white mb-3">Don't see your tool?</h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Any platform that supports webhooks or HTTP requests works with CleanBounce out of the box. Or request a native integration.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/developers"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold border border-slate-700 transition-all"
              >
                Read API Docs →
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-slate-700 hover:border-slate-600 text-slate-300 font-semibold transition-all"
              >
                Request an Integration
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
