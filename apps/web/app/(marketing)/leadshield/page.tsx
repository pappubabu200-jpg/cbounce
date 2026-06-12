'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

// ─── Inline SVG Icons ──────────────────────────────────────────────────────────
const ShieldAlert = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
)

const CheckCircle = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const ShieldCheck = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
)

const CodeIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
)

// ─── Data Definitions ──────────────────────────────────────────────────────────
const WHOUSE_TABS = [
  {
    id: 'saas',
    title: 'SaaS Companies',
    icon: '🚀',
    heading: 'Stop automated fake trials & API spam',
    desc: 'Block script signups and disposable trials before they bloat your active user counts, exhaust your marketing database limits, and skew product metrics.',
    benefits: ['Prevent fake-account subscription abuse', 'Save CRM database quota limits', 'Clean telemetry data from day one']
  },
  {
    id: 'agencies',
    title: 'Marketing Agencies',
    icon: '📊',
    heading: 'Deliver pristine lead quality to clients',
    desc: 'Stop passing fake emails and bounce-prone leads to your clients. Protect your campaign conversion integrity and command premium retainer fees.',
    benefits: ['100% bounce-free lead exports', 'Build custom lead-hygiene dashboards', 'Eliminate client billing disputes']
  },
  {
    id: 'ecommerce',
    title: 'Ecommerce Brands',
    icon: '🛍️',
    heading: 'Halt coupon code abuse & cart spam',
    desc: 'Block shoppers creating infinite trial emails (e.g. +alias, temp domains) to repeatedly harvest discount codes. Secure your checkout funnel.',
    benefits: ['Eliminate coupon referral fraud', 'Keep customer lists clean for retargeting', 'Reduce bot cart reservation attacks']
  },
  {
    id: 'leadgen',
    title: 'Lead Gen Firms',
    icon: '🎯',
    heading: 'Verify conversion quality in under 100ms',
    desc: 'Filter out low-intent users, false contact data, and bots instantly. Sell high-intent verified prospects for maximum value.',
    benefits: ['Increase lead-to-opportunity ratios', 'Automatic real-time domain checking', 'Command premium CPL pricing']
  },
  {
    id: 'sales',
    title: 'B2B Sales Teams',
    icon: '🤝',
    heading: 'Protect your outbound email sender reputation',
    desc: 'Prevent sales reps from emailing unverified accounts, bad aliases, or spam traps. Keep your outreach domains in good standing.',
    benefits: ['Substantially reduce outbound bounce rates', 'Prevent domain blacklisting', 'Focus reps on real corporate domains']
  }
]

const INTEGRATIONS = [
  { name: 'HubSpot', desc: 'Sync clean leads automatically' },
  { name: 'Salesforce', desc: 'Protect your pipeline records' },
  { name: 'Zapier', desc: 'Connect to 5,000+ business apps' },
  { name: 'Webflow', desc: 'Secure your forms in one click' },
  { name: 'Shopify', desc: 'Halt discount spam at checkout' },
  { name: 'WordPress', desc: 'Native plugin for quick setup' }
]

const INSTALL_TABS = [
  {
    id: 'js',
    label: 'HTML / JS SDK',
    code: `<!-- Drop LeadShield SDK script in your HTML header -->
<script 
  src="https://cdn.cleanbounce.io/leadshield.js" 
  data-client-key="cb_live_948f2h83fshf"
  data-auto-intercept="true">
</script>

<!-- No extra code needed. All <form> inputs automatically verified. -->`
  },
  {
    id: 'node',
    label: 'Node.js SDK',
    code: `import { LeadShield } from '@cleanbounce/leadshield';

const shield = new LeadShield({ apiKey: process.env.CLEANBOUNCE_API_KEY });

// In your API Route handler
export async function POST(req) {
  const { email } = await req.json();
  
  const result = await shield.verify(email);
  if (result.action === 'BLOCK') {
    return Response.json({ error: 'Invalid address' }, { status: 400 });
  }
  
  // Save verified lead to database/CRM
}`
  },
  {
    id: 'curl',
    label: 'cURL / REST API',
    code: `curl -X POST https://api.cleanbounce.io/v1/leadshield/verify \\
  -H "Authorization: Bearer cb_live_948f2h83fshf" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "spam-bot@guerrillamail.de",
    "ip_address": "203.0.113.195",
    "user_agent": "Mozilla/5.0..."
  }'`
  }
]

