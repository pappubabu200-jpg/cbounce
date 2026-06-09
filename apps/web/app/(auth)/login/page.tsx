'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Redirect if already logged in
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.push('/dashboard')
    })
  }, [])

  const handleLogin = async () => {
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false) }
    else router.push('/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
      <div style={{ background: '#fff', padding: '40px', borderRadius: '16px', border: '1px solid #E2E8F0', width: '100%', maxWidth: '400px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>⚡</div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A', margin: '0 0 4px' }}>Welcome back</h1>
          <p style={{ color: '#64748B', fontSize: '14px', margin: 0 }}>Sign in to cbounce.io</p>
        </div>
        {error && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '12px', marginBottom: '16px', color: '#DC2626', fontSize: '13px' }}>{error}</div>}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="you@company.com"
            style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="••••••••" onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <button onClick={handleLogin} disabled={loading}
          style={{ width: '100%', padding: '12px', background: loading ? '#93C5FD' : '#2563EB', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Signing in...' : 'Sign In →'}
        </button>
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#64748B' }}>
          No account? <a href="/signup" style={{ color: '#2563EB', fontWeight: '600', textDecoration: 'none' }}>Sign up free</a>
        </p>
      </div>
    </div>
  )
}
