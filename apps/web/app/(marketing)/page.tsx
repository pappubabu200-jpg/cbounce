'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface Step {
  id: string
  label: string
  status: 'idle' | 'running' | 'success'
}

// ─── Shared Animated Counter ─────────────────────────────────────────────────
function AnimatedCounter({ target, decimals = 0, suffix = '' }: { target: number; decimals?: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const duration = 1500
    const startTime = performance.now()
    let animationFrameId: number
    const updateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = progress * (2 - progress)
      setCount(eased * target)
      if (progress < 1) animationFrameId = requestAnimationFrame(updateCount)
      else setCount(target)
    }
    animationFrameId = requestAnimationFrame(updateCount)
    return () => cancelAnimationFrame(animationFrameId)
  }, [target])
  return <span>{count.toFixed(decimals)}{suffix}</span>
}

// ─── LeadShield™ Sub-Components ─────────────────────────────────────────────

interface MetricCardProps {
  value: number
  label: string
  color: 'red' | 'orange' | 'amber' | 'emerald'
}

function MetricCard({ value, label, color }: MetricCardProps) {
  const colorMap = {
    red:     { badge: 'bg-red-500/15 text-red-400 border-red-500/20',             dot: 'bg-red-500' },
    orange:  { badge: 'bg-orange-500/15 text-orange-400 border-orange-500/20',    dot: 'bg-orange-500' },
    amber:   { badge: 'bg-amber-500/15 text-amber-400 border-amber-500/20',       dot: 'bg-amber-500' },
    emerald: { badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', dot: 'bg-emerald-500' },
  }
  const c = colorMap[color]
  return (
    <div className="bg-slate-900/70 border border-slate-700/60 rounded-xl p-5 flex flex-col gap-3">
      <div className={`self-start px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${c.badge}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
        {label}
      </div>
      <dl>
        <dd className="text-3xl font-extrabold text-white tracking-tight">
          <AnimatedCounter target={value} />
        </dd>
      </dl>
    </div>
  )
}

interface ProtectionChipProps {
  icon: React.ReactNode
  label: string
}

function ProtectionChip({ icon, label }: ProtectionChipProps) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-700 bg-slate-800/60 text-slate-300 text-xs font-semibold">
      <span className="text-blue-400">{icon}</span>
      {label}
    </div>
  )
}

const ACTIVITY_LOG = [
  { type: 'blocked', email: 'spam93@mailtemp.io',   reason: 'Disposable',   color: 'text-red-400' },
  { type: 'passed',  email: 'john@stripe.com',        reason: 'Verified',     color: 'text-emerald-400' },
  { type: 'blocked', email: 'noreply@bulkmail.net',  reason: 'Role Account', color: 'text-orange-400' },
  { type: 'blocked', email: 'bot12x@fakeleads.com',  reason: 'Bot Detected', color: 'text-red-400' },
  { type: 'passed',  email: 'maria@resend.com',       reason: 'Verified',     color: 'text-emerald-400' },
  { type: 'blocked', email: 'test@throwaway.email',  reason: 'Disposable',   color: 'text-red-400' },
]

function ActivityTicker() {
  const [activeIdx, setActiveIdx] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setActiveIdx(prev => (prev + 1) % ACTIVITY_LOG.length), 2500)
    return () => clearInterval(id)
  }, [])
  const entry = ACTIVITY_LOG[activeIdx]
  return (
    <div aria-live="polite" className="mt-4 bg-slate-900/50 border border-slate-700/50 rounded-xl p-3 font-mono text-xs overflow-hidden">
      <div className="text-slate-500 mb-2 text-[10px] uppercase tracking-widest font-semibold">Live Activity</div>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIdx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between gap-2"
        >
          <span className="truncate text-slate-300">{entry.email}</span>
          <span className={`flex-shrink-0 font-bold ${entry.color}`}>
            {entry.type === 'blocked' ? '❌' : '✅'} {entry.reason}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function LeadShieldFlowDiagram() {
  const outcomes = [
    { icon: '❌', label: 'Bot Blocked',          style: 'text-red-400 border-red-800/50 bg-red-950/40' },
    { icon: '❌', label: 'Disposable Blocked',   style: 'text-red-400 border-red-800/50 bg-red-950/40' },
    { icon: '❌', label: 'Risky Lead Blocked',   style: 'text-orange-400 border-orange-800/50 bg-orange-950/40' },
    { icon: '✅', label: 'Verified Lead Passed', style: 'text-emerald-400 border-emerald-800/50 bg-emerald-950/40' },
  ]
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.18 } },
  }
  const item = {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  }
  return (
    <motion.div
      className="flex flex-col items-start gap-0 w-full"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      aria-label="LeadShield protection flow from visitor to CRM"
    >
      {/* Node: Visitor */}
      <motion.div variants={item} className="flex items-center gap-3 px-5 py-3 rounded-2xl border border-slate-600 bg-slate-700 text-slate-200 w-full max-w-xs shadow-md">
        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span className="font-bold text-sm">Visitor</span>
      </motion.div>

      {/* Connector 1 */}
      <motion.div variants={item} className="flex flex-col items-center self-start ml-7 my-1">
        <div className="w-0.5 h-5 bg-slate-600" />
        <motion.div animate={{ y: [0, 3, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          <svg className="w-3 h-3 text-slate-500" fill="currentColor" viewBox="0 0 12 12">
            <path d="M6 10L1 3h10L6 10z" />
          </svg>
        </motion.div>
      </motion.div>

      {/* Node: LeadShield™ Engine */}
      <motion.div variants={item} className="relative flex items-center gap-3 px-5 py-3 rounded-2xl border border-blue-400 bg-blue-600 text-white w-full max-w-xs shadow-lg shadow-blue-500/20">
        <motion.div
          className="absolute -inset-[3px] rounded-2xl border-2 border-blue-400/50 pointer-events-none"
          animate={{ opacity: [0.3, 0.9, 0.3], scale: [1, 1.02, 1] }}
          transition={{ repeat: Infinity, duration: 2.2 }}
        />
        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span className="font-bold text-sm">LeadShield™ Engine</span>
      </motion.div>

      {/* Outcomes */}
      <motion.div variants={item} className="my-3 ml-8 flex flex-col gap-1.5 pl-4 border-l-2 border-dashed border-slate-600">
        {outcomes.map(o => (
          <div key={o.label} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold ${o.style}`}>
            <span>{o.icon}</span>
            <span>{o.label}</span>
          </div>
        ))}
      </motion.div>

      {/* Connector 2 */}
      <motion.div variants={item} className="flex flex-col items-center self-start ml-7 my-1">
        <div className="w-0.5 h-5 bg-slate-600" />
        <motion.div animate={{ y: [0, 3, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}>
          <svg className="w-3 h-3 text-slate-500" fill="currentColor" viewBox="0 0 12 12">
            <path d="M6 10L1 3h10L6 10z" />
          </svg>
        </motion.div>
      </motion.div>

      {/* Node: CRM */}
      <motion.div variants={item} className="flex items-center gap-3 px-5 py-3 rounded-2xl border border-emerald-500 bg-emerald-600 text-white w-full max-w-xs shadow-md shadow-emerald-500/20">
        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
        </svg>
        <span className="font-bold text-sm">Your CRM</span>
      </motion.div>
    </motion.div>
  )
}

