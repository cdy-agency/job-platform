"use client"

import { useEffect, useState } from "react"
import { BaseUser } from "@/lib/types"

const STORAGE_KEY = "auth"

type AuthState = {
  token: string | null
  user: BaseUser | null
}

export function getAuth(): AuthState {
  if (typeof window === "undefined") return { token: null, user: null }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { token: null, user: null }
    return JSON.parse(raw) as AuthState
  } catch {
    return { token: null, user: null }
  }
}

export function setAuth(next: AuthState) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
}

export function clearAuth() {
  if (typeof window === "undefined") return
  localStorage.removeItem(STORAGE_KEY)
}

export function useAuth() {
  const [auth, setAuthState] = useState<AuthState>(() => getAuth())

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setAuthState(getAuth())
      }
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  const login = (token: string, user: BaseUser) => {
    const next = { token, user }
    setAuth(next)
    setAuthState(next)
  }

  const logout = () => {
    clearAuth()
    setAuthState({ token: null, user: null })
  }

  return { ...auth, login, logout }
}