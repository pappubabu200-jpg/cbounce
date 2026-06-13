export interface DashboardNavItem {
  label: string
  href: string
  icon: string
  badge?: string
  badgeVariant?: 'live' | 'new'
}

export interface DashboardNavGroup {
  section: string | null
  items: DashboardNavItem[]
}

export const DASHBOARD_NAV: DashboardNavGroup[] = [
  {
    section: null,
    items: [
      { icon: 'LayoutDashboard', label: 'Dashboard', href: '/dashboard' },
    ],
  },
  {
    section: 'Verification',
    items: [
      { icon: 'Mail', label: 'Single Verify', href: '/verify' },
      { icon: 'Layers', label: 'Bulk Verify', href: '/bulk' },
      { icon: 'History', label: 'History', href: '/history' },
    ],
  },
  {
    section: 'Protection',
    items: [
      { icon: 'ShieldCheck', label: 'LeadShield™', href: '/leadshield', badge: 'Live', badgeVariant: 'live' },
      { icon: 'TrendingDown', label: 'Bounce Forecaster', href: '/forecaster', badge: 'New', badgeVariant: 'new' },
      { icon: 'HeartPulse', label: 'Domain Health', href: '/domain', badge: 'New', badgeVariant: 'new' },
    ],
  },
  {
    section: 'Insights',
    items: [
      { icon: 'BarChart3', label: 'Analytics', href: '/analytics' },
    ],
  },
  {
    section: 'Developer',
    items: [
      { icon: 'Key', label: 'API Keys', href: '/apikeys' },
      { icon: 'Webhook', label: 'Webhooks', href: '/webhooks' },
    ],
  },
  {
    section: 'Account',
    items: [
      { icon: 'CreditCard', label: 'Billing', href: '/billing' },
      { icon: 'Users', label: 'Team', href: '/team' },
      { icon: 'Settings', label: 'Settings', href: '/settings' },
    ],
  },
]

export const NAV_LABEL_MAP: Record<string, string> = Object.fromEntries(
  DASHBOARD_NAV.flatMap(g => g.items.map(i => [i.href, i.label]))
)
