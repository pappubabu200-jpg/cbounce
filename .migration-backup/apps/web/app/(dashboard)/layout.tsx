'use client'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

const nav = [
  { section: null, items: [
    { icon: '▣', label: 'Dashboard', href: '/dashboard' },
  ]},
  { section: 'Verification', items: [
    { icon: '✉️', label: 'Single Verify', href: '/verify' },
    { icon: '📋', label: 'Bulk Verify', href: '/bulk' },
    { icon: '📁', label: 'History', href: '/history' },
  ]},
  { section: 'Protection', items: [
    { icon: '🛡️', label: 'LeadShield™', href: '/dashboard/leadshield', badge: 'Live' },
    { icon: '📉', label: 'Bounce Forecaster', href: '/forecaster', badge: 'New' },
    { icon: '🏥', label: 'Domain Health', href: '/domain', badge: 'New' },
  ]},
  { section: 'Insights', items: [
    { icon: '📊', label: 'Analytics', href: '/analytics' },
  ]},
  { section: 'Developer', items: [
    { icon: '🔑', label: 'API Keys', href: '/apikeys' },
    { icon: '📡', label: 'Webhooks', href: '/webhooks' },
  ]},
  { section: 'Account', items: [
    { icon: '💳', label: 'Billing', href: '/billing' },
    { icon: '👥', label: 'Team', href: '/team' },
    { icon: '⚙️', label: 'Settings', href: '/settings' },
  ]},
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/login')
      } else {
        setUser(data.user)
        setLoading(false)
      }
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#F8FAFC' }}>
      <div style={{ fontSize: 14, color: '#64748B' }}>⏳ Loading...</div>
    </div>
  )

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'system-ui, sans-serif', overflow: 'hidden' }}>

      {/* Sidebar */}
      <aside style={{ width: 224, background: '#0F172A', display: 'flex', flexDirection: 'column', flexShrink: 0, overflowY: 'auto' }}>
        <div style={{ padding: '18px 16px', borderBottom: '1px solid #1E293B', flexShrink: 0 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg,#2563EB,#0EA5E9)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>⚡</div>
            <span style={{ color: '#F1F5F9', fontWeight: 800, fontSize: 15 }}>cbounce.io</span>
          </Link>
        </div>

        <nav style={{ flex: 1, padding: '8px 0' }}>
          {nav.map((group, gi) => (
            <div key={gi} style={{ marginBottom: 4 }}>
              {group.section && (
                <div style={{ padding: '10px 16px 4px', fontSize: 10, fontWeight: 700, color: '#334155', letterSpacing: 1.2, textTransform: 'uppercase' }}>
                  {group.section}
                </div>
              )}
              {group.items.map(item => {
                const active = pathname === item.href
                return (
                  <Link key={item.href} href={item.href} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '9px 16px', textDecoration: 'none',
                    background: active ? 'rgba(37,99,235,0.15)' : 'transparent',
                    borderLeft: active ? '2px solid #2563EB' : '2px solid transparent',
                  }}>
                    <span style={{ fontSize: 15, flexShrink: 0 }}>{item.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? '#E2E8F0' : '#94A3B8', flex: 1, whiteSpace: 'nowrap' }}>
                      {item.label}
                    </span>
                    {'badge' in item && item.badge && (
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 8,
                        background: item.badge === 'New' ? 'rgba(124,58,237,0.25)' : 'rgba(16,185,129,0.2)',
                        color: item.badge === 'New' ? '#A78BFA' : '#34D399',
                      }}>{item.badge}</span>
                    )}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Credits */}
        <div style={{ margin: '0 8px 8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '12px 14px', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: '#64748B', fontWeight: 500 }}>Credits</span>
            <span style={{ fontSize: 11, color: '#94A3B8' }}>200 / 200</span>
          </div>
          <div style={{ background: '#1E293B', borderRadius: 4, height: 4 }}>
            <div style={{ height: '100%', width: '100%', background: '#2563EB', borderRadius: 4 }} />
          </div>
          <div style={{ fontSize: 10, color: '#475569', marginTop: 6 }}>Free plan</div>
        </div>

        {/* User + Logout */}
        <div style={{ borderTop: '1px solid #1E293B', padding: '12px 14px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,#2563EB,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700 }}>
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#E2E8F0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.email || 'User'}
              </div>
              <div style={{ fontSize: 10, color: '#475569' }}>Free Plan</div>
            </div>
            <button onClick={handleLogout} title="Logout"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', fontSize: 16, padding: 4 }}
              onMouseEnter={e => (e.currentTarget.style.color = '#EF4444')}
              onMouseLeave={e => (e.currentTarget.style.color = '#475569')}>
              ⏻
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header style={{ height: 56, background: '#fff', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', padding: '0 24px', gap: 12, flexShrink: 0 }}>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 13, color: '#94A3B8' }}>cbounce.io</span>
            <span style={{ fontSize: 13, color: '#CBD5E1', margin: '0 6px' }}>/</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', textTransform: 'capitalize' }}>
              {pathname.replace('/', '') || 'dashboard'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '5px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 12 }}>⚡</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>200</span>
              <span style={{ fontSize: 11, color: '#94A3B8' }}>credits</span>
            </div>
          </div>
        </header>
        <main style={{ flex: 1, overflowY: 'auto', background: '#F8FAFC', padding: '28px 32px' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
