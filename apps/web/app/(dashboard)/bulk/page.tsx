'use client'
import { useState, useRef } from 'react'

type Result = {
  email: string
  status: string
  score: number
  mx_valid: boolean
  is_disposable: boolean
  is_role_account: boolean
}

const statusColors: Record<string, { bg: string; color: string; icon: string }> = {
  valid:      { bg: '#DCFCE7', color: '#166534', icon: '✅' },
  invalid:    { bg: '#FEE2E2', color: '#991B1B', icon: '❌' },
  risky:      { bg: '#FEF3C7', color: '#92400E', icon: '⚠️' },
  disposable: { bg: '#FEE2E2', color: '#991B1B', icon: '🚫' },
  unknown:    { bg: '#F1F5F9', color: '#475569', icon: '❓' },
}

function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((a, b) => a + b.value, 0)
  if (total === 0) return null
  let cumulative = 0
  const radius = 60
  const cx = 80, cy = 80
  const circumference = 2 * Math.PI * radius
  return (
    <svg width="160" height="160" viewBox="0 0 160 160">
      {data.map((item, i) => {
        const pct = item.value / total
        const rotation = (cumulative / total) * 360 - 90
        cumulative += item.value
        return (
          <circle key={i} cx={cx} cy={cy} r={radius}
            fill="none" stroke={item.color} strokeWidth="20"
            strokeDasharray={`${circumference * pct} ${circumference * (1 - pct)}`}
            strokeDashoffset={0}
            transform={`rotate(${rotation} ${cx} ${cy})`}
            style={{ transition: 'all 0.5s' }}
          />
        )
      })}
      <text x={cx} y={cy - 8} textAnchor="middle" fontSize="22" fontWeight="800" fill="#0F172A">{total}</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize="11" fill="#94A3B8">emails</text>
    </svg>
  )
}

