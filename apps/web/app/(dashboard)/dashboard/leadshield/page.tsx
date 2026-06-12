'use client'
import { useState } from 'react'

function MiniDonut({ blocked, passed }: { blocked: number; passed: number }) {
  const total = blocked + passed
  if (total === 0) return <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#94A3B8' }}>No data</div>
  const r = 30, cx = 40, cy = 40
  const circ = 2 * Math.PI * r
  const blockedPct = blocked / total
  return (
    <svg width="80" height="80" viewBox="0 0 80 80">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#DCFCE7" strokeWidth="12" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#EF4444" strokeWidth="12"
        strokeDasharray={`${circ * blockedPct} ${circ * (1 - blockedPct)}`}
        strokeDashoffset={circ * 0.25} strokeLinecap="round" />
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize="11" fontWeight="800" fill="#0F172A">
        {total > 0 ? Math.round(blockedPct * 100) : 0}%
      </text>
    </svg>
  )
}

function BlockRateBar({ value, label, color, total }: { value: number; label: string; color: string; total: number }) {
  const pct = total > 0 ? (value / total) * 100 : 0
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color }}>{value} ({Math.round(pct)}%)</span>
      </div>
      <div style={{ background: '#F1F5F9', borderRadius: 6, height: 7, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 6, transition: 'width 0.8s ease' }} />
      </div>
    </div>
  )
}

