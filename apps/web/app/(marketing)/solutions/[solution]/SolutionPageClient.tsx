'use client'

import { SOLUTIONS, SOLUTION_LABELS, SolutionData } from '@/data/solutions'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'

// ─── Animation Helpers ────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
}
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

// ─── Section: Hero ────────────────────────────────────────────────────────────
function Hero({ data }: { data: SolutionData }) {
  return (
    <section className="relative overflow-hidden pt-28 pb-32 lg:pt-36 lg:pb-44 bg-white border-b border-slate-200">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-15%] left-[-5%] w-[600px] h-[600px] rounded-full bg-blue-500/8 blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-500/8 blur-[120px]" />
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold tracking-widest uppercase mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
            </span>
            {data.hero.badge}
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.08] mb-8">
            {data.hero.headline}
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed mb-12 max-w-2xl mx-auto">
            {data.hero.subheadline}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-lg shadow-xl shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {data.hero.ctaText}
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-lg transition-all shadow-sm"
            >
              View Pricing →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Section: Results Bar ─────────────────────────────────────────────────────
function ResultsBar({ data }: { data: SolutionData }) {
  return (
    <section className="bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-800"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          {data.results.map((res, i) => (
            <motion.div key={i} variants={fadeUp} className="py-12 text-center px-6">
              <div className="text-4xl lg:text-5xl font-extrabold text-white mb-2">{res.metric}</div>
              <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">{res.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── Section: Problem ─────────────────────────────────────────────────────────
function ProblemSection({ data }: { data: SolutionData }) {
  return (
    <section className="py-24 lg:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div variants={fadeUp}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-red-50 border border-red-200 text-red-600 text-xs font-bold uppercase tracking-widest mb-6">
              <span className="w-2 h-2 rounded-full bg-red-500" /> The Problem
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">{data.problem.title}</h2>
            <p className="text-slate-600 leading-relaxed text-lg mb-8">{data.problem.description}</p>
            <ul className="space-y-4">
              {data.problem.points.map((point, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <span className="text-slate-700 font-medium leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeUp} className="bg-white border border-red-200 rounded-2xl p-8 shadow-xl shadow-red-500/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-400" />
            <div className="text-center py-8">
              <div className="text-6xl mb-6">😓</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Without CleanBounce</h3>
              <div className="space-y-3 text-left mt-6">
                {[
                  'Campaigns landing in spam folders',
                  'ESP accounts getting suspended',
                  'Sender reputation slowly degrading',
                  'ROI tanking with each bad send',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 px-3 bg-red-50 rounded-lg border border-red-100">
                    <span className="text-red-500 font-bold">✗</span>
                    <span className="text-sm text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Section: Why Choose ──────────────────────────────────────────────────────
function WhyChooseSection({ data }: { data: SolutionData }) {
  return (
    <section className="py-24 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">{data.whyChoose.title}</h2>
        </motion.div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {data.whyChoose.reasons.map((r, i) => (
            <motion.div key={i} variants={fadeUp} className="text-center bg-slate-50 border border-slate-200 rounded-2xl p-8 hover:shadow-lg hover:border-blue-200 transition-all duration-300">
              <div className="text-5xl mb-6">{r.icon}</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{r.title}</h3>
              <p className="text-slate-600 leading-relaxed">{r.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── Section: Solution (Problem/Solution Split) ───────────────────────────────
function SolutionSection({ data }: { data: SolutionData }) {
  return (
    <section className="py-24 lg:py-32 bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div variants={fadeUp} className="bg-slate-950/80 border border-emerald-500/30 rounded-2xl p-8 shadow-xl shadow-emerald-500/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
            <div className="text-center py-8">
              <div className="text-6xl mb-6">🚀</div>
              <h3 className="text-2xl font-bold text-white mb-3">With CleanBounce</h3>
              <div className="space-y-3 text-left mt-6">
                {data.solution.points.map((point, i) => (
                  <div key={i} className="flex items-start gap-3 py-2 px-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                    <span className="text-emerald-400 font-bold flex-shrink-0 mt-0.5">✓</span>
                    <span className="text-sm text-slate-300">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> The CleanBounce Solution
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 leading-tight">{data.solution.title}</h2>
            <p className="text-slate-400 leading-relaxed text-lg">{data.solution.description}</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Section: Features ────────────────────────────────────────────────────────
function FeaturesSection({ data }: { data: SolutionData }) {
  const config = {
    verification: {
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      style: 'bg-blue-50 text-blue-600 border-blue-100',
      label: 'Email Verification',
      href: '/features/single',
    },
    leadshield: {
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      style: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      label: 'LeadShield™',
      href: '/leadshield',
    },
    intelligence: {
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      style: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      label: 'Email Intelligence',
      href: '/email-intelligence',
    },
  }

  return (
    <section className="py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">Built For Your Workflow</h2>
          <p className="text-slate-500 text-lg">The CleanBounce features specifically suited to your use case.</p>
        </motion.div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {data.features.map(feat => {
            const c = config[feat.id]
            return (
              <motion.div
                key={feat.id}
                variants={fadeUp}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-8 hover:shadow-xl hover:border-blue-200 transition-all duration-300 group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 border ${c.style} group-hover:scale-110 transition-transform`}>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={c.icon} />
                  </svg>
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{c.label}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feat.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-6">{feat.description}</p>
                <Link href={c.href} className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group-hover:gap-2 transition-all">
                  Learn More
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

// ─── Section: Workflow Diagram ────────────────────────────────────────────────
function WorkflowSection({ data }: { data: SolutionData }) {
  const colorMap = {
    slate: { card: 'bg-slate-800 border-slate-700', text: 'text-slate-300', dot: 'bg-slate-500', label: 'text-slate-400' },
    blue: { card: 'bg-blue-900/60 border-blue-700/50', text: 'text-blue-200', dot: 'bg-blue-500', label: 'text-blue-400' },
    indigo: { card: 'bg-indigo-900/60 border-indigo-700/50', text: 'text-indigo-200', dot: 'bg-indigo-500', label: 'text-indigo-400' },
    emerald: { card: 'bg-emerald-900/50 border-emerald-600/40', text: 'text-emerald-200', dot: 'bg-emerald-500', label: 'text-emerald-400' },
  }

  return (
    <section className="py-24 bg-slate-950 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">{data.workflow.title}</h2>
          <p className="text-slate-400 text-lg">See exactly how CleanBounce fits into your existing process.</p>
        </motion.div>

        <motion.div
          className="flex flex-col lg:flex-row items-stretch gap-0 max-w-5xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {data.workflow.steps.map((step, idx) => {
            const c = colorMap[step.color]
            return (
              <motion.div key={idx} variants={fadeUp} className="flex-1 flex flex-col lg:flex-row items-stretch">
                <div className={`flex-1 border ${c.card} rounded-2xl p-6 flex flex-col gap-3`}>
                  <div className={`w-8 h-8 rounded-full ${c.dot} flex items-center justify-center text-white text-sm font-extrabold flex-shrink-0`}>
                    {idx + 1}
                  </div>
                  <div>
                    <div className={`text-sm font-extrabold mb-1 ${c.label}`}>{step.label}</div>
                    <div className={`text-xs leading-relaxed ${c.text}`}>{step.detail}</div>
                  </div>
                </div>
                {idx < data.workflow.steps.length - 1 && (
                  <>
                    {/* Desktop arrow */}
                    <div className="hidden lg:flex items-center px-2 text-slate-600">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    {/* Mobile arrow */}
                    <div className="flex lg:hidden justify-center py-2 text-slate-600">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </>
                )}
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

// ─── Section: Integrations ────────────────────────────────────────────────────
function IntegrationsSection({ data }: { data: SolutionData }) {
  return (
    <section className="py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">Works With Your Stack</h2>
          <p className="text-slate-500 text-lg">Connects to the tools you already use.</p>
        </motion.div>
        <motion.div
          className="flex flex-wrap justify-center gap-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {data.integrations.map((intg, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="px-6 py-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all flex items-center gap-3"
            >
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <div>
                <div className="text-sm font-bold text-slate-900">{intg.name}</div>
                <div className="text-xs text-slate-400">{intg.category}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        <div className="text-center mt-10">
          <Link href="/integrations" className="text-blue-600 font-bold hover:text-blue-700 text-sm flex items-center justify-center gap-1">
            View all integrations →
          </Link>
        </div>
      </div>
    </section>
  )
}

// ─── Section: Global Trust Bar ────────────────────────────────────────────────
function TrustBar() {
  const items = [
    { icon: '🔒', label: 'SOC2 Certified' },
    { icon: '🇪🇺', label: 'GDPR Ready' },
    { icon: '⚡', label: '99.99% Uptime SLA' },
    { icon: '🎯', label: '99.9% Accuracy' },
    { icon: '🌐', label: 'Global Edge Network' },
    { icon: '💳', label: 'No Credit Card Needed' },
  ]
  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">Trusted by 10,000+ Teams Worldwide</p>
        <div className="flex flex-wrap justify-center gap-6">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-slate-600 text-sm font-semibold">
              <span className="text-base">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Section: FAQ ─────────────────────────────────────────────────────────────
function FAQSection({ data }: { data: SolutionData }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  return (
    <section className="py-24 bg-white border-b border-slate-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
        </motion.div>
        <div className="space-y-3">
          {data.faq.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden"
            >
              <button
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
              >
                <span className="text-base font-bold text-slate-900">{f.q}</span>
                <svg
                  className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${openIdx === i ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIdx === i && (
                <div className="px-6 pb-5 text-slate-600 leading-relaxed border-t border-slate-200 pt-4">
                  {f.a}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Section: Related Solutions ───────────────────────────────────────────────
function RelatedSolutions({ data }: { data: SolutionData }) {
  const related = data.relatedSlugs
    .map(slug => SOLUTIONS[slug])
    .filter(Boolean)

  return (
    <section className="py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-extrabold text-slate-900 mb-10 text-center">Explore Other Solutions</h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {related.map(rel => (
            <motion.div key={rel.slug} variants={fadeUp}>
              <Link
                href={`/solutions/${rel.slug}`}
                className="block bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-lg group transition-all duration-300"
              >
                <div className="inline-flex px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold tracking-widest uppercase mb-4 self-start">
                  {rel.hero.badge}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{rel.hero.headline}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-4">{rel.hero.subheadline}</p>
                <span className="text-sm font-bold text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                  Explore <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── Section: Final CTA ───────────────────────────────────────────────────────
function FinalCTA({ data }: { data: SolutionData }) {
  return (
    <section className="relative py-32 bg-slate-900 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-600/20 blur-[140px] rounded-full" />
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">
            Start protecting your business today.
          </h2>
          <p className="text-xl text-slate-400 mb-10 max-w-xl mx-auto">
            200 free credits. No credit card required. Get results in under 60 seconds.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white hover:bg-slate-50 text-blue-600 font-bold text-lg shadow-2xl shadow-white/10 transition-all hover:scale-[1.02]"
            >
              {data.hero.ctaText}
            </Link>
            <Link
              href="/solutions"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl border border-slate-700 hover:border-slate-600 text-slate-300 font-semibold text-lg transition-all"
            >
              ← All Solutions
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Main Page Component ──────────────────────────────────────────────────────
interface PageProps {
  data: SolutionData
}

export default function SolutionPageClient({ data }: PageProps) {
  return (
    <div className="bg-slate-50 font-sans antialiased">
      <Hero data={data} />
      <ResultsBar data={data} />
      <ProblemSection data={data} />
      <WhyChooseSection data={data} />
      <SolutionSection data={data} />
      <FeaturesSection data={data} />
      <WorkflowSection data={data} />
      <IntegrationsSection data={data} />
      <TrustBar />
      <FAQSection data={data} />
      <RelatedSolutions data={data} />
      <FinalCTA data={data} />
    </div>
  )
}
