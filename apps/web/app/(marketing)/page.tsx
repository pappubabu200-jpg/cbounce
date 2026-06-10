'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '@/components/shared/Navbar'

interface Step {
  id: string
  label: string
  status: 'idle' | 'running' | 'success'
}

// Eased Count Up animation for SaaS metrics
function AnimatedCounter({ target, decimals = 0, suffix = '' }: { target: number; decimals?: number; suffix?: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const duration = 1500 // ms
    const startTime = performance.now()

    let animationFrameId: number

    const updateCount = (currentTime: number) => {
      const elapsedTime = currentTime - startTime
      const progress = Math.min(elapsedTime / duration, 1)
      const easeProgress = progress * (2 - progress) // quadratic ease out
      const currentVal = start + easeProgress * (target - start)
      setCount(currentVal)

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCount)
      } else {
        setCount(target)
      }
    }

    animationFrameId = requestAnimationFrame(updateCount)
    return () => cancelAnimationFrame(animationFrameId)
  }, [target])

  return <span>{count.toFixed(decimals)}{suffix}</span>
}

export default function HomePage() {
  const [email, setEmail] = useState('john@company.com')
  const [isVerifying, setIsVerifying] = useState(false)
  const [hasVerified, setHasVerified] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  
  const [steps, setSteps] = useState<Step[]>([
    { id: 'syntax', label: 'Checking email syntax validation', status: 'idle' },
    { id: 'dns', label: 'Resolving DNS MX records', status: 'idle' },
    { id: 'smtp', label: 'Verifying SMTP server handshake', status: 'idle' },
    { id: 'disposable', label: 'Detecting disposable & temporary providers', status: 'idle' },
    { id: 'leadshield', label: 'Running LeadShield™ threat intelligence', status: 'idle' }
  ])

  const handleVerify = () => {
    if (!email) return
    setIsVerifying(true)
    setHasVerified(false)
    setCurrentStep(0)
    
    // Reset steps
    setSteps(prev => prev.map(s => ({ ...s, status: 'idle' })))
  }

  useEffect(() => {
    if (!isVerifying) return

    if (currentStep < steps.length) {
      setSteps(prev => prev.map((s, idx) => {
        if (idx === currentStep) return { ...s, status: 'running' }
        if (idx < currentStep) return { ...s, status: 'success' }
        return s
      }))

      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1)
      }, 700)

      return () => clearTimeout(timer)
    } else {
      setSteps(prev => prev.map(s => ({ ...s, status: 'success' })))
      setIsVerifying(false)
      setHasVerified(true)
    }
  }, [isVerifying, currentStep])

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-900">
      <Navbar />

      <main>
        
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32">
          {/* Ambient background decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none -z-10">
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-400/10 blur-[120px]" />
            <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-sky-400/10 blur-[130px]" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              {/* LEFT SIDE: Hero copy & credentials */}
              <motion.div 
                className="lg:col-span-6 flex flex-col justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                {/* Badge */}
                <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold tracking-wide mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                  </span>
                  200 Free Credits on Signup
                </div>

                {/* Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.05] mb-6">
                  Email Verification <br className="hidden sm:inline" />
                  <span className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
                    + LeadShield™ Protection
                  </span>
                </h1>

                {/* Strong SaaS Copy */}
                <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-xl">
                  Clean your mailing lists instantly and secure your sign-up forms from fake leads, spam bots, and temporary disposable domains. Deliver 99.9% of your emails and ship code with confidence.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 mb-10">
                  <a 
                    href="/signup" 
                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-base shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 active:scale-[0.98] transition-all duration-150"
                  >
                    Start Free — 200 Credits
                  </a>
                  <a 
                    href="#demo" 
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-base active:scale-[0.98] transition-all duration-150 shadow-sm"
                  >
                    <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Watch Demo
                  </a>
                </div>

                {/* Trust badges */}
                <div className="border-t border-slate-200/80 pt-8">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Enterprise Trust & Compliance</p>
                  <div className="flex flex-wrap gap-x-8 gap-y-3">
                    <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                      <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      SOC2 Certified
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                      <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      GDPR Ready
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                      <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      99.99% Accuracy SLA
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* RIGHT SIDE: Interactive verification sandbox */}
              <motion.div 
                className="lg:col-span-6 relative"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
              >
                {/* Background glowing rings */}
                <div className="absolute -z-10 -top-6 -right-6 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
                <div className="absolute -z-10 -bottom-6 -left-6 w-72 h-72 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

                {/* Main Panel */}
                <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-2xl rounded-2xl p-6 relative overflow-hidden">
                  
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Live Sandbox</span>
                    </div>
                    <div className="text-xs font-medium text-slate-400">v1.2.0 API Online</div>
                  </div>

                  {/* Input block */}
                  <div className="mb-5">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                    <div className="relative flex gap-2">
                      <input 
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          setHasVerified(false)
                          setIsVerifying(false)
                        }}
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

                  {/* ANIMATION CONTAINER */}
                  <div className="min-h-[280px] flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                      
                      {/* IDLE state */}
                      {!isVerifying && !hasVerified && (
                        <motion.div 
                          key="idle"
                          className="text-center py-10"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-sm">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 19v-8.93a2 2 0 01.89-1.664l8-5.333a2 2 0 012.22 0l8 5.333A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-2.25-1.5a2 2 0 00-2.22 0l-2.25 1.5" />
                            </svg>
                          </div>
                          <h3 className="font-semibold text-slate-800 text-sm mb-1">Verify Email Sandbox</h3>
                          <p className="text-xs text-slate-400 max-w-[260px] mx-auto leading-relaxed">
                            Click "Verify Email" to trace real-time deliverability and LeadShield™ analysis.
                          </p>
                        </motion.div>
                      )}

                      {/* RUNNING / SCANNING state */}
                      {isVerifying && (
                        <motion.div 
                          key="verifying"
                          className="space-y-3.5 py-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Running Checks</span>
                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                              {Math.round(((currentStep) / steps.length) * 100)}%
                            </span>
                          </div>
                          {steps.map((step, idx) => (
                            <div 
                              key={step.id} 
                              className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all duration-300 ${
                                step.status === 'running' 
                                  ? 'bg-blue-50/50 border-blue-200 text-blue-900 shadow-sm' 
                                  : step.status === 'success'
                                  ? 'bg-slate-50 border-slate-100 text-slate-500'
                                  : 'bg-transparent border-transparent text-slate-300'
                              }`}
                            >
                              {/* Icon status */}
                              <div className="flex-shrink-0">
                                {step.status === 'success' && (
                                  <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                                {step.status === 'running' && (
                                  <svg className="animate-spin h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                  </svg>
                                )}
                                {step.status === 'idle' && (
                                  <div className="w-5 h-5 rounded-full border-2 border-slate-200 flex-shrink-0" />
                                )}
                              </div>
                              <span className="text-xs font-semibold">{step.label}</span>
                            </div>
                          ))}
                        </motion.div>
                      )}

                      {/* SUCCESS results block */}
                      {hasVerified && (
                        <motion.div 
                          key="success"
                          className="space-y-6 py-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        >
                          {/* Two-Column breakdown */}
                          <div className="grid grid-cols-2 gap-4">
                            
                            {/* Core metrics */}
                            <div className="space-y-3 bg-slate-50 border border-slate-100 p-4 rounded-xl relative overflow-hidden">
                              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Deliverability</div>
                              
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-slate-500">Status</span>
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                                  Valid <span className="text-[10px]">✅</span>
                                </span>
                              </div>

                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-slate-500">Score</span>
                                <span className="text-xs font-extrabold text-slate-800">98/100</span>
                              </div>

                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-slate-500">MX Found</span>
                                <span className="text-xs font-bold text-emerald-600">Yes</span>
                              </div>

                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-slate-500">SMTP</span>
                                <span className="text-xs font-bold text-emerald-600">Reachable</span>
                              </div>
                            </div>

                            {/* Risk metrics */}
                            <div className="space-y-3 bg-slate-50 border border-slate-100 p-4 rounded-xl">
                              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Threat Profiling</div>

                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-slate-500">Disposable</span>
                                <span className="text-xs font-bold text-slate-700">No</span>
                              </div>

                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-slate-500">Role Account</span>
                                <span className="text-xs font-bold text-slate-700">No</span>
                              </div>

                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-slate-500">Risk Level</span>
                                <span className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                                  Low
                                </span>
                              </div>
                            </div>

                          </div>

                          {/* LeadShield Banner */}
                          <motion.div 
                            className="bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-100 p-4 rounded-xl"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.15 }}
                          >
                            <div className="flex items-center gap-2 mb-3">
                              <div className="bg-blue-600 text-white p-1 rounded-md">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                              </div>
                              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">LeadShield™ Analysis</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 border-b border-blue-100/50 pb-3 mb-3">
                              <div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Lead Quality</div>
                                <div className="text-sm font-extrabold text-blue-900">Excellent</div>
                              </div>
                              <div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Domain Reputation</div>
                                <div className="text-sm font-extrabold text-blue-900">High</div>
                              </div>
                            </div>

                            <div className="flex items-center justify-center gap-2 bg-emerald-500/10 text-emerald-800 text-xs font-bold py-2 rounded-lg border border-emerald-500/20">
                              <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
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

        {/* SECTION 1: TRUST BAR */}
        <section className="border-y border-slate-200/60 bg-white py-16 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-sm font-bold text-slate-400 uppercase tracking-widest mb-10">
              Trusted by marketers, agencies and SaaS teams
            </h2>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              
              {/* Stat Card 1 */}
              <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-6 text-center shadow-sm">
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-1">
                  <AnimatedCounter target={100} suffix="K+" />
                </div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Emails Verified
                </div>
              </div>

              {/* Stat Card 2 */}
              <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-6 text-center shadow-sm">
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-1">
                  <AnimatedCounter target={99.5} decimals={1} suffix="%" />
                </div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Accuracy Guarantee
                </div>
              </div>

              {/* Stat Card 3 */}
              <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-6 text-center shadow-sm">
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-1">
                  <AnimatedCounter target={40} suffix="%+" />
                </div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Bounce Reduction
                </div>
              </div>

              {/* Stat Card 4 */}
              <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-6 text-center shadow-sm">
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-1">
                  <AnimatedCounter target={24} suffix="/7" />
                </div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  API Availability
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 2: FEATURE GRID */}
        <section className="py-24 lg:py-32 relative">
          {/* Subtle decoration blobs for Section 2 */}
          <div className="absolute top-[20%] left-[5%] w-96 h-96 rounded-full bg-blue-400/5 blur-[100px] pointer-events-none -z-10" />
          <div className="absolute bottom-[20%] right-[5%] w-96 h-96 rounded-full bg-sky-400/5 blur-[100px] pointer-events-none -z-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">Enterprise Suite</h2>
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                Everything you need to safeguard deliverability
              </p>
              <p className="text-slate-500 text-lg leading-relaxed">
                Unlock high-fidelity verification tools designed to fit seamless development and marketing integrations.
              </p>
            </div>

            {/* The 6 Feature Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Feature Card 1 */}
              <motion.div 
                className="group relative p-[1px] rounded-2xl bg-slate-200/80 hover:bg-gradient-to-r hover:from-blue-600 hover:to-sky-500 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-blue-500/5"
                whileHover={{ y: -8, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div className="bg-white rounded-[15px] p-8 w-full h-full flex flex-col items-start">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-blue-100">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Email Verification</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Verify emails before sending. Ensure server status, check MX records, and handshake status in milliseconds.
                  </p>
                </div>
              </motion.div>

              {/* Feature Card 2 */}
              <motion.div 
                className="group relative p-[1px] rounded-2xl bg-slate-200/80 hover:bg-gradient-to-r hover:from-blue-600 hover:to-sky-500 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-blue-500/5"
                whileHover={{ y: -8, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div className="bg-white rounded-[15px] p-8 w-full h-full flex flex-col items-start">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-blue-100">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Bulk Verification</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Clean thousands of emails at once. Upload massive CSV files and download filtered lists without any script lag.
                  </p>
                </div>
              </motion.div>

              {/* Feature Card 3 */}
              <motion.div 
                className="group relative p-[1px] rounded-2xl bg-slate-200/80 hover:bg-gradient-to-r hover:from-blue-600 hover:to-sky-500 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-blue-500/5"
                whileHover={{ y: -8, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div className="bg-white rounded-[15px] p-8 w-full h-full flex flex-col items-start">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-blue-100">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">LeadShield™</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Block fake and risky leads. Integrate our form widget or webhook endpoint to immediately bounce bots and disown disposable emails.
                  </p>
                </div>
              </motion.div>

              {/* Feature Card 4 */}
              <motion.div 
                className="group relative p-[1px] rounded-2xl bg-slate-200/80 hover:bg-gradient-to-r hover:from-blue-600 hover:to-sky-500 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-blue-500/5"
                whileHover={{ y: -8, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div className="bg-white rounded-[15px] p-8 w-full h-full flex flex-col items-start">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-blue-100">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Verification API</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Real-time API verification. Sub-100ms request handlings built with optimized endpoints for high-throughput pipelines.
                  </p>
                </div>
              </motion.div>

              {/* Feature Card 5 */}
              <motion.div 
                className="group relative p-[1px] rounded-2xl bg-slate-200/80 hover:bg-gradient-to-r hover:from-blue-600 hover:to-sky-500 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-blue-500/5"
                whileHover={{ y: -8, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div className="bg-white rounded-[15px] p-8 w-full h-full flex flex-col items-start">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-blue-100">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Google Sheets Verification</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Verify directly inside Sheets. Use our custom integration extension to clean columns of email rows inside spreadsheets.
                  </p>
                </div>
              </motion.div>

              {/* Feature Card 6 */}
              <motion.div 
                className="group relative p-[1px] rounded-2xl bg-slate-200/80 hover:bg-gradient-to-r hover:from-blue-600 hover:to-sky-500 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-blue-500/5"
                whileHover={{ y: -8, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div className="bg-white rounded-[15px] p-8 w-full h-full flex flex-col items-start">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-blue-100">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Analytics & Reports</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Track quality and deliverability. Visual dash metrics, campaign tracking reports, and alert summaries.
                  </p>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

      </main>
    </div>
  )
}
