import type React from "react"
import { CompanyDashboardSidebar } from "@/components/company-dashboard-sidebar"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { fetchCompanyProfile } from "@/lib/api"

export default function CompanyDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [approved, setApproved] = useState<boolean | null>(null)

  useEffect(() => {
    const userRaw = typeof window !== 'undefined' ? localStorage.getItem('user') : null
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!userRaw || !token) {
      router.replace('/login')
      return
    }
    try {
      const user = JSON.parse(userRaw)
      if (user.role !== 'company') {
        router.replace('/dashboard/user')
        return
      }
    } catch {
      router.replace('/login')
      return
    }
    // Check approval status via profile
    fetchCompanyProfile()
      .then((data) => {
        if (data?.isApproved === true) setApproved(true)
        else setApproved(false)
      })
      .catch(() => setApproved(false))
  }, [router])

  if (approved === null) {
    return <div className="p-6">Loading...</div>
  }

  if (!approved) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
        <div className="max-w-md text-center bg-white p-8 rounded shadow border">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Awaiting Admin Approval</h2>
          <p className="text-gray-600">Your company account is pending approval. You will gain access once approved.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <CompanyDashboardSidebar />
      <main className="flex-1 bg-gray-50">{children}</main>
    </div>
  )
}