export default function LeadShieldPage() {
  const [threshold, setThreshold] = useState(70)
  const [blockDisposable, setBlockDisposable] = useState(true)
  const [blockRole, setBlockRole] = useState(false)
  const [testEmail, setTestEmail] = useState('')
  const [testResult, setTestResult] = useState<any>(null)
  const [testing, setTesting] = useState(false)
  const [saved, setSaved] = useState(false)
  const [sessionStats, setSessionStats] = useState({ blocked: 0, passed: 0, disposable: 0, role: 0, lowScore: 0 })

  const widgetKey = 'ls_' + Math.random().toString(36).slice(2, 10)

  const handleTest = async () => {
    if (!testEmail) return
    setTesting(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const res = await fetch(`${apiUrl}/v1/verify/single/free`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail }),
      })
      const data = await res.json()
      if (data.success) {
        const r = data.data
        const blockedByDisposable = blockDisposable && r.is_disposable
        const blockedByRole = blockRole && r.is_role_account
        const blockedByScore = r.score < (100 - threshold)
        const blocked = blockedByDisposable || blockedByRole || blockedByScore
        setTestResult({ ...r, blocked, blockedByDisposable, blockedByRole, blockedByScore })
        setSessionStats(prev => ({
          blocked: prev.blocked + (blocked ? 1 : 0),
          passed: prev.passed + (blocked ? 0 : 1),
          disposable: prev.disposable + (blockedByDisposable ? 1 : 0),
          role: prev.role + (blockedByRole ? 1 : 0),
          lowScore: prev.lowScore + (blockedByScore && !blockedByDisposable && !blockedByRole ? 1 : 0),
        }))
      }
    } catch { setTestResult({ error: true }) }
    setTesting(false)
  }

  const total = sessionStats.blocked + sessionStats.passed

  const snippetCode = `<script>
  window.cbounceConfig = {
    widgetKey: "YOUR_WIDGET_KEY",
    riskThreshold: ${threshold},
    blockDisposable: ${blockDisposable},
    blockRoleAccounts: ${blockRole},
    onBlock: (email, score) => {
      // Your custom logic here
    }
  };
</script>
<script src="https://cdn.cbounce.io/leadshield.js" async></script>`

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 760 }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', margin: 0 }}>🛡️ LeadShield™</h1>
          <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: '#DCFCE7', color: '#166534', letterSpacing: 0.5 }}>LIVE</span>
        </div>
        <p style={{ color: '#64748B', fontSize: 14, margin: 0 }}>Real-time form protection — block risky leads instantly</p>
      </div>

      {/* Stats + Chart row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>

        {/* Left: stat cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { label: 'Leads Blocked', value: sessionStats.blocked, icon: '🛡️', color: '#EF4444', bg: '#FEF2F2' },
            { label: 'Leads Passed', value: sessionStats.passed, icon: '✅', color: '#10B981', bg: '#F0FDF4' },
            { label: 'Total Checked', value: total, icon: '📊', color: '#2563EB', bg: '#EFF6FF' },
          ].map(s => (
            <div key={s.label} style={{ background: s.bg, borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 20 }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11, color: '#64748B' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: donut + block breakdown */}
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, padding: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 }}>Block Analysis</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <MiniDonut blocked={sessionStats.blocked} passed={sessionStats.passed} />
            <div>
              <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 2 }}>Block Rate</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#EF4444' }}>
                {total > 0 ? Math.round((sessionStats.blocked / total) * 100) : 0}%
              </div>
              <div style={{ fontSize: 11, color: '#64748B' }}>{sessionStats.blocked} of {total} blocked</div>
            </div>
          </div>
          <BlockRateBar label="🚫 Disposable" value={sessionStats.disposable} color="#8B5CF6" total={total} />
          <BlockRateBar label="👤 Role Account" value={sessionStats.role} color="#F59E0B" total={total} />
          <BlockRateBar label="⚠️ Low Score" value={sessionStats.lowScore} color="#EF4444" total={total} />
        </div>
      </div>

      {/* Config */}
      <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, padding: 24, marginBottom: 14 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: '0 0 20px' }}>⚙️ Protection Settings</h3>

        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Risk Threshold</label>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#EF4444' }}>Block if score &lt; {100 - threshold}</span>
          </div>
          <input type="range" min={0} max={100} value={threshold}
            onChange={e => setThreshold(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#2563EB', marginBottom: 6 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94A3B8' }}>
            <span>Lenient</span><span>Strict</span>
          </div>
          {/* Visual threshold indicator */}
          <div style={{ marginTop: 10, display: 'flex', gap: 3 }}>
            {Array.from({ length: 20 }).map((_, i) => {
              const val = (i + 1) * 5
              const blocked = val < (100 - threshold)
              return <div key={i} style={{ flex: 1, height: 6, borderRadius: 2, background: blocked ? '#EF4444' : '#10B981', opacity: 0.7 }} />
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#94A3B8', marginTop: 3 }}>
            <span style={{ color: '#EF4444' }}>❌ Blocked zone</span>
            <span style={{ color: '#10B981' }}>✅ Allowed zone</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
          {[
            { label: 'Block Disposable Emails', desc: 'mailinator, yopmail, tempmail, etc.', value: blockDisposable, set: setBlockDisposable, icon: '🚫' },
            { label: 'Block Role Accounts', desc: 'admin@, info@, support@, noreply@', value: blockRole, set: setBlockRole, icon: '👤' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: '#F8FAFC', borderRadius: 10, border: '1px solid #F1F5F9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: '#94A3B8' }}>{item.desc}</div>
                </div>
              </div>
              <div onClick={() => item.set(!item.value)} style={{ width: 44, height: 24, borderRadius: 12, background: item.value ? '#2563EB' : '#E2E8F0', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
                <div style={{ position: 'absolute', top: 3, left: item.value ? 22 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000) }}
          style={{ width: '100%', padding: '12px', background: saved ? '#10B981' : '#2563EB', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}>
          {saved ? '✅ Settings Saved!' : '💾 Save Settings'}
        </button>
      </div>

      {/* Test */}
      <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, padding: 24, marginBottom: 14 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: '0 0 14px' }}>🧪 Test Protection</h3>

        <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
          <input value={testEmail} onChange={e => setTestEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleTest()}
            placeholder="Enter any email to test..."
            style={{ flex: 1, padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14, outline: 'none' }} />
          <button onClick={handleTest} disabled={testing || !testEmail}
            style={{ padding: '10px 20px', background: testing ? '#93C5FD' : '#7C3AED', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            {testing ? '⏳' : '🧪 Test'}
          </button>
        </div>

        {/* Quick test emails */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
          {['user@gmail.com', 'fake@mailinator.com', 'admin@company.com', 'test@yopmail.com'].map(e => (
            <button key={e} onClick={() => setTestEmail(e)}
              style={{ padding: '4px 10px', background: '#F1F5F9', border: 'none', borderRadius: 20, fontSize: 11, color: '#64748B', cursor: 'pointer' }}>
              {e}
            </button>
          ))}
        </div>

        {testResult && !testResult.error && (
          <div style={{ padding: '16px', background: testResult.blocked ? '#FEF2F2' : '#F0FDF4', border: `1px solid ${testResult.blocked ? '#FECACA' : '#BBF7D0'}`, borderRadius: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: testResult.blocked ? '#FEE2E2' : '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                {testResult.blocked ? '🛡️' : '✅'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: testResult.blocked ? '#991B1B' : '#166534' }}>
                  {testResult.blocked ? 'Lead BLOCKED' : 'Lead PASSED'}
                </div>
                <div style={{ fontSize: 12, color: '#64748B' }}>{testEmail}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: testResult.blocked ? '#EF4444' : '#10B981' }}>{testResult.score}</div>
                <div style={{ fontSize: 10, color: '#94A3B8' }}>Score</div>
              </div>
            </div>

            {/* Score bar */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ background: '#E2E8F0', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${testResult.score}%`, background: testResult.score >= 80 ? '#10B981' : testResult.score >= 50 ? '#F59E0B' : '#EF4444', borderRadius: 4, transition: 'width 0.8s' }} />
              </div>
            </div>

            {/* Blocked reasons */}
            {testResult.blocked && (
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', marginBottom: 6, textTransform: 'uppercase' }}>Blocked because:</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {testResult.blockedByDisposable && <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: '#FEE2E2', color: '#991B1B', fontWeight: 600 }}>🚫 Disposable email</span>}
                  {testResult.blockedByRole && <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: '#FEF3C7', color: '#92400E', fontWeight: 600 }}>👤 Role account</span>}
                  {testResult.blockedByScore && <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: '#FEE2E2', color: '#991B1B', fontWeight: 600 }}>⚠️ Low risk score ({testResult.score})</span>}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {[
                { label: 'MX Valid', value: testResult.mx_valid, ok: testResult.mx_valid },
                { label: 'Disposable', value: testResult.is_disposable, ok: !testResult.is_disposable },
                { label: 'Role Account', value: testResult.is_role_account, ok: !testResult.is_role_account },
              ].map(item => (
                <span key={item.label} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: item.ok ? '#DCFCE7' : '#FEE2E2', color: item.ok ? '#166534' : '#991B1B', fontWeight: 600 }}>
                  {item.label}: {item.value ? 'Yes' : 'No'}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Embed code */}
      <div style={{ background: '#0F172A', borderRadius: 14, padding: 24, marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#F1F5F9', margin: 0 }}>🔌 Embed in Your Form</h3>
          <button onClick={() => navigator.clipboard?.writeText(snippetCode)}
            style={{ padding: '6px 14px', background: 'rgba(255,255,255,0.08)', color: '#94A3B8', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>
            📋 Copy Code
          </button>
        </div>
        <pre style={{ margin: 0, fontSize: 11, color: '#7DD3FC', overflowX: 'auto', lineHeight: 1.7, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
          {snippetCode}
        </pre>
      </div>

      {/* How it works */}
      <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, padding: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: '0 0 16px' }}>📖 How LeadShield™ Works</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { step: '1', title: 'Add JS Snippet', desc: 'Paste before </body> in your website', icon: '📋', color: '#2563EB' },
            { step: '2', title: 'Form Intercepted', desc: 'LeadShield captures email on submit', icon: '⚡', color: '#7C3AED' },
            { step: '3', title: 'Risk Scored', desc: 'MX, disposable, spam check in <100ms', icon: '🔍', color: '#F59E0B' },
            { step: '4', title: 'Block or Allow', desc: 'Bad leads blocked. Good leads pass', icon: '🛡️', color: '#10B981' },
          ].map(item => (
            <div key={item.step} style={{ display: 'flex', gap: 12, padding: '14px', background: '#F8FAFC', borderRadius: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: item.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{item.icon}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{item.title}</div>
                <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
