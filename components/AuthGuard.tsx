"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { UserRole } from "@/lib/types"

export function AuthGuard({ roles, children }: { roles?: UserRole[]; children: React.ReactNode }) {
  const router = useRouter()
  const { token, user } = useAuth()

  useEffect(() => {
    if (!token || !user) {
      router.replace("/login")
      return
    }
    if (roles && user && !roles.includes(user.role as UserRole)) {
      router.replace("/login")
    }
  }, [token, user, roles, router])

  if (!token || !user) return null
  if (roles && user && !roles.includes(user.role as UserRole)) return null

  return <>{children}</>
}