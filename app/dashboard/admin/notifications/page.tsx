"use client"

import { useState } from "react"
import { Bell, CheckCircle } from "lucide-react"

interface NotificationItem {
  id: number
  message: string
  date: string
  read: boolean
}

export default function AdminNotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>([
    { id: 1, message: "New company registered awaiting approval.", date: new Date().toISOString(), read: false },
    { id: 2, message: "Weekly report is ready.", date: new Date(Date.now() - 86400000).toISOString(), read: true },
  ])

  const markAsRead = (id: number) =>
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))

  const unread = items.filter((i) => !i.read).length

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Bell className="h-6 w-6 text-[#834de3]" />
          <h1 className="ml-2 text-lg font-semibold text-gray-900">Notifications</h1>
        </div>
        <span className="rounded-full bg-[#f5f0ff] px-3 py-1 text-xs font-medium text-[#834de3]">{unread} unread</span>
      </div>

      <div className="mx-auto max-w-2xl space-y-3">
        {items.map((n) => (
          <div
            key={n.id}
            onClick={() => (!n.read ? markAsRead(n.id) : undefined)}
            className={`flex cursor-pointer items-start rounded-lg border p-3 transition-all ${
              n.read ? "bg-white border-gray-200" : "bg-[#fbf8ff] border-[#eadbff]"
            }`}
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#834de3] to-[#9260e7] text-white">
              <Bell className="h-5 w-5" />
            </div>
            <div className="ml-3 flex-1">
              <div className="flex items-center justify-between">
                <p className={`text-sm font-medium ${n.read ? "text-gray-900" : "text-gray-800"}`}>{n.message}</p>
                <span className={`text-xs ${n.read ? "text-gray-500" : "text-gray-600"}`}>{new Date(n.date).toLocaleString()}</span>
              </div>
              {!n.read && (
                <span className="mt-2 inline-flex items-center rounded-full bg-gradient-to-r from-[#834de3] to-[#9260e7] px-2 py-0.5 text-xs font-medium text-white">
                  <CheckCircle className="mr-1 h-3 w-3" /> Marked read on open
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}