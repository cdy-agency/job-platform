import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { UserDashboardSidebar } from "@/components/user-dashboard-sidebar"
import { useAuth } from "@/context/authContext"

export default function UserDashboardLayout({
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
    if (user.role !== "employee") {
      router.replace("/")
    }
  }, [user, router])

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <UserDashboardSidebar />
      <main className="flex-1 bg-gray-50">{children}</main>
    </div>
  )
}
