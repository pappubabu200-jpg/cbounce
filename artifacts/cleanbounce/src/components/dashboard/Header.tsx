import { useLocation } from "wouter"
import { Bell, ChevronRight, Zap } from "lucide-react"
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
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
  return NAV_LABEL_MAP[clean] ?? NAV_LABEL_MAP["/" + clean.replace(/^\//, "")] ?? capitalize(clean.split("/").filter(Boolean).pop() ?? "Dashboard")
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function Breadcrumb() {
  const [location] = useLocation()
  const label = getPageLabel(location)

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm min-w-0">
      <span className="text-muted-foreground/60 shrink-0 hidden sm:block">cbounce.io</span>
      <ChevronRight className="size-3.5 text-muted-foreground/40 shrink-0 hidden sm:block" />
      <span className="font-semibold text-foreground truncate">{label}</span>
    </nav>
  )
}

function CreditsChip() {
  return (
    <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-1.5">
      <Zap className="size-3.5 text-blue-500 shrink-0" />
      <span className="text-[13px] font-bold text-foreground tabular-nums">200</span>
      <span className="text-[11px] text-muted-foreground">credits</span>
    </div>
  )
}

function NotificationBell() {
  return (
    <Button variant="ghost" size="icon" className="size-9 shrink-0" aria-label="Notifications">
      <Bell className="size-4" />
    </Button>
  )
}

function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-violet-600 text-[12px] font-bold text-white shadow-sm ring-2 ring-transparent hover:ring-blue-500/40 transition-all focus-visible:outline-none focus-visible:ring-blue-500/50"
          aria-label="User menu"
        >
          U
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-sm truncate">user@example.com</span>
            <span className="text-xs font-normal text-muted-foreground">Free Plan</span>
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
        <DropdownMenuItem className="text-red-500 focus:text-red-500 focus:bg-red-500/10">
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function AppHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/95 backdrop-blur-sm px-4">
      <SidebarTrigger className="-ml-1 shrink-0" />
      <Separator orientation="vertical" className="h-4 shrink-0" />
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