function BarChart({ data }: { data: { label: string; value: number; color: string; total: number }[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {data.map((item, i) => (
        <div key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{item.label}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: item.color }}>{item.value} ({item.total > 0 ? Math.round((item.value / item.total) * 100) : 0}%)</span>
          </div>
          <div style={{ background: '#F1F5F9', borderRadius: 6, height: 8, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${item.total > 0 ? (item.value / item.total) * 100 : 0}%`, background: item.color, borderRadius: 6, transition: 'width 0.8s ease' }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function BulkVerifyPage() {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<'idle' | 'processing' | 'complete'>('idle')
  const [results, setResults] = useState<Result[]>([])
  const [progress, setProgress] = useState(0)
  const [dragOver, setDragOver] = useState(false)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'results' | 'charts'>('results')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (f: File) => {
    if (f.name.endsWith('.csv') || f.type === 'text/csv') {
      setFile(f); setResults([]); setStatus('idle')
    } else alert('CSV file only!')
  }

  const handleVerify = async () => {
    if (!file) return
    setStatus('processing'); setProgress(0); setResults([])
    const text = await file.text()
    const emails = text.split('\n')
      .map(l => l.split(',')[0].trim().replace(/"/g, ''))
      .filter(e => e.includes('@') && e.includes('.'))
      .slice(0, 1000)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    const verified: Result[] = []
    for (let i = 0; i < emails.length; i++) {
      try {
        const res = await fetch(`${apiUrl}/v1/verify/single/free`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emails[i] }),
        })
        const data = await res.json()
        if (data.success) verified.push(data.data)
        else verified.push({ email: emails[i], status: 'unknown', score: 0, mx_valid: false, is_disposable: false, is_role_account: false })
      } catch {
        verified.push({ email: emails[i], status: 'unknown', score: 0, mx_valid: false, is_disposable: false, is_role_account: false })
      }
      setProgress(Math.round(((i + 1) / emails.length) * 100))
      setResults([...verified])
    }
    setStatus('complete')
  }

  const summary = {
    total: results.length,
    valid: results.filter(r => r.status === 'valid').length,
    invalid: results.filter(r => r.status === 'invalid').length,
    risky: results.filter(r => r.status === 'risky').length,
    disposable: results.filter(r => r.status === 'disposable').length,
    unknown: results.filter(r => r.status === 'unknown').length,
  }

  const bounceRate = summary.total > 0 ? Math.round(((summary.invalid + summary.disposable + summary.risky) / summary.total) * 100) : 0
  const deliverabilityScore = 100 - bounceRate
  const filtered = results.filter(r => (filter === 'all' || r.status === filter) && r.email.toLowerCase().includes(search.toLowerCase()))

  const downloadCSV = (type: 'all' | 'valid' | 'invalid') => {
    const data = type === 'all' ? results : results.filter(r => type === 'valid' ? r.status === 'valid' : r.status !== 'valid')
    const header = 'email,status,score,mx_valid,is_disposable,is_role_account'
    const rows = data.map(r => `${r.email},${r.status},${r.score},${r.mx_valid},${r.is_disposable},${r.is_role_account}`)
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `cbounce_${type}.csv`
    a.click()
  }

  const donutData = [
    { label: 'Valid', value: summary.valid, color: '#10B981' },
    { label: 'Invalid', value: summary.invalid, color: '#EF4444' },
    { label: 'Risky', value: summary.risky, color: '#F59E0B' },
    { label: 'Disposable', value: summary.disposable, color: '#8B5CF6' },
    { label: 'Unknown', value: summary.unknown, color: '#94A3B8' },
  ]

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 800 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', margin: '0 0 4px' }}>📋 Bulk Email Verification</h1>
        <p style={{ color: '#64748B', fontSize: 14, margin: 0 }}>Upload CSV → Verify → Download clean list</p>
      </div>

      {status === 'idle' && (
        <>
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
            onClick={() => fileRef.current?.click()}
            style={{ background: dragOver ? '#EFF6FF' : '#fff', border: `2px dashed ${dragOver ? '#2563EB' : file ? '#10B981' : '#E2E8F0'}`, borderRadius: 14, padding: '36px 24px', textAlign: 'center', cursor: 'pointer', marginBottom: 16 }}>
            <input ref={fileRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
            <div style={{ fontSize: 44, marginBottom: 12 }}>{file ? '✅' : '📁'}</div>
            {file ? (
              <><div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>{file.name}</div><div style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>{(file.size / 1024).toFixed(1)} KB</div></>
            ) : (
              <><div style={{ fontSize: 15, fontWeight: 600, color: '#374151' }}>Drop CSV here or click to browse</div><div style={{ fontSize: 13, color: '#94A3B8', marginTop: 6 }}>Up to 1,000 emails</div></>
            )}
          </div>
          {file && <button onClick={handleVerify} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg,#2563EB,#1D4ED8)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginBottom: 20 }}>🚀 Start Bulk Verification</button>}
        </>
      )}

      {status === 'processing' && (
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, padding: 24, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>⏳ Verifying...</span>
            <span style={{ fontSize: 20, fontWeight: 800, color: '#2563EB' }}>{progress}%</span>
          </div>
          <div style={{ background: '#F1F5F9', borderRadius: 8, height: 10, overflow: 'hidden', marginBottom: 12 }}>
            <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg,#2563EB,#0EA5E9)', borderRadius: 8, transition: 'width 0.3s' }} />
          </div>
          <div style={{ fontSize: 12, color: '#94A3B8' }}>✅ {summary.valid} valid • ❌ {summary.invalid} invalid • ⚠️ {summary.risky} risky</div>
        </div>
      )}

      {results.length > 0 && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 16 }}>
            {[
              { label: 'Total', value: summary.total, icon: '📧', color: '#2563EB', bg: '#EFF6FF' },
              { label: 'Deliverability', value: `${deliverabilityScore}%`, icon: '📈', color: '#10B981', bg: '#F0FDF4' },
              { label: 'Bounce Rate', value: `${bounceRate}%`, icon: '📉', color: bounceRate > 5 ? '#EF4444' : '#10B981', bg: bounceRate > 5 ? '#FEF2F2' : '#F0FDF4' },
            ].map(s => (
              <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ background: bounceRate > 5 ? '#FEF2F2' : '#F0FDF4', border: `1px solid ${bounceRate > 5 ? '#FECACA' : '#BBF7D0'}`, borderRadius: 12, padding: '14px 18px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 24 }}>{bounceRate > 10 ? '🔴' : bounceRate > 5 ? '🟡' : '🟢'}</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>Bounce Forecaster™ — {bounceRate > 10 ? 'High Risk' : bounceRate > 5 ? 'Moderate Risk' : 'Safe to Send'}</div>
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{bounceRate > 5 ? `⚠️ Remove ${summary.invalid + summary.disposable} risky emails before sending.` : `✅ Your list looks clean and safe to send!`}</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
            <button onClick={() => downloadCSV('all')} style={{ flex: 1, padding: '10px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>⬇️ All ({summary.total})</button>
            <button onClick={() => downloadCSV('valid')} style={{ flex: 1, padding: '10px', background: '#10B981', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>✅ Valid ({summary.valid})</button>
            <button onClick={() => downloadCSV('invalid')} style={{ flex: 1, padding: '10px', background: '#F1F5F9', color: '#374151', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>❌ Risky ({summary.invalid + summary.risky + summary.disposable})</button>
          </div>

          <div style={{ display: 'flex', background: '#F1F5F9', borderRadius: 10, padding: 3, gap: 2, marginBottom: 16 }}>
            {[{ key: 'results', label: '📋 Results' }, { key: 'charts', label: '📊 Analytics' }].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key as any)} style={{ flex: 1, padding: '8px', background: activeTab === tab.key ? '#fff' : 'transparent', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: activeTab === tab.key ? 700 : 400, color: activeTab === tab.key ? '#0F172A' : '#64748B', cursor: 'pointer' }}>{tab.label}</button>
            ))}
          </div>

          {activeTab === 'results' && (
            <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid #F1F5F9', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search..." style={{ flex: 1, minWidth: 140, padding: '7px 12px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, outline: 'none' }} />
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {['all', 'valid', 'invalid', 'risky', 'disposable'].map(f => (
                    <button key={f} onClick={() => setFilter(f)} style={{ padding: '5px 10px', background: filter === f ? '#2563EB' : '#F1F5F9', color: filter === f ? '#fff' : '#64748B', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>{f}</button>
                  ))}
                </div>
              </div>
              <div style={{ maxHeight: 380, overflowY: 'auto' }}>
                {filtered.slice(0, 200).map((r, i) => {
                  const sc = statusColors[r.status] || statusColors.unknown
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '10px 16px', borderBottom: '1px solid #F8FAFC', gap: 10 }}>
                      <span style={{ fontSize: 14 }}>{sc.icon}</span>
                      <span style={{ flex: 1, fontSize: 13, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.email}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: sc.bg, color: sc.color }}>{r.status}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', minWidth: 24, textAlign: 'right' }}>{r.score}</span>
                    </div>
                  )
                })}
              </div>
              <div style={{ padding: '10px 16px', borderTop: '1px solid #F1F5F9', fontSize: 12, color: '#94A3B8' }}>Showing {Math.min(filtered.length, 200)} of {filtered.length}</div>
            </div>
          )}

          {activeTab === 'charts' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 16 }}>📊 Distribution</div>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}><DonutChart data={donutData} /></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {donutData.filter(d => d.value > 0).map(d => (
                    <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: d.color }} />
                      <span style={{ fontSize: 12, color: '#374151', flex: 1 }}>{d.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#374151' }}>{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 16 }}>📈 Breakdown</div>
                <BarChart data={[
                  { label: '✅ Valid', value: summary.valid, color: '#10B981', total: summary.total },
                  { label: '❌ Invalid', value: summary.invalid, color: '#EF4444', total: summary.total },
                  { label: '⚠️ Risky', value: summary.risky, color: '#F59E0B', total: summary.total },
                  { label: '🚫 Disposable', value: summary.disposable, color: '#8B5CF6', total: summary.total },
                  { label: '❓ Unknown', value: summary.unknown, color: '#94A3B8', total: summary.total },
                ]} />
                <div style={{ marginTop: 20, padding: 14, background: '#F8FAFC', borderRadius: 10, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>List Health Score</div>
                  <div style={{ fontSize: 36, fontWeight: 800, color: deliverabilityScore >= 80 ? '#10B981' : deliverabilityScore >= 60 ? '#F59E0B' : '#EF4444' }}>{deliverabilityScore}</div>
                  <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{deliverabilityScore >= 80 ? '🟢 Excellent' : deliverabilityScore >= 60 ? '🟡 Needs Cleaning' : '🔴 Poor Quality'}</div>
                </div>
              </div>
            </div>
          )}

          {status === 'complete' && (
            <button onClick={() => { setFile(null); setResults([]); setStatus('idle'); setProgress(0) }} style={{ width: '100%', marginTop: 16, padding: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 14, fontWeight: 600, color: '#374151', cursor: 'pointer' }}>🔄 Verify Another List</button>
          )}
        </>
      )}
    </div>
  )
}
