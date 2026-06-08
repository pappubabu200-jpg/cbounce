'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

const NAV = {
  features: {
    label: 'Features',
    sections: [
      {
        title: '✉️ Email Verification',
        items: [
          { label: 'Single Verification', href: '/features/single', desc: 'Verify one email instantly' },
          { label: 'Bulk Verification', href: '/features/bulk', desc: 'Upload & verify CSV lists' },
          { label: 'Google Sheets', href: '/features/sheets', desc: 'Verify directly from Sheets' },
        ]
      },
      {
        title: '🛡️ LeadShield™',
        items: [
          { label: 'Real-Time Form Protection', href: '/features/leadshield', desc: 'Block risky leads at submission' },
          { label: 'Bot & Disposable Detection', href: '/features/detection', desc: 'Catch fake signups instantly' },
        ]
      },
      {
        title: '📊 Intelligence',
        items: [
          { label: 'Bounce Forecaster', href: '/features/forecaster', desc: 'Predict bounces before sending', badge: 'New' },
          { label: 'Domain Health Score', href: '/features/domain', desc: 'SPF, DKIM, DMARC analysis', badge: 'New' },
        ]
      },
      {
        title: '⚙️ Developer',
        items: [
          { label: 'Verification API', href: '/developers', desc: 'Full REST API access' },
        ]
      },
    ]
  },
  integrations: {
    label: 'Integrations',
    items: [
      { icon: '🔗', label: 'REST API', href: '/developers', desc: 'Full programmatic access' },
      { icon: '📊', label: 'Google Sheets', href: '/integrations/sheets', desc: 'Verify inside Sheets' },
      { icon: '⚡', label: 'Zapier', href: '/integrations/zapier', desc: 'Coming Soon', soon: true },
      { icon: '🔄', label: 'Make', href: '/integrations/make', desc: 'Coming Soon', soon: true },
      { icon: '🏢', label: 'HubSpot', href: '/integrations/hubspot', desc: 'Coming Soon', soon: true },
      { icon: '☁️', label: 'Salesforce', href: '/integrations/salesforce', desc: 'Coming Soon', soon: true },
    ]
  },
  resources: {
    label: 'Resources',
    items: [
      { icon: '📚', label: 'Documentation', href: '/docs' },
      { icon: '🔧', label: 'API Docs', href: '/developers' },
      { icon: '❓', label: 'Help Center', href: '/help' },
      { icon: '📝', label: 'Blog', href: '/blog' },
      { icon: '📧', label: 'Email Verification Guide', href: '/guides/email' },
      { icon: '📈', label: 'Deliverability Guide', href: '/guides/deliverability' },
      { icon: '📡', label: 'Status Page', href: '/status' },
      { icon: '📞', label: 'Contact Us', href: '/contact' },
    ]
  }
}

