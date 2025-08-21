import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Resolve image-like values coming from API (string URL or { url } object)
export function getImage(input: unknown): string | undefined {
  if (!input) return undefined
  if (typeof input === 'string') return input || undefined
  if (typeof input === 'object' && input !== null) {
    const anyVal = input as any
    if (typeof anyVal.url === 'string' && anyVal.url) return anyVal.url
    // Some backends may store logo/profileImage under different nesting
    if (typeof anyVal.logo?.url === 'string') return anyVal.logo.url
    if (typeof anyVal.profileImage?.url === 'string') return anyVal.profileImage.url
  }
  return undefined
}

// Format a deadline like: Thu, Aug 21 • 1d 3h left | Closed 2d ago
export function formatDeadline(deadlineIso?: string): string {
  if (!deadlineIso) return '—'
  const deadline = new Date(deadlineIso)
  if (isNaN(deadline.getTime())) return '—'

  const now = new Date()
  const weekday = deadline.toLocaleDateString(undefined, { weekday: 'short' })
  const monthDay = deadline.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  const datePart = `${weekday}, ${monthDay}`

  const diffMs = deadline.getTime() - now.getTime()
  const absMs = Math.abs(diffMs)
  const days = Math.floor(absMs / (24 * 60 * 60 * 1000))
  const hours = Math.floor((absMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))

  if (diffMs >= 0) {
    if (days === 0 && hours === 0) return `${datePart} • <1h left`
    return `${datePart} • ${days}d ${hours}h left`
  }
  // already closed
  if (days === 0 && hours === 0) return `${datePart} • Closed just now`
  return `${datePart} • Closed ${days}d ${hours}h ago`
}
