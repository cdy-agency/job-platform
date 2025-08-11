import type React from "react"
import { CompanyDashboardSidebar } from "@/components/company-dashboard-sidebar"
import { AuthGuard } from "@/components/AuthGuard"

export default function CompanyDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard roles={["company"]}>
      <div className="flex min-h-screen flex-col md:flex-row">
        <CompanyDashboardSidebar />
        <main className="flex-1 bg-gray-50">{children}</main>
      </div>
    </AuthGuard>
  )
}
