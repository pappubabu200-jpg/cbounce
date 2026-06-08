'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const nav = [
  { icon: '▣', label: 'Dashboard', href: '/dashboard' },
  { icon: '✉️', label: 'Verify', href: '/verify' },
  { icon: '📋', label: 'Bulk', href: '/bulk' },
  { icon: '🛡️', label: 'LeadShield', href: '/leadshield' },
  { icon: '📊', label: 'Analytics', href: '/analytics' },
  { icon: '🔑', label: 'API Keys', href: '/api-keys' },
  { icon: '💳', label: 'Billing', href: '/billing' },
  { icon: '⚙️', label: 'Settings', href: '/settings' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <aside style={{ width: 220, background: '#0F172A', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '20px 16px', borderBottom: '1px solid #1E293B' }}>
          <span style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>⚡ cbounce.io</span>
        </div>
        <nav style={{ flex: 1, paddingTop: 8 }}>
          {nav.map(item => (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 16px', textDecoration: 'none',
              background: pathname === item.href ? 'rgba(37,99,235,0.2)' : 'transparent',
              borderLeft: pathname === item.href ? '2px solid #2563EB' : '2px solid transparent',
            }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <span style={{ fontSize: 13, color: pathname === item.href ? '#E2E8F0' : '#94A3B8', fontWeight: pathname === item.href ? 600 : 400 }}>
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
        <div style={{ padding: '12px 16px', borderTop: '1px solid #1E293B' }}>
          <span style={{ fontSize: 12, color: '#475569' }}>Free Plan • 200 credits</span>
        </div>
      </aside>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header style={{ height: 56, background: '#fff', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', padding: '0 24px', justifyContent: 'space-between', flexShrink: 0 }}>
          <span style={{ fontSize: 13, color: '#64748B' }}>
            cbounce.io / <strong style={{ color: '#0F172A' }}>{pathname.replace('/', '')}</strong>
          </span>
          <div style={{ background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: 8, padding: '5px 14px', fontSize: 13, fontWeight: 600 }}>
            ⚡ 200 credits
          </div>
        </header>
        <main style={{ flex: 1, overflowY: 'auto', background: '#F8FAFC', padding: '28px 32px' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
