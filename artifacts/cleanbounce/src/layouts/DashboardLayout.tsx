import { type ReactNode } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/Sidebar"
import { AppHeader } from "@/components/dashboard/Header"

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true} className="h-svh overflow-hidden">
      <AppSidebar />
      <SidebarInset className="flex flex-col">
        <AppHeader />
        <main className="flex-1 overflow-y-auto bg-background p-6 md:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
