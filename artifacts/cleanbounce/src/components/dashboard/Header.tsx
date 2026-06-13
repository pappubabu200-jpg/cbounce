import { useLocation } from "wouter"
import { Bell, Zap } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Link } from "wouter"
import { NAV_LABEL_MAP } from "@/config/navigation"

function getPageLabel(pathname: string): string {
  const clean = pathname.replace(/\/$/, "") || "/dashboard"
  return (
    NAV_LABEL_MAP[clean] ??
    NAV_LABEL_MAP["/" + clean.replace(/^\//, "")] ??
    capitalize(clean.split("/").filter(Boolean).pop() ?? "Dashboard")
  )
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function Breadcrumb() {
  const [location] = useLocation()
  const label = getPageLabel(location)

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 min-w-0">
      <span className="text-sm text-slate-400 shrink-0 hidden sm:block">cbounce.io</span>
      <span className="text-sm text-slate-300 shrink-0 hidden sm:block select-none">/</span>
      <span className="text-sm font-semibold text-slate-900 truncate">{label}</span>
    </nav>
  )
}

function CreditsChip() {
  return (
    <div className="hidden sm:flex items-center gap-1.5 rounded-md border border-blue-100 bg-blue-50 px-2.5 py-1.5">
      <div className="flex size-4 items-center justify-center rounded bg-blue-100">
        <Zap className="size-2.5 text-blue-600 shrink-0" />
      </div>
      <span className="text-[13px] font-bold text-blue-700 tabular-nums">200</span>
      <span className="text-[11px] text-blue-500">credits</span>
    </div>
  )
}

function NotificationBell() {
  return (
    <Button
      variant="outline"
      size="icon"
      className="size-8 shrink-0 border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50"
      aria-label="Notifications"
    >
      <Bell className="size-3.5" />
    </Button>
  )
}

function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-violet-600 text-[11px] font-bold text-white shadow-sm ring-2 ring-transparent hover:ring-blue-500/30 transition-all focus-visible:outline-none focus-visible:ring-blue-500/50"
          aria-label="User menu"
        >
          U
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-sm text-slate-900 truncate">user@example.com</span>
            <span className="text-xs font-normal text-slate-400">Free Plan</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/billing">Billing</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50">
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function AppHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-slate-100 bg-white px-4 shadow-[0_1px_0_0_hsl(214_32%_91%)]">
      <SidebarTrigger className="-ml-1 shrink-0 text-slate-500 hover:text-slate-700 hover:bg-slate-50" />
      <Separator orientation="vertical" className="h-4 shrink-0 bg-slate-200" />
      <div className="flex flex-1 items-center gap-3 min-w-0">
        <Breadcrumb />
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <CreditsChip />
        <NotificationBell />
        <UserMenu />
      </div>
    </header>
  )
}