export default function Navbar() {
  const [open, setOpen] = useState<string | null>(null)
  const [mobile, setMobile] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(null)
    }
    window.addEventListener('scroll', handleScroll)
    document.addEventListener('mousedown', handleClick)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousedown', handleClick)
    }
  }, [])

  return (
    <>
      {/* Announcement Bar */}
      <div style={{ background: 'linear-gradient(90deg, #2563EB, #7C3AED)', padding: '8px 24px', textAlign: 'center' }}>
        <span style={{ color: '#fff', fontSize: 13, fontWeight: 500 }}>
          🎉 200 free credits — No credit card required{' '}
          <Link href="/signup" style={{ color: '#BAE6FD', fontWeight: 700, textDecoration: 'underline' }}>
            Start Free →
          </Link>
        </span>
      </div>

      {/* Main Navbar */}
      <nav ref={ref} style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: scrolled ? 'rgba(255,255,255,0.97)' : '#fff',
        borderBottom: '1px solid #E2E8F0',
        backdropFilter: 'blur(12px)',
        boxShadow: scrolled ? '0 2px 12px rgba(0,0,0,0.06)' : 'none',
        transition: 'all 0.2s',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', height: 64, gap: 4 }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginRight: 16, flexShrink: 0 }}>
            <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#2563EB,#0EA5E9)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>⚡</div>
            <span style={{ fontWeight: 800, fontSize: 17, color: '#0F172A', letterSpacing: -0.5 }}>CBounce</span>
          </Link>

          {/* Desktop Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>

            {/* Features */}
            <div style={{ position: 'relative' }}>
              <button
                onMouseEnter={() => setOpen('features')}
                onMouseLeave={() => setOpen(null)}
                onClick={() => setOpen(open === 'features' ? null : 'features')}
                style={{ background: open === 'features' ? '#F1F5F9' : 'none', border: 'none', cursor: 'pointer', padding: '8px 12px', borderRadius: 7, fontSize: 14, fontWeight: 500, color: '#374151', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'inherit' }}>
                Features
                <span style={{ fontSize: 10, color: '#94A3B8', transform: open === 'features' ? 'rotate(180deg)' : 'none', transition: '0.2s' }}>▼</span>
              </button>

              {open === 'features' && (
                <div
                  onMouseEnter={() => setOpen('features')}
                  onMouseLeave={() => setOpen(null)}
                  style={{ position: 'absolute', top: '100%', left: 0, background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, padding: 20, width: 520, boxShadow: '0 12px 40px rgba(0,0,0,0.12)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 4 }}>
                  {NAV.features.sections.map((section) => (
                    <div key={section.title}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{section.title}</div>
                      {section.items.map((item) => (
                        <Link key={item.label} href={item.href} style={{ display: 'block', padding: '8px 10px', borderRadius: 8, textDecoration: 'none', marginBottom: 2 }}
                          onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFC')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{item.label}</span>
                            {'badge' in item && item.badge && (
                              <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 8, background: '#EDE9FE', color: '#6D28D9' }}>{item.badge}</span>
                            )}
                          </div>
                          <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 1 }}>{item.desc}</div>
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Integrations */}
            <div style={{ position: 'relative' }}>
              <button
                onMouseEnter={() => setOpen('integrations')}
                onMouseLeave={() => setOpen(null)}
                onClick={() => setOpen(open === 'integrations' ? null : 'integrations')}
                style={{ background: open === 'integrations' ? '#F1F5F9' : 'none', border: 'none', cursor: 'pointer', padding: '8px 12px', borderRadius: 7, fontSize: 14, fontWeight: 500, color: '#374151', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'inherit' }}>
                Integrations
                <span style={{ fontSize: 10, color: '#94A3B8', transform: open === 'integrations' ? 'rotate(180deg)' : 'none', transition: '0.2s' }}>▼</span>
              </button>

              {open === 'integrations' && (
                <div
                  onMouseEnter={() => setOpen('integrations')}
                  onMouseLeave={() => setOpen(null)}
                  style={{ position: 'absolute', top: '100%', left: 0, background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, padding: 16, width: 280, boxShadow: '0 12px 40px rgba(0,0,0,0.12)', marginTop: 4 }}>
                  {NAV.integrations.items.map((item) => (
                    <Link key={item.label} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 8, textDecoration: 'none' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFC')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: item.soon ? '#94A3B8' : '#0F172A' }}>{item.label}</span>
                          {item.soon && <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 8, background: '#F1F5F9', color: '#94A3B8' }}>Soon</span>}
                        </div>
                        <div style={{ fontSize: 11, color: '#94A3B8' }}>{item.desc}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Direct links */}
            {[
              { label: 'Developers', href: '/developers' },
              { label: 'Pricing', href: '/pricing' },
            ].map(link => (
              <Link key={link.href} href={link.href} style={{ padding: '8px 12px', borderRadius: 7, fontSize: 14, fontWeight: 500, color: '#374151', textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#F1F5F9')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                {link.label}
              </Link>
            ))}

            {/* Resources */}
            <div style={{ position: 'relative' }}>
              <button
                onMouseEnter={() => setOpen('resources')}
                onMouseLeave={() => setOpen(null)}
                onClick={() => setOpen(open === 'resources' ? null : 'resources')}
                style={{ background: open === 'resources' ? '#F1F5F9' : 'none', border: 'none', cursor: 'pointer', padding: '8px 12px', borderRadius: 7, fontSize: 14, fontWeight: 500, color: '#374151', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'inherit' }}>
                Resources
                <span style={{ fontSize: 10, color: '#94A3B8', transform: open === 'resources' ? 'rotate(180deg)' : 'none', transition: '0.2s' }}>▼</span>
              </button>

              {open === 'resources' && (
                <div
                  onMouseEnter={() => setOpen('resources')}
                  onMouseLeave={() => setOpen(null)}
                  style={{ position: 'absolute', top: '100%', left: 0, background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, padding: 12, width: 240, boxShadow: '0 12px 40px rgba(0,0,0,0.12)', marginTop: 4 }}>
                  {NAV.resources.items.map((item) => (
                    <Link key={item.label} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 500, color: '#374151' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFC')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <Link href="/login" style={{ padding: '8px 16px', fontSize: 14, fontWeight: 500, color: '#374151', textDecoration: 'none', borderRadius: 7 }}
              onMouseEnter={e => (e.currentTarget.style.background = '#F1F5F9')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
              Login
            </Link>
            <Link href="/signup" style={{ padding: '9px 18px', background: 'linear-gradient(135deg,#2563EB,#1D4ED8)', color: '#fff', textDecoration: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, boxShadow: '0 2px 8px rgba(37,99,235,0.3)' }}>
              Start Free →
            </Link>
          </div>

          {/* Mobile burger */}
          <button onClick={() => setMobile(!mobile)} style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, marginLeft: 8 }}>
            {mobile ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile menu */}
        {mobile && (
          <div style={{ borderTop: '1px solid #E2E8F0', padding: '16px 24px', background: '#fff' }}>
            {['Features', 'Integrations', 'Developers', 'Pricing', 'Resources'].map(item => (
              <div key={item} style={{ padding: '12px 0', fontSize: 15, fontWeight: 500, color: '#374151', borderBottom: '1px solid #F1F5F9', cursor: 'pointer' }}>{item}</div>
            ))}
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <Link href="/login" style={{ flex: 1, padding: '10px', textAlign: 'center', border: '1px solid #E2E8F0', borderRadius: 8, textDecoration: 'none', fontSize: 14, fontWeight: 600, color: '#374151' }}>Login</Link>
              <Link href="/signup" style={{ flex: 1, padding: '10px', textAlign: 'center', background: '#2563EB', borderRadius: 8, textDecoration: 'none', fontSize: 14, fontWeight: 600, color: '#fff' }}>Start Free</Link>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
