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
  valid:      { label: 'Valid', bg: '#DCFCE7', color: '#166534', icon: '✅', bar: '#10B981' },
  invalid:    { label: 'Invalid', bg: '#FEE2E2', color: '#991B1B', icon: '❌', bar: '#EF4444' },
  risky:      { label: 'Risky', bg: '#FEF3C7', color: '#92400E', icon: '⚠️', bar: '#F59E0B' },
  disposable: { label: 'Disposable', bg: '#FEE2E2', color: '#991B1B', icon: '🚫', bar: '#EF4444' },
  unknown:    { label: 'Unknown', bg: '#F1F5F9', color: '#475569', icon: '❓', bar: '#94A3B8' },
}

function ScoreGauge({ score, color }: { score: number; color: string }) {
  const r = 54
  const cx = 64, cy = 64
  const circumference = 2 * Math.PI * r
  const arc = (score / 100) * circumference * 0.75
  const offset = circumference * 0.25

  return (
    <svg width="128" height="100" viewBox="0 0 128 100">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F1F5F9" strokeWidth="10"
        strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
        strokeDashoffset={-offset} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="10"
        strokeDasharray={`${arc} ${circumference - arc}`}
        strokeDashoffset={-offset} strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 1s ease' }} />
      <text x={cx} y={cy + 6} textAnchor="middle" fontSize="24" fontWeight="800" fill="#0F172A">{score}</text>
      <text x={cx} y={cy + 22} textAnchor="middle" fontSize="10" fill="#94A3B8">Risk Score</text>
    </svg>
  )
}

function CheckBar({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: ok ? '#F0FDF4' : '#FEF2F2', borderRadius: 8, border: `1px solid ${ok ? '#BBF7D0' : '#FECACA'}` }}>
      <span style={{ fontSize: 16 }}>{ok ? '✅' : '❌'}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginTop: 1 }}>{value}</div>
      </div>
    </div>
  )
}

