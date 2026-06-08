// Protected layout — Sidebar + Topbar. Auth check here.
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-surface">
      {/* <Sidebar /> */}
      <main className="flex-1 overflow-auto">
        {/* <Topbar /> */}
        {children}
      </main>
    </div>
  )
}
