'use client'
export default function DashboardPage() {
  return (
    <div style={{ padding: 32 }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', margin: '0 0 24px' }}>
        ⚡ Dashboard
      </h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        {[
          { label: 'Emails Verified', value: '0', icon: '✉️', color: '#DBEAFE' },
          { label: 'Credits Left', value: '200', icon: '⚡', color: '#DCFCE7' },
          { label: 'Leads Blocked', value: '0', icon: '🛡️', color: '#EDE9FE' },
        ].map((stat) => (
          <div key={stat.label} style={{ background: stat.color, borderRadius: 12, padding: 24 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{stat.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#0F172A' }}>{stat.value}</div>
            <div style={{ fontSize: 13, color: '#475569', marginTop: 4 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24, background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: 24 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700 }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: 12 }}>
          <a href="/verify" style={{ padding: '10px 20px', background: '#2563EB', color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>✉️ Verify Email</a>
          <a href="/bulk" style={{ padding: '10px 20px', background: '#F1F5F9', color: '#374151', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>📋 Bulk Verify</a>
        </div>
      </div>
    </div>
  )
}
