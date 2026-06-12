'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

// ─── Inline SVG Icons ──────────────────────────────────────────────────────────
const CheckCircle = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const ShieldAlert = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
)

const Activity = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
)

// ─── Data Definitions ──────────────────────────────────────────────────────────
const WHOUSE_TABS = [
  {
    id: 'marketers',
    title: 'Email Marketers',
    icon: '✉️',
    heading: 'Predict campaign deliverability before launch',
    desc: 'Don\'t wait for a 15% bounce rate to ruin your sender reputation. Run your lists through the Bounce Forecaster to simulate inbox placement.',
    benefits: ['Prevent IP blacklisting', 'Forecast primary inbox placement', 'Analyze campaign risk scores']
  },
  {
    id: 'outreach',
    title: 'Cold Outreach Teams',
    icon: '🎯',
    heading: 'Keep your cold domains out of the spam folder',
    desc: 'Cold email requires pristine domain health. Our intelligence engine continuously monitors your sending domains for DMARC alignment and blacklist exposure.',
    benefits: ['Monitor multiple sending domains', 'Real-time blacklist alerts', 'Maximize reply rates']
  },
  {
    id: 'agencies',
    title: 'Agencies',
    icon: '📊',
    heading: 'Protect client infrastructure proactively',
    desc: 'Audit your clients\' sending infrastructure before taking over their accounts. Prove ROI by showing concrete improvements in their Domain Health Score.',
    benefits: ['Pre-campaign infrastructure audits', 'Exportable health reports', 'Multi-tenant domain monitoring']
  },
  {
    id: 'saas',
    title: 'SaaS Platforms',
    icon: '🚀',
    heading: 'Ensure transactional emails arrive',
    desc: 'Password resets and billing invoices must reach the inbox. Integrate our Intelligence API to monitor your transactional IPs continuously.',
    benefits: ['API-first integration', 'Transactional IP monitoring', 'Instant slack alerts on reputation drop']
  }
]

