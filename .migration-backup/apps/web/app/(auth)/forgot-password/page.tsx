'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  const handleReset = async () => {
    if (!email) return
    setLoading(true); setError('')
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/reset-password`,
    })
    if (error) { setError(error.message); setLoading(false) }
    else { setSent(true); setLoading(false) }
  }

  if (sent) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
      <div style={{ background: '#fff', padding: '40px', borderRadius: '16px', border: '1px solid #E2E8F0', textAlign: 'center', maxWidth: '400px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📧</div>
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0F172A', margin: '0 0 8px' }}>Check your email!</h2>
        <p style={{ color: '#64748B', fontSize: '14px', marginBottom: 20 }}>
          Password reset link sent to <strong>{email}</strong>
        </p>
        <a href="/login" style={{ display: 'inline-block', padding: '10px 24px', background: '#2563EB', color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
          Back to Login
        </a>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
      <div style={{ background: '#fff', padding: '40px', borderRadius: '16px', border: '1px solid #E2E8F0', width: '100%', maxWidth: '400px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>🔐</div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A', margin: '0 0 4px' }}>Forgot Password?</h1>
          <p style={{ color: '#64748B', fontSize: '14px', margin: 0 }}>Enter your email — we'll send a reset link</p>
        </div>
        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '12px', marginBottom: '16px', color: '#DC2626', fontSize: '13px' }}>
            ❌ {error}
          </div>
        )}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Email Address</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleReset()}
            placeholder="you@company.com"
            style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <button onClick={handleReset} disabled={loading || !email}
          style={{ width: '100%', padding: '12px', background: loading ? '#93C5FD' : '#2563EB', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? '⏳ Sending...' : '📧 Send Reset Link'}
        </button>
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#64748B' }}>
          Remember password? <a href="/login" style={{ color: '#2563EB', fontWeight: '600', textDecoration: 'none' }}>Sign in</a>
        </p>
      </div>
    </div>
  )
}
