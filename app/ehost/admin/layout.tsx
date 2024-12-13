import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/shared/admin/app-sidebar"
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar /> 
      <main>
        {children}
      </main>
    </SidebarProvider>
  )
}