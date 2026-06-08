'use client'
import { useState } from 'react'

type VerifyResult = {
  email: string
  status: 'valid' | 'invalid' | 'risky' | 'disposable' | 'unknown'
  score: number
  mx_valid: boolean
  is_disposable: boolean
  is_role_account: boolean
  smtp_response: string
}

const statusConfig = {
  valid:      { label: 'Valid', bg: '#DCFCE7', color: '#166534', icon: '✅' },
  invalid:    { label: 'Invalid', bg: '#FEE2E2', color: '#991B1B', icon: '❌' },
  risky:      { label: 'Risky', bg: '#FEF3C7', color: '#92400E', icon: '⚠️' },
  disposable: { label: 'Disposable', bg: '#FEE2E2', color: '#991B1B', icon: '🚫' },
  unknown:    { label: 'Unknown', bg: '#F1F5F9', color: '#475569', icon: '❓' },
}

export default function VerifyPage() {
  const [email, setEmail] = useState('')
  const [result, setResult] = useState<VerifyResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleVerify = async () => {
    if (!email) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const res = await fetch(`${apiUrl}/v1/verify/single/free`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (data.success) setResult(data.data)
      else setError('Verification failed')
    } catch (e) {
      setError('API connection failed — check NEXT_PUBLIC_API_URL')
    }
    setLoading(false)
  }

  const sc = result ? statusConfig[result.status] : null

  return (
    <div style={{ maxWidth: 600, fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', margin: '0 0 4px' }}>
          ✉️ Single Email Verification
        </h1>
        <p style={{ color: '#64748B', fontSize: 14, margin: 0 }}>
          Instantly verify any email address
        </p>
      </div>

      {/* Input */}
      <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: 20, marginBottom: 16 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
          Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleVerify()}
          placeholder="test@example.com"
          style={{
            width: '100%', padding: '11px 14px',
            border: '1px solid #E2E8F0', borderRadius: 8,
            fontSize: 14, outline: 'none', marginBottom: 12,
            boxSizing: 'border-box',
          }}
        />
        <button
          onClick={handleVerify}
          disabled={loading || !email}
          style={{
            width: '100%', padding: '12px',
            background: loading ? '#93C5FD' : '#2563EB',
            color: '#fff', border: 'none', borderRadius: 8,
            fontSize: 14, fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? '⏳ Verifying...' : '🔍 Verify Email'}
        </button>

        {error && (
          <div style={{ marginTop: 12, padding: '10px 14px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, color: '#DC2626', fontSize: 13 }}>
            ❌ {error}
          </div>
        )}
      </div>

      {/* Result */}
      {result && sc && (
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: sc.bg, borderRadius: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 24 }}>{sc.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: sc.color }}>{sc.label}</div>
              <div style={{ fontSize: 12, color: sc.color, opacity: 0.8 }}>{result.email}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: sc.color }}>{result.score}</div>
              <div style={{ fontSize: 10, color: sc.color, opacity: 0.7 }}>Score</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { label: 'MX Records', value: result.mx_valid ? '✅ Valid' : '❌ Invalid' },
              { label: 'Disposable', value: result.is_disposable ? '⚠️ Yes' : '✅ No' },
              { label: 'Role Account', value: result.is_role_account ? '⚠️ Yes' : '✅ No' },
              { label: 'SMTP', value: result.smtp_response },
            ].map(item => (
              <div key={item.label} style={{ padding: '10px 14px', background: '#F8FAFC', borderRadius: 8 }}>
                <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', marginBottom: 3 }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{item.value}</div>
              </div>
            ))}
          </div>

          <button
            onClick={() => { setResult(null); setEmail('') }}
            style={{ marginTop: 14, width: '100%', padding: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer' }}
          >
            🔄 Verify Another
          </button>
        </div>
      )}

      {!result && !loading && (
        <div style={{ background: '#fff', border: '1px dashed #E2E8F0', borderRadius: 12, padding: '32px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>✉️</div>
          <div style={{ fontSize: 14, color: '#94A3B8' }}>Enter email above and click Verify</div>
        </div>
      )}
    </div>
  )
}
