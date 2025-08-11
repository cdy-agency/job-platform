import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { CompanyDashboardSidebar } from "@/components/company-dashboard-sidebar"
import { useAuth } from "@/context/authContext"

export default function CompanyDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, isReady } = useAuth()

  useEffect(() => {
    if (!isReady) return
    if (!user) {
      router.replace("/login")
      return
    }
    if (user.role !== "company") {
      router.replace("/")
      return
    }
    // Approval gate can be enforced on specific pages instead of layout to avoid loops
  }, [user, isReady, router])

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <CompanyDashboardSidebar />
      <main className="flex-1 bg-gray-50">{children}</main>
    </div>
  )
}
