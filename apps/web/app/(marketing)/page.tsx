import Navbar from '@/components/shared/Navbar'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '0 24px' }}>
          <h1 style={{ fontSize: 48, fontWeight: 800, color: '#0F172A', margin: '0 0 16px', letterSpacing: -1.5 }}>
            Email Verification +<br />
            <span style={{ background: 'linear-gradient(90deg,#2563EB,#0EA5E9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              LeadShield™ Protection
            </span>
          </h1>
          <p style={{ fontSize: 18, color: '#64748B', maxWidth: 480, margin: '0 auto 32px' }}>
            Verify emails instantly. Block risky leads. Ship with confidence.
          </p>
          <a href="/signup" style={{ padding: '14px 32px', background: '#2563EB', color: '#fff', borderRadius: 10, textDecoration: 'none', fontSize: 16, fontWeight: 700 }}>
            Start Free — 200 Credits →
          </a>
        </div>
      </main>
    </>
  )
}