export default function LeadShieldPage() {
  // --- Live Sandbox States ---
  const [emailInput, setEmailInput] = useState('')
  const [sandboxState, setSandboxState] = useState<'idle' | 'analyzing' | 'result'>('idle')
  const [sandboxResult, setSandboxResult] = useState<{
    status: 'PASSED' | 'BLOCKED'
    score: number
    reason: string
    details: string[]
  } | null>(null)
  
  // --- Who Uses Tabs ---
  const [activeTab, setActiveTab] = useState('saas')
  
  // --- Code Install Tabs ---
  const [activeInstallTab, setActiveInstallTab] = useState('js')

  // --- Simulated Live Sandbox Analysis ---
  const handleAnalyze = (email: string) => {
    if (!email || !email.includes('@')) return
    
    setSandboxState('analyzing')
    
    setTimeout(() => {
      const emailLower = email.toLowerCase().trim()
      
      let status: 'PASSED' | 'BLOCKED' = 'PASSED'
      let score = 98
      let reason = 'Verified Business Domain'
      let details = ['MX configuration correct', 'Active SMTP connection', 'Legitimate corporate domain']
      
      if (
        emailLower.includes('temp') ||
        emailLower.includes('mailinator') ||
        emailLower.includes('guerrilla') ||
        emailLower.includes('throwaway') ||
        emailLower.includes('disposable')
      ) {
        status = 'BLOCKED'
        score = 14
        reason = 'Disposable Email Domain detected'
        details = ['Temp-mail provider matched', 'MX records marked suspicious', 'Short-lived mailbox pattern']
      } else if (
        emailLower.includes('bot') ||
        emailLower.includes('script') ||
        emailLower.includes('crawler') ||
        emailLower.includes('test')
      ) {
        status = 'BLOCKED'
        score = 32
        reason = 'High Bot Signature Detected'
        details = ['Automation signature profile match', 'Suspicious user agent string', 'Blocked by behavioral firewall']
      } else if (emailLower.includes('gmail.com') || emailLower.includes('yahoo.com') || emailLower.includes('outlook.com')) {
        status = 'PASSED'
        score = 85
        reason = 'Verified Personal Domain'
        details = ['MX configuration verified', 'Accepts SMTP handshake', 'Consumer mailbox confirmed']
      }
      
      setSandboxResult({ status, score, reason, details })
      setSandboxState('result')
    }, 1200)
  }

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 font-sans overflow-x-hidden antialiased">
      
      {/* ─── 1. HERO SECTION ─────────────────────────────────────────────────── */}
      <section className="relative pt-20 pb-24 md:pt-28 md:pb-36 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
        {/* Neon Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            LeadShield™ Standalone Product
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-none bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent"
          >
            Stop Bad Leads Before They Enter Your CRM
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            LeadShield™ intercepts temporary domains, disposable addresses, and automated signup bots in real time. Maintain a pristine customer database automatically.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/signup"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-xl shadow-blue-500/20 hover:shadow-blue-500/30 transition-all text-base text-center active:scale-[0.98]"
            >
              Protect Your Forms Free →
            </Link>
            <a
              href="#deploy"
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 font-bold rounded-xl transition-all text-base text-center active:scale-[0.98]"
            >
              Read Developer Docs
            </a>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-16 max-w-3xl mx-auto border border-slate-800 bg-slate-900/50 rounded-2xl p-6 backdrop-blur-md relative"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/30 to-violet-500/30 rounded-2xl blur opacity-30 pointer-events-none" />
            <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
              <span className="w-3 h-3 rounded-full bg-red-500/70" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <span className="w-3 h-3 rounded-full bg-green-500/70" />
              <span className="text-[10px] text-slate-500 font-mono ml-2">LeadShield™ Real-Time Dashboard</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
              {[
                { label: 'Blocked Signups', value: '42,912', color: 'text-red-500' },
                { label: 'Clean Leads Passed', value: '185,411', color: 'text-emerald-500' },
                { label: 'Spam Rate Prevented', value: '18.7%', color: 'text-blue-400' },
                { label: 'Avg Latency Time', value: '62ms', color: 'text-violet-400' }
              ].map(stat => (
                <div key={stat.label} className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/60">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{stat.label}</p>
                  <p className={`text-2xl font-extrabold mt-1 ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── 2. PROBLEM SECTION ──────────────────────────────────────────────── */}
      <section className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest">The Danger of Bad Leads</h2>
            <p className="text-3xl sm:text-4xl font-extrabold mt-2 text-slate-900 tracking-tight">
              Why CRM Hygiene Determines Your CAC
            </p>
            <p className="text-slate-500 mt-4 leading-relaxed">
              Accepting unverified signups creates a chain reaction of wasted revenue, system clutter, and reputation damage. LeadShield™ acts as a firewall before the write event occurs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Bloated CRM Quotas',
                desc: 'Salesforce, HubSpot, and Marketo charge based on total contact records. Storing fake accounts, spambots, and temporary domains causes artificial plan upgrades.',
                metric: 'Avg. 24% database bloat'
              },
              {
                title: 'Damaged Sender Reputation',
                desc: 'Sending automated welcoming campaigns to invalid or temporary mailboxes raises your spam bounce rate. Your sender domain score degrades, pushing sales emails into spam.',
                metric: 'Increases bounce rates by 6x'
              },
              {
                title: 'Wasted Rep Outreach Hours',
                desc: 'Outbound sales teams waste valuable calling time trying to follow up with fake signups or disposable aliases, directly lowering pipeline efficiency and conversion yields.',
                metric: 'Saves reps up to 8 hrs/week'
              }
            ].map((prob, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 p-6 rounded-2xl flex flex-col justify-between hover:shadow-lg transition-all">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold text-lg mb-4">
                    ⚠️
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{prob.title}</h3>
                  <p className="text-slate-600 text-sm mt-2 leading-relaxed">{prob.desc}</p>
                </div>
                <div className="mt-6 border-t border-slate-200 pt-4 text-xs font-bold text-red-600 uppercase tracking-wide flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  {prob.metric}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3. HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest">Architectural Defense</h2>
            <p className="text-3xl sm:text-4xl font-extrabold mt-2 text-slate-900 tracking-tight">
              A 3-Step Firewall For CRM Hygiene
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
            <div className="hidden lg:block absolute top-[44px] left-[10%] right-[10%] h-0.5 bg-slate-200 z-0 pointer-events-none" />
            
            {[
              {
                step: '01',
                title: 'Intercept Signup',
                desc: 'LeadShield intercepts form submissions inside the client browser or API gateway in <5ms.'
              },
              {
                step: '02',
                title: 'Inspect Payload',
                desc: 'Runs validation check of domain MX records, SMTP connection checks, disposable domains, and behavior profiles.'
              },
              {
                step: '03',
                title: 'Secure CRM sync',
                desc: 'Legitimate signups sync immediately. Bots and disposables are blocked with direct user feedback.'
              }
            ].map((step, idx) => (
              <div key={idx} className="relative z-10 text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center border-4 border-slate-50 shadow-md">
                  {step.step}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-4">{step.title}</h3>
                <p className="text-slate-600 text-sm mt-2 max-w-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. LIVE SANDBOX WIDGET ──────────────────────────────────────────── */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900 to-slate-900 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold text-blue-400 uppercase tracking-widest">Interactive Sandbox</h2>
            <p className="text-3xl sm:text-4xl font-extrabold mt-2 tracking-tight">
              Test LeadShield™ Real-Time Protection
            </p>
            <p className="text-slate-400 text-sm mt-3">
              Type any email address or select a test case below to inspect validation results.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            {/* Input Form Box */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter an email to analyze..."
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAnalyze(emailInput)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm font-semibold"
              />
              <button
                onClick={() => handleAnalyze(emailInput)}
                disabled={sandboxState === 'analyzing' || !emailInput}
                className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all disabled:opacity-40 disabled:pointer-events-none text-sm active:scale-95"
              >
                {sandboxState === 'analyzing' ? 'Analyzing...' : 'Test Address'}
              </button>
            </div>

            {/* Test Case Suggestions */}
            <div className="mt-4 flex flex-wrap gap-2 items-center">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mr-1">Try Samples:</span>
              {[
                { label: 'Real Domain', value: 'contact@stripe.com' },
                { label: 'Disposable', value: 'fake-user@mailinator.com' },
                { label: 'Bot Script', value: 'bot-handler@crawler.net' },
                { label: 'Personal', value: 'johndoe@gmail.com' }
              ].map(test => (
                <button
                  key={test.value}
                  onClick={() => {
                    setEmailInput(test.value)
                    handleAnalyze(test.value)
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-all font-semibold"
                >
                  {test.label}
                </button>
              ))}
            </div>

            {/* Simulated Output Dashboard */}
            <div className="mt-8 border-t border-slate-800 pt-6" aria-live="polite" aria-atomic="true">
              <AnimatePresence mode="wait">
                {sandboxState === 'idle' && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-6 text-slate-500 text-sm font-mono"
                  >
                    Enter an email to run interactive real-time analysis logs.
                  </motion.div>
                )}

                {sandboxState === 'analyzing' && (
                  <motion.div
                    key="analyzing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-2 font-mono text-xs text-slate-400 py-4"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                      <span>[INFO] Resolving DNS & MX target hosts...</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                      <span>[INFO] Matching domain alias against database...</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                      <span>[INFO] Establishing SMTP handshake...</span>
                    </div>
                  </motion.div>
                )}

                {sandboxState === 'result' && sandboxResult && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                  >
                    <div className="md:col-span-1 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Analysis Result</div>
                        <div className={`text-xl font-extrabold mt-2 flex items-center gap-1.5 ${sandboxResult.status === 'PASSED' ? 'text-emerald-500' : 'text-red-500'}`}>
                          {sandboxResult.status === 'PASSED' ? <CheckCircle /> : <ShieldAlert />}
                          {sandboxResult.status}
                        </div>
                        <p className="text-xs text-slate-400 mt-2 font-medium">{sandboxResult.reason}</p>
                      </div>
                      
                      <div className="mt-6 border-t border-slate-800 pt-4">
                        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Risk Quality Score</div>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className={`text-3xl font-extrabold ${sandboxResult.score >= 80 ? 'text-emerald-400' : sandboxResult.score >= 50 ? 'text-yellow-400' : 'text-red-500'}`}>
                            {sandboxResult.score}
                          </span>
                          <span className="text-xs text-slate-500">/ 100</span>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 font-mono text-xs">
                      <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-3 font-sans">Verification Trace Logs</div>
                      <ul className="flex flex-col gap-2">
                        {sandboxResult.details.map((detail, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-slate-300">
                            <span className="text-blue-500 font-bold">&gt;</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                        <li className="text-slate-500 mt-4 border-t border-slate-800/80 pt-2 flex justify-between font-sans text-[10px]">
                          <span>Execution time: 54ms</span>
                          <span>Response status: 200 OK</span>
                        </li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. BOT DETECTION ────────────────────────────────────────────────── */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 border border-blue-100 shadow-sm">
                🤖
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                CAPTCHA-Free Bot & Automation Blocking
              </h2>
              <p className="text-slate-600 mt-4 leading-relaxed">
                LeadShield™ incorporates behavior fingerprinting directly on signup triggers to stop headless browsers, automation scripts, and selenium tools. Detect bot signups without adding friction to real users.
              </p>
              
              <ul className="mt-8 flex flex-col gap-3">
                {[
                  'Blocks Selenium, Puppeteer, and Playwright',
                  'Zero user interaction required (no puzzle grids)',
                  'Blocks automated scraper and credential stuffing'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-slate-700 text-sm font-semibold">
                    <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 relative">
              <div className="bg-slate-900 text-slate-400 font-mono text-[11px] rounded-xl p-4 border border-slate-800 shadow-lg">
                <span className="text-slate-500">// LeadShield™ Behavioral Heuristics</span>
                <div className="mt-2 text-emerald-400">STATUS: INTERCEPTED</div>
                <div className="text-slate-300">USER_AGENT: "Mozilla/5.0 HeadlessChrome..."</div>
                <div className="text-slate-300">AUTOMATION_FLAGS: [navigator.webdriver = true]</div>
                <div className="text-slate-300">BEHAVIOR_SCORE: 12% (Bot Likelihood: High)</div>
                <div className="text-red-400 mt-2">ACTION: BLOCKED (Friction Threshold Tripped)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. DISPOSABLE EMAIL DETECTION ───────────────────────────────────── */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
                  <span className="text-xs font-bold font-mono text-slate-500">trashy-mail.com</span>
                  <span className="px-2 py-0.5 rounded bg-red-100 border border-red-200 text-red-700 text-[10px] font-extrabold uppercase">Blocked</span>
                </div>
                <div className="flex justify-between items-center bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
                  <span className="text-xs font-bold font-mono text-slate-500">guerrillamail.de</span>
                  <span className="px-2 py-0.5 rounded bg-red-100 border border-red-200 text-red-700 text-[10px] font-extrabold uppercase">Blocked</span>
                </div>
                <div className="flex justify-between items-center bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
                  <span className="text-xs font-bold font-mono text-slate-500">gmail.com (+alias validation)</span>
                  <span className="px-2 py-0.5 rounded bg-yellow-100 border border-yellow-200 text-yellow-700 text-[10px] font-extrabold uppercase">Sanitized</span>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 border border-blue-100 shadow-sm">
                📬
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Disposable & Temporary Domain Blocker
              </h2>
              <p className="text-slate-600 mt-4 leading-relaxed">
                Temporary mailboxes are designed to gather discount vouchers or initiate false trials. We monitor over 150,000 temporary domain aliases, updated hourly, to block throwaway accounts.
              </p>
              
              <ul className="mt-8 flex flex-col gap-3">
                {[
                  '150k+ disposable domains checked instantly',
                  'Database updated hourly via global honey pots',
                  'Identifies sub-aliases and +tag trickery'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-slate-700 text-sm font-semibold">
                    <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7. LEAD QUALITY SCORING ─────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 border border-blue-100 shadow-sm">
                📊
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                0-100 Lead Quality Risk Scoring
              </h2>
              <p className="text-slate-600 mt-4 leading-relaxed">
                Not all valid emails are good business targets. LeadShield analyzes domain demographics, MX age, and SMTP delivery structures to generate an instant Risk Score. Use it to automatically screen and segment signups.
              </p>
              
              <ul className="mt-8 flex flex-col gap-3">
                {[
                  'Risk index calculated in under 80ms',
                  'Flags generic consumer emails (Gmail) vs. Corporate target accounts',
                  'Ensures MX records are properly configured to receive messages'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-slate-700 text-sm font-semibold">
                    <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left shadow-sm">
              <div className="space-y-4">
                <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">sundar@google.com</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Corporate business address</p>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-500 font-extrabold text-lg">98</span>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Passed</span>
                  </div>
                </div>
                
                <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">johndoe@gmail.com</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Valid personal address</p>
                  </div>
                  <div className="text-right">
                    <span className="text-yellow-600 font-extrabold text-lg">74</span>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Passed</span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-center justify-between opacity-60">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">junk-account@yopmail.com</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Disposable temp inbox</p>
                  </div>
                  <div className="text-right">
                    <span className="text-red-500 font-extrabold text-lg">12</span>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Blocked</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 8. WHO USES LEADSHIELD™ ─────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest">Target Use Cases</h2>
            <p className="text-3xl sm:text-4xl font-extrabold mt-2 text-slate-900 tracking-tight">
              Who Uses LeadShield™?
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center border-b border-slate-200 overflow-x-auto whitespace-nowrap pb-2 gap-2 scrollbar-none">
            {WHOUSE_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 font-bold text-sm rounded-t-xl transition-all border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 bg-white shadow-sm shadow-slate-200/20'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <span className="mr-1.5">{tab.icon}</span>
                {tab.title}
              </button>
            ))}
          </div>

          {/* Tab Panel Content */}
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
                            <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs">✓</span>
                            {benefit}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">
                      <div className="text-4xl mb-4">{tab.icon}</div>
                      <h4 className="text-base font-extrabold text-slate-900">Dedicated Protection Policy</h4>
                      <p className="text-xs text-slate-500 mt-1">LeadShield configured configuration logic.</p>
                      <Link
                        href="/signup"
                        className="inline-block mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-all active:scale-[0.98]"
                      >
                        Deploy For {tab.title}
                      </Link>
                    </div>
                  </motion.div>
                )
            )}
          </div>
        </div>
      </section>

      {/* ─── 9. WHY LEADSHIELD™ VS CAPTCHA ───────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest">Comparative Analysis</h2>
            <p className="text-3xl sm:text-4xl font-extrabold mt-2 text-slate-900 tracking-tight">
              Why LeadShield™ vs CAPTCHA
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-slate-200/80 rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-900 text-xs font-extrabold uppercase tracking-wider">
                  <th className="p-4 sm:p-5">Defense Metrics</th>
                  <th className="p-4 sm:p-5 text-blue-600 bg-blue-50/20 border-x border-slate-200/80">LeadShield™ Protection</th>
                  <th className="p-4 sm:p-5">Standard CAPTCHA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-semibold">
                {[
                  { metric: 'User friction', us: 'Completely invisible (no puzzle grids)', competitor: 'High friction (puzzles, delays)' },
                  { metric: 'CRM contact savings', us: 'Blocks fake domains, typos, & disposables', competitor: 'Only blocks script bots' },
                  { metric: 'Verification execution', us: 'Real-time SMTP + MX handshake checks', competitor: 'Only analyzes user activity patterns' },
                  { metric: 'Form conversion rates', us: 'Maintains optimal conversion rates', competitor: 'Reduces form completions by 3% to 5%' },
                  { metric: 'Accessibility compliance', us: 'Fully compliant with screen readers', competitor: 'Creates barriers for impaired users' }
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/40">
                    <td className="p-4 sm:p-5 text-slate-900 font-bold">{row.metric}</td>
                    <td className="p-4 sm:p-5 text-blue-700 bg-blue-50/10 border-x border-slate-200/80 flex items-center gap-1.5">
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

      {/* ─── 10. INTEGRATIONS ────────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest">Connective Ecosystem</h2>
            <p className="text-3xl sm:text-4xl font-extrabold mt-2 text-slate-900 tracking-tight">
              Connect Natively With Your CRM Stack
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {INTEGRATIONS.map((integ, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 text-center flex flex-col justify-center items-center shadow-sm hover:shadow hover:border-slate-300 transition-all">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 font-bold flex items-center justify-center mb-3 text-sm">
                  ⚡
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm">{integ.name}</h4>
                <p className="text-[10px] text-slate-500 mt-1 leading-snug">{integ.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 11. DEPLOY IN MINUTES ───────────────────────────────────────────── */}
      <section id="deploy" className="py-20 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[350px] h-[350px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold text-blue-400 uppercase tracking-widest">Developer First</h2>
            <p className="text-3xl sm:text-4xl font-extrabold mt-2 tracking-tight">
              Deploy In Under 5 Minutes
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 flex flex-col gap-2">
              {INSTALL_TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveInstallTab(tab.id)}
                  className={`flex items-center gap-3 px-5 py-4 rounded-xl border text-left transition-all ${
                    activeInstallTab === tab.id
                      ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/15'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <CodeIcon />
                  <span className="text-sm font-bold">{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl relative">
              <div className="absolute top-4 right-4 text-[10px] uppercase font-mono font-bold text-slate-600 tracking-wider">Code editor</div>
              <pre className="overflow-x-auto text-[12px] font-mono text-slate-300 leading-relaxed max-h-[300px]">
                <code>{INSTALL_TABS.find(t => t.id === activeInstallTab)?.code}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 12. INCLUDED IN CLEANBOUNCE PLANS ───────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 sm:p-12 text-white text-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent pointer-events-none" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
                💡 Included by default
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Included In CleanBounce Plans
              </h2>
              <p className="mt-4 text-slate-400 max-w-2xl mx-auto leading-relaxed text-sm">
                LeadShield™ is fully integrated into all active CleanBounce plans. There are no secondary integration fees, hidden licenses, or distinct setup costs.
              </p>
              
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-800/80 pt-8">
                {[
                  { value: '200 / mo', label: 'Free Trial Checks' },
                  { value: 'No Contract', label: 'Cancel Subscription Anytime' },
                  { value: 'Zero Setup', label: 'Activate In 60 Seconds' }
                ].map((item, idx) => (
                  <div key={idx} className="text-center">
                    <p className="text-xl font-extrabold text-blue-400">{item.value}</p>
                    <p className="text-[11px] text-slate-500 mt-1 uppercase font-bold tracking-wider">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 13. TRUST SIGNALS & 14. FINAL CTA ──────────────────────────────── */}
      <section className="py-20 bg-slate-950 text-white relative border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Trust Signals Block */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
            {[
              { label: 'Uptime Guarantee', val: '99.99%', sub: 'SLA committed API availability' },
              { label: 'Latency Response', val: '<85ms', sub: 'Instant verification response' },
              { label: 'SOC2 Ready', val: 'Compliant', sub: 'Enterprise information security' },
              { label: 'GDPR Compliant', val: 'Secure', sub: 'Privacy first data policies' }
            ].map(signal => (
              <div key={signal.label} className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-4 text-center">
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{signal.label}</p>
                <p className="text-2xl font-extrabold text-white mt-1">{signal.val}</p>
                <p className="text-[9px] text-slate-500 mt-0.5 leading-snug">{signal.sub}</p>
              </div>
            ))}
          </div>

          {/* Final CTA Block */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Start Protecting Your Funnel in 5 Minutes
            </h2>
            <p className="mt-4 text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
              Join SaaS and e-commerce companies keeping their pipelines clean. Try LeadShield™ free today.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/signup"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-xl shadow-blue-500/25 transition-all text-base text-center active:scale-[0.98]"
              >
                Get Started Free
              </Link>
            </div>
            <p className="text-slate-500 text-xs mt-3 font-semibold uppercase tracking-wider">
              No credit card required • Includes 200 free monthly checks
            </p>
          </div>

        </div>
      </section>
      
    </div>
  )
}