export default function VerifyPage() {
  const [email, setEmail] = useState('')
  const [result, setResult] = useState<VerifyResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [history, setHistory] = useState<VerifyResult[]>([])

  const handleVerify = async () => {
    if (!email.trim()) return
    setLoading(true); setError(''); setResult(null)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const res = await fetch(`${apiUrl}/v1/verify/single/free`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json()
      if (data.success) {
        setResult(data.data)
        setHistory(prev => [data.data, ...prev].slice(0, 10))
      } else setError('Verification failed')
    } catch { setError('API connection failed') }
    setLoading(false)
  }

  const sc = result ? statusConfig[result.status] : null

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 680 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', margin: '0 0 4px' }}>✉️ Single Email Verification</h1>
        <p style={{ color: '#64748B', fontSize: 14, margin: 0 }}>Instant MX, SMTP, disposable & risk analysis</p>
      </div>

      {/* Input */}
      <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, padding: 24, marginBottom: 20 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Email Address</label>
        <div style={{ display: 'flex', gap: 10 }}>
          <input type="email" value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleVerify()}
            placeholder="name@company.com"
            style={{ flex: 1, padding: '12px 16px', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
          <button onClick={handleVerify} disabled={loading || !email}
            style={{ padding: '12px 24px', background: loading ? '#93C5FD' : 'linear-gradient(135deg,#2563EB,#1D4ED8)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(37,99,235,0.3)' }}>
            {loading ? '⏳ Checking...' : '🔍 Verify'}
          </button>
        </div>
        {error && <div style={{ marginTop: 12, padding: '10px 14px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, color: '#DC2626', fontSize: 13 }}>❌ {error}</div>}
      </div>

      {/* Result */}
      {result && sc && (
        <div style={{ background: '#fff', border: `1px solid ${sc.color}30`, borderRadius: 14, overflow: 'hidden', marginBottom: 20 }}>
          {/* Status banner */}
          <div style={{ background: `linear-gradient(135deg, ${sc.bar}15, ${sc.bar}08)`, padding: '20px 24px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: sc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>{sc.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: sc.color }}>{sc.label}</div>
              <div style={{ fontSize: 14, color: '#64748B', marginTop: 2 }}>{result.email}</div>
            </div>
            <ScoreGauge score={result.score} color={sc.bar} />
          </div>

          {/* Score bar */}
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #F8FAFC' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Deliverability Score</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: sc.color }}>{result.score}/100</span>
            </div>
            <div style={{ background: '#F1F5F9', borderRadius: 6, height: 8, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${result.score}%`, background: `linear-gradient(90deg, ${sc.bar}, ${sc.bar}cc)`, borderRadius: 6, transition: 'width 1s ease' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 10, color: '#CBD5E1' }}>
              <span>0 — Poor</span><span>50 — Average</span><span>100 — Excellent</span>
            </div>
          </div>

          {/* Checks */}
          <div style={{ padding: '16px 24px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 }}>Verification Checks</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <CheckBar label="MX Records" value={result.mx_valid ? 'Valid DNS' : 'No MX found'} ok={result.mx_valid} />
              <CheckBar label="Disposable" value={result.is_disposable ? 'Throwaway email' : 'Not disposable'} ok={!result.is_disposable} />
              <CheckBar label="Role Account" value={result.is_role_account ? 'Role address' : 'Personal email'} ok={!result.is_role_account} />
              <CheckBar label="SMTP Check" value={result.smtp_response || 'Completed'} ok={result.status === 'valid'} />
            </div>
          </div>

          {/* Recommendation */}
          <div style={{ margin: '0 24px 20px', padding: '12px 16px', background: result.score >= 80 ? '#F0FDF4' : result.score >= 50 ? '#FFFBEB' : '#FEF2F2', borderRadius: 10, border: `1px solid ${result.score >= 80 ? '#BBF7D0' : result.score >= 50 ? '#FDE68A' : '#FECACA'}` }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: result.score >= 80 ? '#166534' : result.score >= 50 ? '#92400E' : '#991B1B' }}>
              {result.score >= 80 ? '✅ Safe to use — High deliverability expected' :
               result.score >= 50 ? '⚠️ Use with caution — Some risk detected' :
               '❌ Do not use — High risk of bounce or spam'}
            </div>
          </div>

          <div style={{ padding: '0 24px 20px' }}>
            <button onClick={() => { setResult(null); setEmail('') }}
              style={{ width: '100%', padding: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
              🔄 Verify Another
            </button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!result && !loading && (
        <div style={{ background: '#fff', border: '1px dashed #E2E8F0', borderRadius: 14, padding: '40px 24px', textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>✉️</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Enter an email to verify</div>
          <div style={{ fontSize: 13, color: '#94A3B8' }}>Get instant MX, SMTP, risk score & more</div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
            {['test@gmail.com', 'fake@mailinator.com', 'info@company.com'].map(e => (
              <button key={e} onClick={() => setEmail(e)}
                style={{ padding: '6px 14px', background: '#F1F5F9', border: 'none', borderRadius: 20, fontSize: 12, color: '#64748B', cursor: 'pointer' }}>
                {e}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>📋 Recent Verifications</span>
            <button onClick={() => setHistory([])} style={{ fontSize: 12, color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer' }}>Clear</button>
          </div>
          {history.map((r, i) => {
            const s = statusConfig[r.status]
            return (
              <div key={i} onClick={() => { setEmail(r.email); setResult(r) }}
                style={{ display: 'flex', alignItems: 'center', padding: '10px 20px', borderBottom: '1px solid #F8FAFC', gap: 10, cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFC')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <span style={{ fontSize: 16 }}>{s.icon}</span>
                <span style={{ flex: 1, fontSize: 13, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.email}</span>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: s.bg, color: s.color }}>{s.label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8' }}>{r.score}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
