'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push('/login')
      else { setUser(data.user); setLoading(false) }
    })
  }, [])

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#F8FAFC' }}>
      <div style={{ fontSize: 14, color: '#64748B' }}>Loading...</div>
    </div>
  )

  const stats = [
    { label: 'Emails Verified', value: '0', icon: '✉️', color: '#DBEAFE', text: '#1E40AF' },
    { label: 'Credits Left', value: '200', icon: '⚡', color: '#DCFCE7', text: '#166534' },
    { label: 'Leads Blocked', value: '0', icon: '🛡️', color: '#EDE9FE', text: '#5B21B6' },
    { label: 'Lists Verified', value: '0', icon: '📋', color: '#FEF3C7', text: '#92400E' },
  ]

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', margin: '0 0 4px' }}>
          Welcome back! 👋
        </h1>
        <p style={{ color: '#64748B', fontSize: 14, margin: 0 }}>
          {user?.email} — Free Plan
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
        {stats.map(stat => (
          <div key={stat.label} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, padding: '20px 24px' }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>{stat.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>{stat.value}</div>
            <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 6, fontWeight: 500 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, padding: 24, marginBottom: 20 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#0F172A' }}>
          ⚡ Quick Actions
        </h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[
            { label: '✉️ Verify Email', href: '/verify', bg: '#2563EB', color: '#fff' },
            { label: '📋 Bulk Verify', href: '/bulk', bg: '#F1F5F9', color: '#374151' },
            { label: '🛡️ LeadShield™', href: '/leadshield', bg: '#F1F5F9', color: '#374151' },
            { label: '🔑 API Keys', href: '/apikeys', bg: '#F1F5F9', color: '#374151' },
          ].map(action => (
            <a key={action.label} href={action.href} style={{
              padding: '10px 20px', background: action.bg, color: action.color,
              borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600,
              border: '1px solid #E2E8F0',
            }}>
              {action.label}
            </a>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, padding: 24 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#0F172A' }}>
          📊 Recent Activity
        </h3>
        <div style={{ textAlign: 'center', padding: '32px 0', color: '#94A3B8' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
          <div style={{ fontSize: 14, fontWeight: 500 }}>No verifications yet</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>Start by verifying your first email!</div>
          <a href="/verify" style={{ display: 'inline-block', marginTop: 16, padding: '10px 24px', background: '#2563EB', color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
            Verify First Email →
          </a>
        </div>
      </div>
    </div>
  )
}
