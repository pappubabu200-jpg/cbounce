'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import { NAVIGATION_CONFIG, NavItem, ServicesCategory, IntegrationsCategory } from '../../config/navigation'

// Helper component to resolve SVG icons by name
function NavIcon({ name, className = 'w-5 h-5' }: { name: string; className?: string }) {
  switch (name) {
    case 'mail':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    case 'shield':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    case 'intelligence':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    case 'terminal':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    case 'sheets':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )
    case 'hubspot':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.9 12c0-1-.4-1.9-1-2.6l1.7-1.7c.3-.3.3-.8 0-1.1-.3-.3-.8-.3-1.1 0l-1.7 1.7c-.7-.6-1.6-1-2.6-1V5.1c0-.4-.3-.8-.8-.8s-.8.4-.8.8v2.2c-1 0-1.9.4-2.6 1L8.3 6.6c-.3-.3-.8-.3-1.1 0s-.3.8 0 1.1l1.7 1.7c-.6.7-1 1.6-1 2.6H5.7c-.4 0-.8.3-.8.8s.4.8.8.8h2.2c0 1 .4 1.9 1 2.6l-1.7 1.7c-.3.3-.3.8 0 1.1.2.2.4.2.6.2s.4-.1.6-.2l1.7-1.7c.7.6 1.6 1 2.6 1v2.2c0 .4.3.8.8.8s.8-.3.8-.8v-2.2c1 0 1.9-.4 2.6-1l1.7 1.7c.3.3.8.3 1.1 0 .3-.3.3-.8 0-1.1l-1.7-1.7c.6-.7 1-1.6 1-2.6h2.2c.4 0 .8-.3.8-.8s-.4-.8-.8-.8h-2.2zM12 15c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z" />
        </svg>
      )
    case 'salesforce':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      )
    case 'zapier':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L4 12h7v10l8-10h-7V2z" />
        </svg>
      )
    case 'make':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4-4m-4 4l4 4" />
        </svg>
      )
    case 'mailchimp':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    case 'klaviyo':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 12l-3-3m3 3l3-3M17 8v12m0-12l-3 3m3-3l3 3" />
        </svg>
      )
    case 'activecampaign':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )
    case 'convertkit':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 19v-8.93a2 2 0 01.89-1.664l8-5.333a2 2 0 012.22 0l8 5.333A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-2.25-1.5a2 2 0 00-2.22 0l-2.25 1.5" />
        </svg>
      )
    case 'mailerlite':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      )
    case 'wordpress':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 8l3 8 2-5 2 5 3-8" />
        </svg>
      )
    case 'woocommerce':
    case 'shopify':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    case 'webflow':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    case 'api':
    case 'code':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      )
    case 'webhooks':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    case 'book':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    case 'edit':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    case 'history':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    case 'trending':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    case 'check':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    case 'status':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    case 'phone':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      )
    default:
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
        </svg>
      )
  }
}

