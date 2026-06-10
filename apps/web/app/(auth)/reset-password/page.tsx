'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [ready, setReady] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Listen for PASSWORD_RECOVERY event
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true)
      }
    })
    // Also check if session exists (token in URL)
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleReset = async () => {
    if (!password || password !== confirm) {
      setError('Passwords do not match'); return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters'); return
    }
    setLoading(true); setError('')
    const { error } = await supabase.auth.updateUser({ password })
    if (error) { setError(error.message); setLoading(false) }
    else {
      await supabase.auth.signOut()
      router.push('/login?reset=success')
    }
  }

  if (!ready) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
        <div style={{ fontSize: 14, color: '#64748B' }}>Verifying reset token...</div>
        <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 8 }}>
          If this takes too long, <a href="/forgot-password" style={{ color: '#2563EB' }}>request a new link</a>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
      <div style={{ background: '#fff', padding: '40px', borderRadius: '16px', border: '1px solid #E2E8F0', width: '100%', maxWidth: '400px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>🔑</div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A', margin: '0 0 4px' }}>Set New Password</h1>
          <p style={{ color: '#64748B', fontSize: '14px', margin: 0 }}>Choose a strong password</p>
        </div>
        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '12px', marginBottom: '16px', color: '#DC2626', fontSize: '13px' }}>
            ❌ {error}
          </div>
        )}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>New Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Min 8 characters"
            style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Confirm Password</label>
          <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleReset()}
            placeholder="Repeat password"
            style={{ width: '100%', padding: '10px 14px', border: `1px solid ${confirm && confirm !== password ? '#FECACA' : '#E2E8F0'}`, borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          {confirm && confirm !== password && (
            <div style={{ fontSize: 12, color: '#EF4444', marginTop: 4 }}>❌ Passwords don't match</div>
          )}
          {confirm && confirm === password && (
            <div style={{ fontSize: 12, color: '#10B981', marginTop: 4 }}>✅ Passwords match</div>
          )}
        </div>
        <button onClick={handleReset} disabled={loading || !password || password !== confirm}
          style={{ width: '100%', padding: '12px', background: loading ? '#93C5FD' : '#2563EB', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? '⏳ Updating...' : '🔑 Update Password'}
        </button>
      </div>
    </div>
  )
}
