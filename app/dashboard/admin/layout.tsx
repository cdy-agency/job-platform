import type React from "react"
import { AdminDashboardSidebar } from "@/components/admin-dashboard"

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AdminDashboardSidebar />
      <main className="flex-1 bg-gray-50">{children}</main>
    </div>
  )
}
