"use client"

import type React from "react"
import { AdminDashboardSidebar } from "@/components/admin-dashboard"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    const userRaw = typeof window !== 'undefined' ? localStorage.getItem('user') : null
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!userRaw || !token) {
      router.replace('/login')
      return
    }
    try {
      const user = JSON.parse(userRaw)
      if (user.role !== 'superadmin') {
        if (user.role === 'company') router.replace('/dashboard/company')
        else router.replace('/dashboard/user')
      }
    } catch {
      router.replace('/login')
    }
  }, [router])

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AdminDashboardSidebar />
      <main className="flex-1 bg-gray-50">{children}</main>
    </div>
  )
}
