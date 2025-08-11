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
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      router.replace("/login")
      return
    }
    if (user.role !== "company") {
      router.replace("/")
      return
    }
    const companyUser = user as any
    if (companyUser.isApproved === false) {
      // redirect to profile/notice if not approved
      router.replace("/dashboard/company/profile")
    }
  }, [user, router])

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <CompanyDashboardSidebar />
      <main className="flex-1 bg-gray-50">{children}</main>
    </div>
  )
}