export default function Navbar() {
  const [activeTab, setActiveTab] = useState<'services' | 'solutions' | 'integrations' | 'resources' | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mobileSections, setMobileSections] = useState<Record<string, boolean>>({})
  const [mobileSubSections, setMobileSubSections] = useState<Record<string, boolean>>({})

  const navRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const mouseLeaveTimeout = useRef<NodeJS.Timeout | null>(null)

  // Scroll effect to enable styling change when scrolled past 10px
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close active menus when clicking outside
  useEffect(() => {
    const handleMouseDownOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveTab(null)
      }
    }
    document.addEventListener('mousedown', handleMouseDownOutside)
    return () => document.removeEventListener('mousedown', handleMouseDownOutside)
  }, [])

  // Keyboard navigation & Escape key trigger to close dropdowns
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveTab(null)
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Lock body scrolling when mobile navigation drawer is active
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  // Reset navigation states when pathname/route changes
  useEffect(() => {
    setActiveTab(null)
    setMobileMenuOpen(false)
  }, [pathname])

  // Mouse actions with a delay threshold to prevent menu flicker on hover exit
  const handleMouseEnter = useCallback((tab: 'services' | 'solutions' | 'integrations' | 'resources') => {
    if (mouseLeaveTimeout.current) {
      clearTimeout(mouseLeaveTimeout.current)
      mouseLeaveTimeout.current = null
    }
    setActiveTab(tab)
  }, [])

  const handleMouseLeave = useCallback(() => {
    mouseLeaveTimeout.current = setTimeout(() => {
      setActiveTab(null)
    }, 150) // 150ms hover exit delay
  }, [])

  const toggleMobileSection = useCallback((section: string) => {
    setMobileSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }, [])

  const toggleMobileSubSection = useCallback((subsection: string) => {
    setMobileSubSections(prev => ({
      ...prev,
      [subsection]: !prev[subsection]
    }))
  }, [])

  // Checks if a route path is currently active
  const isRouteActive = useCallback((href: string) => {
    if (href === '/') return pathname === '/'
    return pathname?.startsWith(href)
  }, [pathname])

  // Helper values to see if any child under a top-level route is active
  const isServicesActive = useMemo(() => {
    return NAVIGATION_CONFIG.services.some(sec => sec.items.some(item => isRouteActive(item.href)))
  }, [isRouteActive])

  const isSolutionsActive = useMemo(() => {
    return NAVIGATION_CONFIG.solutions.some(item => isRouteActive(item.href))
  }, [isRouteActive])

  const isIntegrationsActive = useMemo(() => {
    return NAVIGATION_CONFIG.integrations.some(cat => cat.items.some(item => isRouteActive(item.href)))
  }, [isRouteActive])

  const isResourcesActive = useMemo(() => {
    return NAVIGATION_CONFIG.resources.some(item => isRouteActive(item.href))
  }, [isRouteActive])

  return (
    <div ref={navRef} className="relative z-50">
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-violet-600 py-2.5 px-4 text-center select-none">
        <span className="text-white text-xs sm:text-sm font-medium tracking-wide">
          🎉 200 free credits — No credit card required{' '}
          <Link href="/signup" className="text-sky-200 font-bold hover:text-sky-100 underline transition ml-1">
            Start Free →
          </Link>
        </span>
      </div>

      {/* Main Navigation Wrapper */}
      <nav
        className={clsx(
          'sticky top-0 w-full transition-all duration-200 border-b border-slate-200/80 backdrop-blur-md',
          scrolled ? 'bg-white/95 shadow-md shadow-slate-900/5' : 'bg-white'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between h-16 gap-4">
            
            {/* Logo Brand Block */}
            <Link
              href="/"
              className="flex items-center gap-2.5 text-decoration-none flex-shrink-0 transition-transform active:scale-95"
              aria-label="CleanBounce Home"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-sky-400 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-500/20">
                ⚡
              </div>
              <span className="font-extrabold text-xl text-slate-900 tracking-tight leading-none">
                CleanBounce
              </span>
            </Link>

            {/* Desktop Navigation Items */}
            <div className="hidden lg:flex items-center gap-1.5 flex-1 justify-center">
              
              {/* Dropdown: Services */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter('services')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className={clsx(
                    'px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors focus:outline-none focus:bg-slate-100',
                    activeTab === 'services' ? 'bg-slate-100 text-blue-600' : isServicesActive ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  )}
                  aria-haspopup="true"
                  aria-expanded={activeTab === 'services'}
                  aria-controls="desktop-menu-services"
                >
                  Services
                  <svg
                    className={clsx('w-3.5 h-3.5 text-slate-400 transition-transform duration-200', activeTab === 'services' && 'rotate-180')}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {activeTab === 'services' && (
                  <div
                    id="desktop-menu-services"
                    role="menu"
                    className="absolute left-1/2 -translate-x-[200px] top-full mt-2 w-[880px] bg-white border border-slate-200/80 rounded-2xl shadow-xl shadow-slate-900/10 p-6 grid grid-cols-4 gap-6 animate-in fade-in slide-in-from-top-1 duration-150"
                  >
                    {NAVIGATION_CONFIG.services.map((cat: ServicesCategory) => (
                      <div key={cat.title} className="flex flex-col gap-4 border-r border-slate-100 last:border-0 pr-4 last:pr-0">
                        <div className="flex items-start gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 border border-blue-100/50 shadow-sm">
                            <NavIcon name={cat.iconName} className="w-4.5 h-4.5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 leading-tight">{cat.title}</h4>
                            <p className="text-[11px] text-slate-400 mt-1 leading-normal">{cat.description}</p>
                          </div>
                        </div>
                        <ul className="flex flex-col gap-1.5 mt-2">
                          {cat.items.map((item: NavItem) => (
                            <li key={item.label}>
                              <Link
                                href={item.href}
                                className={clsx(
                                  'group block p-2 rounded-lg transition-colors',
                                  isRouteActive(item.href) ? 'bg-blue-50/50' : 'hover:bg-slate-50'
                                )}
                              >
                                <div className="flex items-center gap-1.5">
                                  <span className={clsx('text-xs font-bold transition-colors', isRouteActive(item.href) ? 'text-blue-600' : 'text-slate-800 group-hover:text-blue-600')}>
                                    {item.label}
                                  </span>
                                  {item.badge && (
                                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-700 leading-none">
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                {item.description && (
                                  <p className="text-[11px] text-slate-400 group-hover:text-slate-500 mt-0.5 leading-normal truncate">
                                    {item.description}
                                  </p>
                                )}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Dropdown: Solutions */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter('solutions')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className={clsx(
                    'px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors focus:outline-none focus:bg-slate-100',
                    activeTab === 'solutions' ? 'bg-slate-100 text-blue-600' : isSolutionsActive ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  )}
                  aria-haspopup="true"
                  aria-expanded={activeTab === 'solutions'}
                  aria-controls="desktop-menu-solutions"
                >
                  Solutions
                  <svg
                    className={clsx('w-3.5 h-3.5 text-slate-400 transition-transform duration-200', activeTab === 'solutions' && 'rotate-180')}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {activeTab === 'solutions' && (
                  <div
                    id="desktop-menu-solutions"
                    role="menu"
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[580px] bg-white border border-slate-200/80 rounded-2xl shadow-xl shadow-slate-900/10 p-5 grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-1 duration-150"
                  >
                    {NAVIGATION_CONFIG.solutions.map((item: NavItem) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className={clsx(
                          'group flex flex-col p-3 rounded-xl transition-all duration-150',
                          isRouteActive(item.href) ? 'bg-blue-50/50' : 'hover:bg-slate-50'
                        )}
                      >
                        <span className={clsx('text-xs font-bold transition-colors', isRouteActive(item.href) ? 'text-blue-600' : 'text-slate-800 group-hover:text-blue-600')}>
                          {item.label}
                        </span>
                        {item.description && (
                          <p className="text-[11px] text-slate-400 group-hover:text-slate-500 mt-1 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Dropdown: Integrations */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter('integrations')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className={clsx(
                    'px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors focus:outline-none focus:bg-slate-100',
                    activeTab === 'integrations' ? 'bg-slate-100 text-blue-600' : isIntegrationsActive ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  )}
                  aria-haspopup="true"
                  aria-expanded={activeTab === 'integrations'}
                  aria-controls="desktop-menu-integrations"
                >
                  Integrations
                  <svg
                    className={clsx('w-3.5 h-3.5 text-slate-400 transition-transform duration-200', activeTab === 'integrations' && 'rotate-180')}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {activeTab === 'integrations' && (
                  <div
                    id="desktop-menu-integrations"
                    role="menu"
                    className="absolute left-1/2 -translate-x-[400px] top-full mt-2 w-[820px] bg-white border border-slate-200/80 rounded-2xl shadow-xl shadow-slate-900/10 p-6 flex flex-col gap-5 animate-in fade-in slide-in-from-top-1 duration-150"
                  >
                    <div className="grid grid-cols-4 gap-6">
                      {NAVIGATION_CONFIG.integrations.map((cat: IntegrationsCategory) => (
                        <div key={cat.title} className="flex flex-col gap-2.5">
                          <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none mb-1">
                            {cat.title}
                          </h4>
                          <ul className="flex flex-col gap-1.5">
                            {cat.items.map((item: NavItem) => (
                              <li key={item.label}>
                                <Link
                                  href={item.href}
                                  className={clsx(
                                    'group flex items-center gap-2 p-1.5 rounded-lg transition-colors',
                                    isRouteActive(item.href) ? 'bg-blue-50/50' : 'hover:bg-slate-50'
                                  )}
                                >
                                  <div className="w-6 h-6 rounded-md bg-slate-50 text-slate-500 group-hover:text-blue-600 flex items-center justify-center flex-shrink-0 border border-slate-200/30">
                                    <NavIcon name={item.iconName || ''} className="w-3.5 h-3.5" />
                                  </div>
                                  <span className={clsx('text-xs font-semibold transition-colors', isRouteActive(item.href) ? 'text-blue-600' : 'text-slate-700 group-hover:text-blue-600')}>
                                    {item.label}
                                  </span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                      <p className="text-[11px] text-slate-400 font-medium">Looking for something else? We support 50+ integrations.</p>
                      <Link
                        href="/integrations"
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 transition-all"
                      >
                        Explore all integrations
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Direct Links (API, Pricing) */}
              {NAVIGATION_CONFIG.directLinks.map((item: NavItem) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={clsx(
                    'px-4 py-2 rounded-lg text-sm font-semibold transition-colors',
                    isRouteActive(item.href) ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  )}
                >
                  {item.label}
                </Link>
              ))}

              {/* Dropdown: Resources */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter('resources')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className={clsx(
                    'px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors focus:outline-none focus:bg-slate-100',
                    activeTab === 'resources' ? 'bg-slate-100 text-blue-600' : isResourcesActive ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  )}
                  aria-haspopup="true"
                  aria-expanded={activeTab === 'resources'}
                  aria-controls="desktop-menu-resources"
                >
                  Resources
                  <svg
                    className={clsx('w-3.5 h-3.5 text-slate-400 transition-transform duration-200', activeTab === 'resources' && 'rotate-180')}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {activeTab === 'resources' && (
                  <div
                    id="desktop-menu-resources"
                    role="menu"
                    className="absolute left-1/2 -translate-x-[360px] top-full mt-2 w-[480px] bg-white border border-slate-200/80 rounded-2xl shadow-xl shadow-slate-900/10 p-5 grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-1 duration-150"
                  >
                    {NAVIGATION_CONFIG.resources.map((item: NavItem) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className={clsx(
                          'group flex items-center gap-3 p-2.5 rounded-xl transition-all duration-150',
                          isRouteActive(item.href) ? 'bg-blue-50/50' : 'hover:bg-slate-50'
                        )}
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 group-hover:text-blue-600 flex items-center justify-center border border-slate-200/10 flex-shrink-0">
                          <NavIcon name={item.iconName || ''} className="w-4 h-4" />
                        </div>
                        <span className={clsx('text-xs font-bold transition-colors', isRouteActive(item.href) ? 'text-blue-600' : 'text-slate-800 group-hover:text-blue-600')}>
                          {item.label}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center gap-3.5 flex-shrink-0">
              <Link
                href={NAVIGATION_CONFIG.ctas.login.href}
                className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors px-3 py-2 rounded-lg"
              >
                {NAVIGATION_CONFIG.ctas.login.label}
              </Link>
              <Link
                href={NAVIGATION_CONFIG.ctas.signup.href}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/15 transition-all duration-150 hover:shadow-blue-500/25 active:scale-[0.98]"
              >
                {NAVIGATION_CONFIG.ctas.signup.label}
              </Link>
            </div>

            {/* Mobile Hamburger Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>

          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer System */}
      <div className={clsx('lg:hidden fixed inset-0 z-50 transition-opacity duration-300', mobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none')}>
        {/* Dark Backdrop Overlay */}
        <div
          onClick={() => setMobileMenuOpen(false)}
          className={clsx(
            'absolute inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300',
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          )}
        />

        {/* Sliding Menu Drawer */}
        <div
          className={clsx(
            'absolute top-0 right-0 h-screen w-full max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-out',
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
        >
          {/* Mobile Header Block */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-sky-400 rounded-lg flex items-center justify-center text-white font-bold shadow">
                ⚡
              </div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight">
                CleanBounce
              </span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              aria-label="Close Navigation Drawer"
            >
              <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Nav Links Body Area */}
          <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-5">
            
            {/* Accordion: Services */}
            <div className="border-b border-slate-100 pb-3">
              <button
                onClick={() => toggleMobileSection('services')}
                className="w-full flex items-center justify-between text-left py-2 font-bold text-slate-800 hover:text-blue-600 transition-colors"
              >
                Services
                <svg
                  className={clsx('w-4 h-4 text-slate-400 transition-transform duration-200', mobileSections.services && 'rotate-180')}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={clsx(
                  'mt-2 flex flex-col gap-4 pl-3 overflow-hidden transition-all duration-200',
                  mobileSections.services ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                )}
              >
                {NAVIGATION_CONFIG.services.map((cat: ServicesCategory) => (
                  <div key={cat.title} className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      <NavIcon name={cat.iconName} className="w-3.5 h-3.5 text-blue-600" />
                      {cat.title}
                    </div>
                    <ul className="flex flex-col gap-2 pl-5">
                      {cat.items.map((item: NavItem) => (
                        <li key={item.label}>
                          <Link
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={clsx(
                              'block py-1.5 text-sm font-semibold transition-colors',
                              isRouteActive(item.href) ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'
                            )}
                          >
                            <span className="flex items-center gap-1.5">
                              {item.label}
                              {item.badge && (
                                <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-700 leading-none">
                                  {item.badge}
                                </span>
                              )}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Accordion: Solutions */}
            <div className="border-b border-slate-100 pb-3">
              <button
                onClick={() => toggleMobileSection('solutions')}
                className="w-full flex items-center justify-between text-left py-2 font-bold text-slate-800 hover:text-blue-600 transition-colors"
              >
                Solutions
                <svg
                  className={clsx('w-4 h-4 text-slate-400 transition-transform duration-200', mobileSections.solutions && 'rotate-180')}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <ul
                className={clsx(
                  'mt-2 flex flex-col gap-2 pl-4 overflow-hidden transition-all duration-200',
                  mobileSections.solutions ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                )}
              >
                {NAVIGATION_CONFIG.solutions.map((item: NavItem) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={clsx(
                        'block py-2 text-sm font-semibold transition-colors',
                        isRouteActive(item.href) ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Accordion: Integrations */}
            <div className="border-b border-slate-100 pb-3">
              <button
                onClick={() => toggleMobileSection('integrations')}
                className="w-full flex items-center justify-between text-left py-2 font-bold text-slate-800 hover:text-blue-600 transition-colors"
              >
                Integrations
                <svg
                  className={clsx('w-4 h-4 text-slate-400 transition-transform duration-200', mobileSections.integrations && 'rotate-180')}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={clsx(
                  'mt-2 flex flex-col gap-3 pl-4 overflow-hidden transition-all duration-200',
                  mobileSections.integrations ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                )}
              >
                {NAVIGATION_CONFIG.integrations.map((cat: IntegrationsCategory) => (
                  <div key={cat.title} className="border-l border-slate-100 pl-3.5 my-1">
                    <button
                      onClick={() => toggleMobileSubSection(cat.title)}
                      className="w-full flex items-center justify-between py-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest"
                    >
                      {cat.title}
                      <svg
                        className={clsx('w-3 h-3 text-slate-400 transition-transform duration-200', mobileSubSections[cat.title] && 'rotate-180')}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <ul
                      className={clsx(
                        'flex flex-col gap-1.5 pl-2 overflow-hidden transition-all duration-150',
                        mobileSubSections[cat.title] ? 'max-h-[300px] opacity-100 mt-1' : 'max-h-0 opacity-0 pointer-events-none'
                      )}
                    >
                      {cat.items.map((item: NavItem) => (
                        <li key={item.label}>
                          <Link
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={clsx(
                              'flex items-center gap-2 py-1.5 text-sm font-semibold transition-colors',
                              isRouteActive(item.href) ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'
                            )}
                          >
                            <NavIcon name={item.iconName || ''} className="w-4 h-4 text-slate-400" />
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                
                <Link
                  href="/integrations"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 py-2 inline-flex items-center gap-1"
                >
                  View all 50+ integrations
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Direct Links (API, Pricing) */}
            {NAVIGATION_CONFIG.directLinks.map((item: NavItem) => (
              <div key={item.label} className="border-b border-slate-100 pb-3">
                <Link
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={clsx(
                    'block py-2 font-bold text-slate-800 hover:text-blue-600 transition-colors',
                    isRouteActive(item.href) && 'text-blue-600'
                  )}
                >
                  {item.label}
                </Link>
              </div>
            ))}

            {/* Accordion: Resources */}
            <div className="border-b border-slate-100 pb-3">
              <button
                onClick={() => toggleMobileSection('resources')}
                className="w-full flex items-center justify-between text-left py-2 font-bold text-slate-800 hover:text-blue-600 transition-colors"
              >
                Resources
                <svg
                  className={clsx('w-4 h-4 text-slate-400 transition-transform duration-200', mobileSections.resources && 'rotate-180')}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <ul
                className={clsx(
                  'mt-2 flex flex-col gap-2 pl-4 overflow-hidden transition-all duration-200',
                  mobileSections.resources ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                )}
              >
                {NAVIGATION_CONFIG.resources.map((item: NavItem) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={clsx(
                        'flex items-center gap-2.5 py-2 text-sm font-semibold transition-colors',
                        isRouteActive(item.href) ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'
                      )}
                    >
                      <NavIcon name={item.iconName || ''} className="w-4.5 h-4.5 text-slate-400" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Sticky Mobile Footer block with CTAs */}
          <div className="sticky bottom-0 bg-white border-t border-slate-100 p-5 flex flex-col gap-3">
            <Link
              href={NAVIGATION_CONFIG.ctas.login.href}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-sm rounded-xl transition-all active:scale-[0.98]"
            >
              {NAVIGATION_CONFIG.ctas.login.label}
            </Link>
            <Link
              href={NAVIGATION_CONFIG.ctas.signup.href}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/15 transition-all active:scale-[0.98]"
            >
              {NAVIGATION_CONFIG.ctas.signup.label}
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
