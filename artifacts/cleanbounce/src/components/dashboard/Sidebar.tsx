import { Link, useLocation } from "wouter"
import * as Icons from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DASHBOARD_NAV } from "@/config/navigation"

function NavIcon({ name }: { name: string }) {
  const Icon = (Icons as Record<string, Icons.LucideIcon>)[name]
  if (!Icon) return null
  return <Icon className="size-4 shrink-0" />
}

function BadgePill({ text, variant }: { text: string; variant?: 'live' | 'new' }) {
  if (variant === 'live') {
    return (
      <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 leading-none">
        <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
        {text}
      </span>
    )
  }
  return (
    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/20 leading-none">
      {text}
    </span>
  )
}

function CreditsWidget() {
  const used = 0
  const total = 200
  const pct = Math.round((used / total) * 100)

  return (
    <div className="mx-2 mb-1 rounded-xl border border-white/[0.06] bg-white/[0.04] p-3.5">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[11px] font-semibold text-slate-400">Credits</span>
        <span className="text-[11px] font-mono text-slate-300">
          {used.toLocaleString()} / {total.toLocaleString()}
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-slate-700/80 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-sky-400"
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(pct, used > 0 ? 2 : 0)}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        />
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-[10px] text-slate-500">Free plan</span>
        <button className="text-[10px] font-semibold text-blue-400 hover:text-blue-300 transition-colors">
          Upgrade →
        </button>
      </div>
    </div>
  )
}

function UserFooter() {
  const { state } = useSidebar()
  const collapsed = state === "collapsed"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 text-[12px] font-bold text-white shadow-sm">
            U
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
                className="min-w-0 flex-1 overflow-hidden"
              >
                <p className="truncate text-[12px] font-semibold text-slate-200 leading-tight">
                  user@example.com
                </p>
                <p className="text-[10px] text-slate-500 leading-tight">Free Plan</p>
              </motion.div>
            )}
          </AnimatePresence>
          {!collapsed && (
            <Icons.ChevronsUpDown className="size-3.5 shrink-0 text-slate-500" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start" className="w-56 mb-1">
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <Icons.Settings className="size-4 mr-2" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/billing">
            <Icons.CreditCard className="size-4 mr-2" />
            Billing
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-400 focus:text-red-400 focus:bg-red-500/10">
          <Icons.LogOut className="size-4 mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function AppSidebar() {
  const [location] = useLocation()

  const isActive = (href: string) => {
    if (href === "/dashboard") return location === "/" || location === "/dashboard"
    return location.startsWith(href)
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border px-3 py-3.5">
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-[9px] bg-gradient-to-br from-blue-600 to-sky-400 text-white shadow-md shadow-blue-500/25">
            <Icons.Zap className="size-4" />
          </div>
          <motion.span
            className="text-[15px] font-extrabold text-slate-100 tracking-tight leading-none truncate"
            layout
          >
            cbounce.io
          </motion.span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="py-2">
        {DASHBOARD_NAV.map((group, gi) => (
          <SidebarGroup key={gi} className="px-2 py-0.5">
            {group.section && (
              <SidebarGroupLabel className="text-[10px] font-bold tracking-widest text-slate-500 uppercase px-2 mb-1">
                {group.section}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const active = isActive(item.href)
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={item.label}
                        className="h-9 gap-2.5 font-medium"
                      >
                        <Link href={item.href}>
                          <NavIcon name={item.icon} />
                          <span className="truncate">{item.label}</span>
                          {item.badge && (
                            <SidebarMenuBadge>
                              <BadgePill text={item.badge} variant={item.badgeVariant} />
                            </SidebarMenuBadge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="pb-2 pt-1 px-2 gap-1">
        <CreditsWidget />
        <UserFooter />
      </SidebarFooter>
    </Sidebar>
  )
}