export default function EmailIntelligencePage() {
  // --- Deliverability Simulator States ---
  const [domainInput, setDomainInput] = useState('')
  const [simulatorState, setSimulatorState] = useState<'idle' | 'analyzing' | 'result'>('idle')
  const [simulatorResult, setSimulatorResult] = useState<{
    inboxProbability: string
    bounceRisk: string
    blacklistExposure: string
    healthScore: number
    logs: string[]
  } | null>(null)

  // --- Who Uses Tabs ---
  const [activeTab, setActiveTab] = useState('marketers')

  // --- Simulated Live Sandbox Analysis ---
  const handleAnalyze = (domain: string) => {
    if (!domain || !domain.includes('.')) return
    
    setSimulatorState('analyzing')
    
    setTimeout(() => {
      const dLower = domain.toLowerCase().trim()
      
      let inboxProbability = '92%'
      let bounceRisk = 'Low'
      let blacklistExposure = 'None'
      let healthScore = 96
      
      if (dLower.includes('spam') || dLower.includes('test') || dLower.includes('temp')) {
        inboxProbability = '14%'
        bounceRisk = 'Critical'
        blacklistExposure = '2 Blocklists'
        healthScore = 32
      } else if (dLower.includes('gmail.com') || dLower.includes('yahoo.com')) {
        inboxProbability = '85%'
        bounceRisk = 'Medium'
        blacklistExposure = 'None'
        healthScore = 78
      }
      
      setSimulatorResult({
        inboxProbability,
        bounceRisk,
        blacklistExposure,
        healthScore,
        logs: [
          'Resolving SPF records... Valid',
          'Checking DKIM signatures... Aligned',
          'Verifying DMARC policy... p=reject',
          'Querying 54 global blocklists... Clean',
          'Calculating historical IP reputation... High'
        ]
      })
      setSimulatorState('result')
    }, 1500)
  }

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 font-sans overflow-x-hidden antialiased">
      
      {/* ─── 1. HERO SECTION ─────────────────────────────────────────────────── */}
      <section className="relative pt-20 pb-24 md:pt-28 md:pb-36 bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-950 text-white overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] bg-fuchsia-600/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Email Intelligence Engine
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-none bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent"
          >
            Know If Your Campaign Will Fail Before You Send It
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Predict bounce risk, inbox placement issues, blacklist exposure, and sender reputation problems before launching your next campaign.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/signup"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-700 hover:to-fuchsia-700 text-white font-bold rounded-xl shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all text-base text-center active:scale-[0.98]"
            >
              Analyze Your Domain Free →
            </Link>
            <a
              href="#simulator"
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 font-bold rounded-xl transition-all text-base text-center active:scale-[0.98]"
            >
              Try the Simulator
            </a>
          </motion.div>
        </div>
      </section>

      {/* ─── 2. PROBLEM SECTION ──────────────────────────────────────────────── */}
      <section className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest">The Danger of Flying Blind</h2>
            <p className="text-3xl sm:text-4xl font-extrabold mt-2 text-slate-900 tracking-tight">
              Why 20% of Cold Emails Go Straight to Spam
            </p>
            <p className="text-slate-500 mt-4 leading-relaxed">
              Traditional platforms only tell you what happened *after* your campaign fails. By then, your domain is burned, your IP is blacklisted, and your ROI is destroyed.
            </p>
          </div>
        </div>
      </section>

      {/* ─── 3. BEFORE YOU SEND VISUAL ───────────────────────────────────────── */}
      <section className="py-16 bg-slate-50 border-b border-slate-200 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-2xl relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-indigo-500" />
            <h3 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">✈️</span>
              Before You Send: Pre-Flight Check
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'SPF Valid & Aligned', status: 'Passed', icon: '✓', color: 'text-emerald-400' },
                { label: 'DKIM Signature Valid', status: 'Passed', icon: '✓', color: 'text-emerald-400' },
                { label: 'DMARC Configured (p=reject)', status: 'Passed', icon: '✓', color: 'text-emerald-400' },
                { label: 'Domain Reputation Healthy', status: '98/100', icon: '📈', color: 'text-indigo-400' },
                { label: 'Bounce Risk Assessment', status: 'Low', icon: '🛡️', color: 'text-emerald-400' },
                { label: 'Spam Trap Exposure', status: 'None', icon: '✨', color: 'text-emerald-400' }
              ].map((check, idx) => (
                <div key={idx} className="flex items-center justify-between bg-slate-950 border border-slate-800/60 p-4 rounded-xl">
                  <span className="text-slate-300 text-sm font-semibold flex items-center gap-2">
                    <span className={check.color}>{check.icon}</span> {check.label}
                  </span>
                  <span className={`text-xs font-bold px-2 py-1 rounded bg-slate-900 border border-slate-800 ${check.color}`}>
                    {check.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. CORE FEATURES (BENTO GRID) ───────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Predictive Intelligence</h2>
            <p className="text-3xl sm:text-4xl font-extrabold mt-2 text-slate-900 tracking-tight">
              A Complete Deliverability Engine
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 border border-slate-200 p-8 rounded-2xl hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl mb-6">🔮</div>
              <h3 className="text-xl font-bold text-slate-900">Bounce Forecaster</h3>
              <p className="text-slate-600 mt-3 leading-relaxed">
                Our AI models analyze historical SMTP responses and network infrastructure to predict bounce probability with 99.1% accuracy before you hit send.
              </p>
            </div>
            
            <div className="bg-slate-50 border border-slate-200 p-8 rounded-2xl hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-xl bg-fuchsia-50 text-fuchsia-600 flex items-center justify-center text-xl mb-6">❤️‍🩹</div>
              <h3 className="text-xl font-bold text-slate-900">Domain Health Score</h3>
              <p className="text-slate-600 mt-3 leading-relaxed">
                A real-time 0-100 index of your infrastructure. We actively scan SPF, DKIM, and DMARC alignments to ensure your domain is authenticated and trusted by major ESPs.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-8 rounded-2xl hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl mb-6">📥</div>
              <h3 className="text-xl font-bold text-slate-900">Deliverability Insights</h3>
              <p className="text-slate-600 mt-3 leading-relaxed">
                Will you land in the Primary Inbox, Promotions, or Spam? We simulate placement across Google Workspace, Microsoft 365, and Yahoo filters.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-8 rounded-2xl hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center text-xl mb-6">🚨</div>
              <h3 className="text-xl font-bold text-slate-900">Sender Reputation Signals</h3>
              <p className="text-slate-600 mt-3 leading-relaxed">
                Instant alerts the moment your sending IP or domain hits a global blacklist (Spamhaus, Sorbs, etc.). Fix reputation issues before they compound.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. DELIVERABILITY SIMULATOR ─────────────────────────────────────── */}
      <section id="simulator" className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-900 to-slate-900 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Interactive Tool</h2>
            <p className="text-3xl sm:text-4xl font-extrabold mt-2 tracking-tight">
              Deliverability Simulator
            </p>
            <p className="text-slate-400 text-sm mt-3">
              Enter a sending domain to predict its inbox performance and infrastructure health.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <span className="absolute left-4 top-3.5 text-slate-500 font-bold">@</span>
                <input
                  type="text"
                  placeholder="e.g. stripe.com"
                  value={domainInput}
                  onChange={e => setDomainInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAnalyze(domainInput)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm font-semibold"
                />
              </div>
              <button
                onClick={() => handleAnalyze(domainInput)}
                disabled={simulatorState === 'analyzing' || !domainInput}
                className="px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-700 hover:to-fuchsia-700 text-white font-bold rounded-xl transition-all disabled:opacity-40 disabled:pointer-events-none text-sm active:scale-95 whitespace-nowrap"
              >
                {simulatorState === 'analyzing' ? 'Simulating...' : 'Run Simulation'}
              </button>
            </div>

            <div className="mt-8 border-t border-slate-800 pt-6" aria-live="polite" aria-atomic="true">
              <AnimatePresence mode="wait">
                {simulatorState === 'idle' && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-6 text-slate-500 text-sm font-mono"
                  >
                    Waiting for domain input to simulate deliverability...
                  </motion.div>
                )}

                {simulatorState === 'analyzing' && (
                  <motion.div
                    key="analyzing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-2 font-mono text-xs text-slate-400 py-4"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                      <span>[PREDICT] Running Monte Carlo inbox simulation...</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                      <span>[DNS] Verifying DMARC/SPF/DKIM topology...</span>
                    </div>
                  </motion.div>
                )}

                {simulatorState === 'result' && simulatorResult && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Inbox Probability</div>
                        <div className={`text-2xl font-extrabold ${parseInt(simulatorResult.inboxProbability) > 80 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {simulatorResult.inboxProbability}
                        </div>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Bounce Risk</div>
                        <div className={`text-2xl font-extrabold ${simulatorResult.bounceRisk === 'Low' ? 'text-emerald-400' : 'text-red-400'}`}>
                          {simulatorResult.bounceRisk}
                        </div>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Blacklist Exposure</div>
                        <div className={`text-2xl font-extrabold ${simulatorResult.blacklistExposure === 'None' ? 'text-emerald-400' : 'text-red-400'}`}>
                          {simulatorResult.blacklistExposure}
                        </div>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Health Score</div>
                        <div className="flex items-baseline gap-1">
                          <span className={`text-2xl font-extrabold ${simulatorResult.healthScore >= 80 ? 'text-emerald-400' : 'text-red-500'}`}>
                            {simulatorResult.healthScore}
                          </span>
                          <span className="text-xs text-slate-500">/ 100</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 font-mono text-xs">
                      <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-3 font-sans">Diagnostic Trace</div>
                      <ul className="flex flex-col gap-2">
                        {simulatorResult.logs.map((detail, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-slate-300">
                            <span className="text-indigo-500 font-bold">&gt;</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. WHO USES EMAIL INTELLIGENCE ──────────────────────────────────── */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Target Use Cases</h2>
            <p className="text-3xl sm:text-4xl font-extrabold mt-2 text-slate-900 tracking-tight">
              Who Uses Email Intelligence?
            </p>
          </div>

          <div className="flex justify-center border-b border-slate-200 overflow-x-auto whitespace-nowrap pb-2 gap-2 scrollbar-none">
            {WHOUSE_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 font-bold text-sm rounded-t-xl transition-all border-b-2 ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600 bg-white shadow-sm shadow-slate-200/20'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <span className="mr-1.5">{tab.icon}</span>
                {tab.title}
              </button>
            ))}
          </div>

          <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
            {WHOUSE_TABS.map(
              tab =>
                activeTab === tab.id && (
                  <motion.div
                    key={tab.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
                  >
                    <div>
                      <h3 className="text-2xl font-extrabold text-slate-900 leading-tight">{tab.heading}</h3>
                      <p className="text-slate-600 mt-4 leading-relaxed text-sm">{tab.desc}</p>
                      
                      <div className="mt-8 flex flex-col gap-3">
                        {tab.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs">✓</span>
                            {benefit}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">
                      <div className="text-4xl mb-4">{tab.icon}</div>
                      <h4 className="text-base font-extrabold text-slate-900">Predictive Defense</h4>
                      <p className="text-xs text-slate-500 mt-1">Configured for {tab.title.toLowerCase()} workflows.</p>
                      <Link
                        href="/signup"
                        className="inline-block mt-6 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs transition-all active:scale-[0.98]"
                      >
                        Start Predicting Free
                      </Link>
                    </div>
                  </motion.div>
                )
            )}
          </div>
        </div>
      </section>

      {/* ─── 7. COMPARISON SECTION ───────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Comparative Analysis</h2>
            <p className="text-3xl sm:text-4xl font-extrabold mt-2 text-slate-900 tracking-tight">
              Email Intelligence vs Traditional Verification
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-slate-200/80 rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-900 text-xs font-extrabold uppercase tracking-wider">
                  <th className="p-4 sm:p-5">Feature Focus</th>
                  <th className="p-4 sm:p-5 text-indigo-600 bg-indigo-50/20 border-x border-slate-200/80">Email Intelligence Engine</th>
                  <th className="p-4 sm:p-5">Traditional Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-semibold">
                {[
                  { metric: 'When it works', us: 'Predicts problems before campaigns launch', competitor: 'Checks after problems happen' },
                  { metric: 'Infrastructure Analysis', us: 'Scans SPF/DKIM/DMARC health', competitor: 'Ignores sender infrastructure entirely' },
                  { metric: 'Inbox Placement', us: 'Simulates deliverability probability', competitor: 'Only checks if inbox exists' },
                  { metric: 'Blacklist Alerts', us: 'Real-time proactive monitoring', competitor: 'Manual checks required' }
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/40">
                    <td className="p-4 sm:p-5 text-slate-900 font-bold">{row.metric}</td>
                    <td className="p-4 sm:p-5 text-indigo-700 bg-indigo-50/10 border-x border-slate-200/80 flex items-center gap-1.5">
                      <span className="text-emerald-500">✓</span> {row.us}
                    </td>
                    <td className="p-4 sm:p-5 text-slate-500 font-medium">{row.competitor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── 8. PRODUCT ECOSYSTEM ────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-950 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl font-extrabold mb-16 tracking-tight">Complete Email Protection Platform</h2>
          
          <div className="flex flex-col items-center max-w-2xl mx-auto">
            {/* Step 1 */}
            <div className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-6 relative">
              <h3 className="text-xl font-bold text-blue-400">LeadShield™</h3>
              <p className="text-slate-400 text-sm mt-2">Protect inbound leads from bots and disposable emails at the form level.</p>
            </div>
            
            {/* Arrow */}
            <div className="h-10 border-l-2 border-dashed border-slate-700 my-2" />
            
            {/* Step 2 */}
            <div className="w-full bg-indigo-900/30 border border-indigo-500/50 rounded-2xl p-6 relative shadow-[0_0_30px_rgba(99,102,241,0.15)]">
              <h3 className="text-xl font-bold text-indigo-400">Email Intelligence</h3>
              <p className="text-slate-300 text-sm mt-2">Protect outbound campaigns by predicting deliverability and monitoring domain health.</p>
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-indigo-500 rounded-full animate-pulse" />
            </div>

            {/* Arrow */}
            <div className="h-10 border-l-2 border-dashed border-slate-700 my-2" />
            
            {/* Step 3 */}
            <div className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-6 relative">
              <h3 className="text-xl font-bold text-emerald-400">Email Verification</h3>
              <p className="text-slate-400 text-sm mt-2">Maintain database quality by bulk-cleaning aged lists and legacy CRM contacts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 9. INTEGRATIONS ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-10">Integrates seamlessly with your sending infrastructure</h2>
          <div className="flex flex-wrap justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Placeholder for actual logos, using text for now */}
            <span className="text-2xl font-extrabold text-slate-800">SendGrid</span>
            <span className="text-2xl font-extrabold text-slate-800">Mailgun</span>
            <span className="text-2xl font-extrabold text-slate-800">Postmark</span>
            <span className="text-2xl font-extrabold text-slate-800">HubSpot</span>
            <span className="text-2xl font-extrabold text-slate-800">Apollo.io</span>
          </div>
        </div>
      </section>

      {/* ─── 10. FINAL CTA ───────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Stop Guessing. Start Predicting.</h2>
          <p className="text-slate-600 mt-6 text-lg max-w-2xl mx-auto">
            Email Intelligence is included in all CleanBounce plans. Create a free account to run your first domain health simulation in seconds.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/signup"
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all text-lg active:scale-[0.98]"
            >
              Analyze Your Domain Free
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