function LeadShieldSection() {
  const chips = [
    {
      label: 'Disposable Email Detection',
      icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
    },
    {
      label: 'Bot Protection',
      icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" /></svg>,
    },
    {
      label: 'Role Account Detection',
      icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
    },
    {
      label: 'Risk Scoring',
      icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
    },
    {
      label: 'Real-Time Validation',
      icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    },
  ]

  return (
    <section className="bg-slate-950 py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-600/[0.08] blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-violet-600/[0.08] blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-bold tracking-widest uppercase mb-5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            LeadShield™ Protection
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-5 leading-tight">
            Stop Fake Leads Before{' '}
            <span className="bg-gradient-to-r from-blue-400 to-sky-400 bg-clip-text text-transparent">
              They Cost You Revenue
            </span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            LeadShield™ blocks disposable emails, bots, role accounts and risky signups before they enter your CRM.
          </p>
        </motion.div>

        {/* Two-column body */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* LEFT: Flow + chips + CTA */}
          <motion.div
            className="flex flex-col gap-10"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <LeadShieldFlowDiagram />

            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Protection Suite</p>
              <div className="flex flex-wrap gap-2">
                {chips.map(chip => (
                  <ProtectionChip key={chip.label} icon={chip.icon} label={chip.label} />
                ))}
              </div>
            </div>

            <motion.a
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all duration-150 self-start"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Enable LeadShield™
            </motion.a>
          </motion.div>

          {/* RIGHT: Dashboard metrics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-5 mb-5 border-b border-slate-700/60">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Dashboard — Today</span>
                </div>
                <span className="text-[10px] text-slate-600 font-mono">LIVE</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-2">
                <MetricCard value={1284} label="Blocked Today"     color="red" />
                <MetricCard value={342}  label="Bot Attacks"       color="orange" />
                <MetricCard value={517}  label="Disposable Emails" color="amber" />
                <MetricCard value={425}  label="Qualified Leads"   color="emerald" />
              </div>

              <ActivityTicker />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

// ─── Complete Email Protection Ecosystem ────────────────────────────────────
function ProtectionEcosystemSection() {
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } }
  }
  
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  const stages = [
    {
      id: 'leadshield',
      title: 'LeadShield™',
      desc: 'Block bots, disposable emails, fake signups',
      bgClass: 'bg-emerald-500/10',
      borderClass: 'border-emerald-500/30',
      textClass: 'text-teal-400',
      gradientClass: 'from-emerald-500 to-teal-500',
      label: 'Lead Acquisition',
    },
    {
      id: 'verification',
      title: 'Email Verification',
      desc: 'Verify and clean email addresses',
      bgClass: 'bg-blue-500/10',
      borderClass: 'border-blue-500/30',
      textClass: 'text-blue-400',
      gradientClass: 'from-blue-500 to-sky-500',
      label: 'Database Hygiene',
    },
    {
      id: 'intelligence',
      title: 'Email Intelligence',
      desc: 'Predict deliverability before campaigns launch',
      bgClass: 'bg-indigo-500/10',
      borderClass: 'border-indigo-500/30',
      textClass: 'text-indigo-400',
      gradientClass: 'from-indigo-500 via-violet-500 to-blue-500',
      label: 'Campaign Ready',
    },
    {
      id: 'delivery',
      title: 'Successful Delivery',
      desc: 'Reach real inboxes and maximize ROI',
      bgClass: 'bg-cyan-500/10',
      borderClass: 'border-cyan-500/30',
      textClass: 'text-cyan-400',
      gradientClass: 'from-emerald-400 to-cyan-500',
      label: 'Final Outcome',
    }
  ]

  return (
    <section className="py-24 lg:py-32 bg-slate-900 border-y border-slate-800 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 -translate-y-1/2 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-5">
            Complete Email Protection Platform
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            CleanBounce protects your business at every stage of the customer journey.
          </p>
        </div>

        <motion.div 
          className="flex flex-col lg:flex-row items-center lg:items-stretch gap-4 lg:gap-6 relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {stages.map((stage, idx) => (
            <motion.div key={stage.id} variants={cardVariants} className="flex-1 w-full relative group" aria-label={`Step ${idx + 1} of 4`}>
              {/* Connector Line (Desktop) */}
              {idx < stages.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -translate-y-1/2 -right-6 w-6 border-t-2 border-dashed border-slate-700 z-0" />
              )}
              {/* Connector Line (Mobile) */}
              {idx < stages.length - 1 && (
                <div className="block lg:hidden absolute -bottom-4 left-1/2 -translate-x-1/2 h-4 border-l-2 border-dashed border-slate-700 z-0" />
              )}
              
              <div className={`h-full bg-slate-950/80 backdrop-blur-sm border ${stage.borderClass} rounded-2xl p-8 relative z-10 hover:-translate-y-2 transition-transform duration-300 shadow-xl shadow-black/20`}>
                <div className="absolute top-0 left-0 w-full h-1 rounded-t-2xl bg-gradient-to-r opacity-50 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }} />
                <div className={`w-full h-1 absolute top-0 left-0 rounded-t-2xl bg-gradient-to-r ${stage.gradientClass} opacity-50 group-hover:opacity-100 transition-opacity`} />
                
                <div className={`text-xs font-bold uppercase tracking-widest mb-6 ${stage.textClass}`}>
                  {stage.label}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3">
                  {stage.title}
                </h3>
                
                <p className="text-slate-400 text-sm leading-relaxed">
                  {stage.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── Who Uses CleanBounce ───────────────────────────────────────────────────
function TargetPersonasSection() {
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } }
  }
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  const personas = [
    {
      title: 'Email Marketers',
      problem: 'High bounce rates ruining campaigns and burning IPs.',
      solution: 'Clean lists and predict bounces before launching.',
      link: '/solutions/email-marketers',
    },
    {
      title: 'Sales Teams',
      problem: 'Reps wasting time on fake leads and invalid domains.',
      solution: 'Block disposable emails instantly at the entry point.',
      link: '/solutions/sales-teams',
    },
    {
      title: 'SaaS Companies',
      problem: 'Bots spamming free trials and exhausting resources.',
      solution: 'LeadShield™ stops automated headless browsers.',
      link: '/solutions/saas-companies',
    },
    {
      title: 'Agencies',
      problem: 'Inheriting toxic client databases with high risk.',
      solution: 'Bulk clean entire client lists with our high-speed API.',
      link: '/solutions/agencies',
    }
  ]

  return (
    <section className="py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Who Uses CleanBounce
          </h2>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {personas.map(p => (
            <motion.div key={p.title} variants={cardVariants}>
              <Link href={p.link} className="block h-full group bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-300">
                <h3 className="text-xl font-bold text-slate-900 mb-6 group-hover:text-blue-600 transition-colors">{p.title}</h3>
                
                <div className="mb-4">
                  <div className="text-[10px] font-bold text-red-500 uppercase tracking-wider mb-1">The Problem</div>
                  <p className="text-sm text-slate-600 leading-relaxed">{p.problem}</p>
                </div>
                
                <div className="py-2 flex justify-center">
                  <svg className="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>

                <div className="mt-2 mb-5">
                  <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-1">CleanBounce Solution</div>
                  <p className="text-sm text-slate-800 font-medium leading-relaxed">{p.solution}</p>
                </div>

                <div className="pt-4 border-t border-slate-200 mt-auto flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-600 group-hover:text-blue-700 transition-colors">Learn More</span>
                  <svg className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function HomePage() {
  const [email, setEmail] = useState('john@company.com')
  const [isVerifying, setIsVerifying] = useState(false)
  const [hasVerified, setHasVerified] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const [steps, setSteps] = useState<Step[]>([
    { id: 'syntax',     label: 'Checking email syntax validation',           status: 'idle' },
    { id: 'dns',        label: 'Resolving DNS MX records',                   status: 'idle' },
    { id: 'smtp',       label: 'Verifying SMTP server handshake',            status: 'idle' },
    { id: 'disposable', label: 'Detecting disposable & temporary providers', status: 'idle' },
    { id: 'leadshield', label: 'Running LeadShield™ threat intelligence',    status: 'idle' },
  ])

  const handleVerify = () => {
    if (!email) return
    setIsVerifying(true)
    setHasVerified(false)
    setCurrentStep(0)
    setSteps(prev => prev.map(s => ({ ...s, status: 'idle' })))
  }

  useEffect(() => {
    if (!isVerifying) return
    if (currentStep < steps.length) {
      setSteps(prev => prev.map((s, idx) => {
        if (idx === currentStep) return { ...s, status: 'running' }
        if (idx < currentStep)  return { ...s, status: 'success' }
        return s
      }))
      const timer = setTimeout(() => setCurrentStep(prev => prev + 1), 700)
      return () => clearTimeout(timer)
    } else {
      setSteps(prev => prev.map(s => ({ ...s, status: 'success' })))
      setIsVerifying(false)
      setHasVerified(true)
    }
  }, [isVerifying, currentStep])

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-900">

      <main>

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none -z-10">
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-400/10 blur-[120px]" />
            <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-sky-400/10 blur-[130px]" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

              {/* LEFT — Copy */}
              <motion.div
                className="lg:col-span-6 flex flex-col justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold tracking-wide mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
                  </span>
                  200 Free Credits on Signup
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.05] mb-6">
                  Email Verification <br className="hidden sm:inline" />
                  <span className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
                    + LeadShield™ Protection
                  </span>
                </h1>

                <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-xl">
                  Clean your mailing lists instantly and secure your sign-up forms from fake leads, spam bots, and temporary disposable domains. Deliver 99.9% of your emails and ship code with confidence.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-10">
                  <a href="/signup" className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-base shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 active:scale-[0.98] transition-all duration-150">
                    Start Free — 200 Credits
                  </a>
                  <a href="#demo" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-base active:scale-[0.98] transition-all duration-150 shadow-sm">
                    <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Watch Demo
                  </a>
                </div>

                <div className="border-t border-slate-200/80 pt-8">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Enterprise Trust & Compliance</p>
                  <div className="flex flex-wrap gap-x-8 gap-y-3">
                    {[
                      { label: 'SOC2 Certified', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
                      { label: 'GDPR Ready',    icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
                      { label: '99.99% Accuracy SLA', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
                    ].map(t => (
                      <div key={t.label} className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                        <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={t.icon} />
                        </svg>
                        {t.label}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* RIGHT — Sandbox */}
              <motion.div
                className="lg:col-span-6 relative"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
              >
                <div className="absolute -z-10 -top-6 -right-6 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
                <div className="absolute -z-10 -bottom-6 -left-6 w-72 h-72 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

                <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-2xl rounded-2xl p-6 relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Live Sandbox</span>
                    </div>
                    <div className="text-xs font-medium text-slate-400">v1.2.0 API Online</div>
                  </div>

                  <div className="mb-5">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={email}
                        onChange={e => { setEmail(e.target.value); setHasVerified(false); setIsVerifying(false) }}
                        placeholder="Enter email to verify..."
                        disabled={isVerifying}
                        className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all disabled:bg-slate-50 disabled:text-slate-400"
                      />
                      <button
                        onClick={handleVerify}
                        disabled={isVerifying || !email}
                        className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors active:scale-[0.98] disabled:bg-slate-200 disabled:text-slate-400 disabled:pointer-events-none flex items-center justify-center min-w-[120px]"
                      >
                        {isVerifying ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Verifying
                          </span>
                        ) : 'Verify Email'}
                      </button>
                    </div>
                  </div>

                  <div className="min-h-[280px] flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                      {!isVerifying && !hasVerified && (
                        <motion.div key="idle" className="text-center py-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-sm">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 19v-8.93a2 2 0 01.89-1.664l8-5.333a2 2 0 012.22 0l8 5.333A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-2.25-1.5a2 2 0 00-2.22 0l-2.25 1.5" />
                            </svg>
                          </div>
                          <h3 className="font-semibold text-slate-800 text-sm mb-1">Verify Email Sandbox</h3>
                          <p className="text-xs text-slate-400 max-w-[260px] mx-auto leading-relaxed">Click "Verify Email" to trace real-time deliverability and LeadShield™ analysis.</p>
                        </motion.div>
                      )}

                      {isVerifying && (
                        <motion.div key="verifying" className="space-y-3.5 py-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Running Checks</span>
                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                              {Math.round((currentStep / steps.length) * 100)}%
                            </span>
                          </div>
                          {steps.map(step => (
                            <div key={step.id} className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all duration-300 ${step.status === 'running' ? 'bg-blue-50/50 border-blue-200 text-blue-900 shadow-sm' : step.status === 'success' ? 'bg-slate-50 border-slate-100 text-slate-500' : 'bg-transparent border-transparent text-slate-300'}`}>
                              <div className="flex-shrink-0">
                                {step.status === 'success' && <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>}
                                {step.status === 'running' && <svg className="animate-spin h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>}
                                {step.status === 'idle' && <div className="w-5 h-5 rounded-full border-2 border-slate-200" />}
                              </div>
                              <span className="text-xs font-semibold">{step.label}</span>
                            </div>
                          ))}
                        </motion.div>
                      )}

                      {hasVerified && (
                        <motion.div key="success" className="space-y-6 py-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3 bg-slate-50 border border-slate-100 p-4 rounded-xl">
                              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Deliverability</div>
                              {[
                                { label: 'Status', value: <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">Valid ✅</span> },
                                { label: 'Score',   value: <span className="text-xs font-extrabold text-slate-800">98/100</span> },
                                { label: 'MX Found', value: <span className="text-xs font-bold text-emerald-600">Yes</span> },
                                { label: 'SMTP',    value: <span className="text-xs font-bold text-emerald-600">Reachable</span> },
                              ].map(r => (
                                <div key={r.label} className="flex items-center justify-between">
                                  <span className="text-xs font-medium text-slate-500">{r.label}</span>
                                  {r.value}
                                </div>
                              ))}
                            </div>
                            <div className="space-y-3 bg-slate-50 border border-slate-100 p-4 rounded-xl">
                              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Threat Profiling</div>
                              {[
                                { label: 'Disposable',    value: <span className="text-xs font-bold text-slate-700">No</span> },
                                { label: 'Role Account', value: <span className="text-xs font-bold text-slate-700">No</span> },
                                { label: 'Risk Level',   value: <span className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">Low</span> },
                              ].map(r => (
                                <div key={r.label} className="flex items-center justify-between">
                                  <span className="text-xs font-medium text-slate-500">{r.label}</span>
                                  {r.value}
                                </div>
                              ))}
                            </div>
                          </div>
                          <motion.div className="bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-100 p-4 rounded-xl" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}>
                            <div className="flex items-center gap-2 mb-3">
                              <div className="bg-blue-600 text-white p-1 rounded-md">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                              </div>
                              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">LeadShield™ Analysis</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 border-b border-blue-100/50 pb-3 mb-3">
                              <div><div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Lead Quality</div><div className="text-sm font-extrabold text-blue-900">Excellent</div></div>
                              <div><div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Domain Reputation</div><div className="text-sm font-extrabold text-blue-900">High</div></div>
                            </div>
                            <div className="flex items-center justify-center gap-2 bg-emerald-500/10 text-emerald-800 text-xs font-bold py-2 rounded-lg border border-emerald-500/20">
                              <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                              Safe To Contact
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* ── TRUST BAR ────────────────────────────────────────────────────── */}
        <section className="border-y border-slate-200/60 bg-white py-16 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-sm font-bold text-slate-400 uppercase tracking-widest mb-10">
              Trusted by marketers, agencies and SaaS teams
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { target: 100,  suffix: 'K+', label: 'Emails Verified' },
                { target: 99.5, suffix: '%',  label: 'Accuracy Guarantee', decimals: 1 },
                { target: 40,   suffix: '%+', label: 'Bounce Reduction' },
                { target: 24,   suffix: '/7', label: 'API Availability' },
              ].map(stat => (
                <div key={stat.label} className="bg-slate-50/50 border border-slate-100 rounded-2xl p-6 text-center shadow-sm">
                  <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-1">
                    <AnimatedCounter target={stat.target} decimals={stat.decimals ?? 0} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURE GRID ─────────────────────────────────────────────────── */}
        <section className="py-24 lg:py-32 relative">
          <div className="absolute top-[20%] left-[5%] w-96 h-96 rounded-full bg-blue-400/5 blur-[100px] pointer-events-none -z-10" />
          <div className="absolute bottom-[20%] right-[5%] w-96 h-96 rounded-full bg-sky-400/5 blur-[100px] pointer-events-none -z-10" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">Enterprise Suite</h2>
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Everything you need to safeguard deliverability</p>
              <p className="text-slate-500 text-lg leading-relaxed">Unlock high-fidelity verification tools designed to fit seamless development and marketing integrations.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Email Verification',
                  desc: 'Verify emails before sending. Ensure server status, check MX records, and handshake status in milliseconds.',
                  icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
                },
                {
                  title: 'Bulk Verification',
                  desc: 'Clean thousands of emails at once. Upload massive CSV files and download filtered lists without any script lag.',
                  icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
                },
                {
                  title: 'LeadShield™',
                  desc: 'Block fake and risky leads. Integrate our form widget or webhook endpoint to immediately bounce bots and disown disposable emails.',
                  icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
                },
                {
                  title: 'Verification API',
                  desc: 'Real-time API verification. Sub-100ms request handling built with optimized endpoints for high-throughput pipelines.',
                  icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
                },
                {
                  title: 'Google Sheets Verification',
                  desc: 'Verify directly inside Sheets. Use our custom integration extension to clean columns of email rows inside spreadsheets.',
                  icon: 'M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
                },
                {
                  title: 'Analytics & Reports',
                  desc: 'Track quality and deliverability. Visual dash metrics, campaign tracking reports, and alert summaries.',
                  icon: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
                },
              ].map(card => (
                <motion.div
                  key={card.title}
                  className="group relative p-[1px] rounded-2xl bg-slate-200/80 hover:bg-gradient-to-r hover:from-blue-600 hover:to-sky-500 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-blue-500/5"
                  whileHover={{ y: -8, scale: 1.01 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <div className="bg-white rounded-[15px] p-8 w-full h-full flex flex-col items-start">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-blue-100">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{card.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{card.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── LEADSHIELD™ SHOWCASE ──────────────────────────────────────────── */}
        <LeadShieldSection />

        {/* ── ECOSYSTEM & PERSONAS ──────────────────────────────────────────── */}
        <ProtectionEcosystemSection />
        <TargetPersonasSection />

      </main>
    </div>
  )
}
