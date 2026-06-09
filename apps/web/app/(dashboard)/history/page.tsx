'use client'
import { useState, useEffect, useCallback } from 'react'

type HistoryItem = {
  email: string
  status: string
  score: number
  mx_valid: boolean
  is_disposable: boolean
  is_role_account: boolean
  verified_at: string
  deliverability?: string
  reason?: string
  details?: { suggestion?: string }
}

type Stats = {
  total: number
  valid: number
  invalid: number
  risky: number
}

const statusConfig: Record<string, { bg: string; color: string; icon: string }> = {
  valid: { bg: '#DCFCE7', color: '#166534', icon: '✅' },
  invalid: { bg: '#FEE2E2', color: '#991B1B', icon: '❌' },
  risky: { bg: '#FEF3C7', color: '#92400E', icon: '⚠️' },
  disposable: { bg: '#FEE2E2', color: '#991B1B', icon: '🚫' },
  role: { bg: '#FEF3C7', color: '#92400E', icon: '👤' },
  accept_all: { bg: '#DBEAFE', color: '#1E40AF', icon: '🔄' },
  unknown: { bg: '#F1F5F9', color: '#475569', icon: '❓' },
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso)
    if (isNaN(d.getTime())) return '—'
    return d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
  } catch {
    return '—'
  }
}

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState({ total: 0, pages: 1 })
  const [stats, setStats] = useState<Stats>({ total: 0, valid: 0, invalid: 0, risky: 0 })
  const [clearing, setClearing] = useState(false)

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  const fetchHistory = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '20',
        ...(filter !== 'all' ? { status: filter } : {}),
        ...(search ? { search } : {}),
      })
      const res = await fetch(`\( {apiUrl}/v1/history/? \){params}`)
      const data = await res.json()
      if (data.success) {
        setItems(data.data.items || [])
        setMeta(data.data.meta || { total: 0, pages: 1 })
        setStats(data.stats ?? { total: data.data?.meta?.total || 0, valid: 0, invalid: 0, risky: 0 })
      }
    } catch (e) {
      console.error('Failed to fetch history:', e)
    }
    setLoading(false)
  }, [page, filter, search, apiUrl])

  useEffect(() => { fetchHistory() }, [fetchHistory])

  const handleClear = async () => {
    if (!confirm('Clear all history? This cannot be undone.')) return
    setClearing(true)
    try {
      await fetch(`${apiUrl}/v1/history/clear`, { method: 'DELETE' })
      setItems([])
      setMeta({ total: 0, pages: 1 })
      setStats({ total: 0, valid: 0, invalid: 0, risky: 0 })
      setPage(1)
    } catch (e) {
      console.error('Clear failed:', e)
    }
    setClearing(false)
  }

  const downloadCSV = () => {
    if (items.length === 0) {
      alert('No data to export')
      return
    }
    const header = 'email,status,score,mx_valid,is_disposable,is_role_account,verified_at,deliverability,reason'
    const rows = items.map(r =>
      `"\( {r.email}"," \){r.status}",\( {r.score}, \){r.mx_valid},\( {r.is_disposable}, \){r.is_role_account},"\( {r.verified_at}"," \){r.deliverability || ''}","${r.reason || ''}"`
    )
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cbounce_history_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 900, margin: '0 auto', padding: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', margin: '0 0 4px' }}>📁 Verification History</h1>
          <p style={{ color: '#64748B', fontSize: 14, margin: 0 }}>All your past email verifications</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={downloadCSV} disabled={items.length === 0} style={{ padding: '8px 14px', background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 12, fontWeight: 600, color: items.length === 0 ? '#94A3B8' : '#374151', cursor: items.length === 0 ? 'not-allowed' : 'pointer' }}>
            ⬇️ Export
          </button>
          <button onClick={handleClear} disabled={clearing || meta.total === 0} style={{ padding: '8px 14px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, fontSize: 12, fontWeight: 600, color: clearing || meta.total === 0 ? '#FCA5A5' : '#DC2626', cursor: clearing || meta.total === 0 ? 'not-allowed' : 'pointer' }}>
            {clearing ? '⏳ Clearing...' : '🗑️ Clear'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total', value: stats.total, color: '#2563EB', bg: '#EFF6FF' },
          { label: 'Valid', value: stats.valid, color: '#10B981', bg: '#F0FDF4' },
          { label: 'Invalid', value: stats.invalid, color: '#EF4444', bg: '#FEF2F2' },
          { label: 'Risky', value: stats.risky, color: '#F59E0B', bg: '#FFFBEB' },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, borderRadius: 10, padding: '12px 16px' }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #F1F5F9', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input
            value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="🔍 Search emails..."
            style={{ flex: 1, minWidth: 160, padding: '7px 12px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, outline: 'none' }}
          />
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {['all', 'valid', 'invalid', 'risky', 'disposable', 'role'].map(f => (
              <button key={f} onClick={() => { setFilter(f); setPage(1) }}
                style={{ padding: '6px 12px', background: filter === f ? '#2563EB' : '#F1F5F9', color: filter === f ? '#fff' : '#64748B', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize' }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8', fontSize: 14 }}>⏳ Loading...</div>
        ) : items.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#374151', marginBottom: 4 }}>No verification history yet</div>
            <div style={{ fontSize: 13, color: '#94A3B8' }}>Start verifying emails to see history here</div>
            <a href="/verify" style={{ display: 'inline-block', marginTop: 16, padding: '10px 24px', background: '#2563EB', color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
              Verify First Email →
            </a>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <div style={{ minWidth: 650 }}>
              {/* Header row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px 70px 140px 80px', padding: '10px 16px', background: '#F8FAFC', borderBottom: '1px solid #F1F5F9' }}>
                {['Email', 'Status', 'Score', 'Date', 'Flags'].map(h => (
                  <div key={h} style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</div>
                ))}
              </div>

              {items.map((item, i) => {
                const sc = statusConfig[item.status] || statusConfig.unknown
                return (
                  <div key={`\( {item.email}- \){i}`} style={{ display: 'grid', gridTemplateColumns: '1fr 110px 70px 140px 80px', padding: '12px 16px', borderBottom: '1px solid #F8FAFC', alignItems: 'center' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFC')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>

                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 8 }}>
                      <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>{item.email}</span>
                      {item.details?.suggestion && (
                        <span style={{ fontSize: 11, color: '#F59E0B', marginLeft: 6 }}>→ {item.details.suggestion}</span>
                      )}
                    </div>

                    <div>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 20, background: sc.bg, color: sc.color, whiteSpace: 'nowrap' }}>
                        {sc.icon} {item.status}
                      </span>
                    </div>

                    <div style={{ fontSize: 13, fontWeight: 700, color: item.score >= 80 ? '#10B981' : item.score >= 50 ? '#F59E0B' : '#EF4444' }}>
                      {item.score}
                    </div>

                    <div style={{ fontSize: 11, color: '#94A3B8' }}>
                      {formatDate(item.verified_at)}
                    </div>

                    <div style={{ display: 'flex', gap: 4 }}>
                      {item.mx_valid && <span title="MX Valid" style={{ fontSize: 12 }}>✅</span>}
                      {item.is_disposable && <span title="Disposable" style={{ fontSize: 12 }}>🚫</span>}
                      {item.is_role_account && <span title="Role Account" style={{ fontSize: 12 }}>👤</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {meta.pages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, alignItems: 'center' }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            style={{ padding: '8px 16px', background: page === 1 ? '#F1F5F9' : '#2563EB', color: page === 1 ? '#94A3B8' : '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: page === 1 ? 'not-allowed' : 'pointer' }}>
            ← Prev
          </button>
          <span style={{ padding: '8px 16px', fontSize: 13, color: '#64748B' }}>
            Page {page} of {meta.pages}
          </span>
          <button onClick={() => setPage(p => Math.min(meta.pages, p + 1))} disabled={page === meta.pages}
            style={{ padding: '8px 16px', background: page === meta.pages ? '#F1F5F9' : '#2563EB', color: page === meta.pages ? '#94A3B8' : '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: page === meta.pages ? 'not-allowed' : 'pointer' }}>
            Next →
          </button>
        </div>
      )}
    </div>
  )
    }
