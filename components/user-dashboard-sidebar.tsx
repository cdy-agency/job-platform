"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { Bell, Briefcase, ChevronDown, FileText, HandshakeIcon, Home, LogOut, Menu, MessageSquare, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { fetchEmployeeNotifications } from "@/lib/api"

const navItems = [
  {
    title: "Notifications",
    href: "/dashboard/user/notifications",
    icon: Bell,
  },
  {
    title: "Dashboard",
    href: "/dashboard/user",
    icon: Home,
  },
  {
    title: "My Profile",
    href: "/dashboard/user/profile",
    icon: User,
  },
  {
    title: "Job Offers",
    href: "/dashboard/user/job-offer",
    icon: HandshakeIcon,
  },
  {
    title: "My Applications",
    href: "/dashboard/user/applications",
    icon: Briefcase,
  },
]

export function UserDashboardSidebar() {
  const pathname = usePathname()
  const [unread, setUnread] = useState<number>(0)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchEmployeeNotifications()
        const list = Array.isArray(res?.notifications) ? res.notifications : Array.isArray(res) ? res : []
        const count = list.filter((n: any) => !n.read).length
        setUnread(count)
      } catch (e: any) {
        // ignore permission or network errors
        setUnread(0)
      }
    }
    load()
  }, [])

  const renderTitle = (item: any) => {
    if (item.title !== 'Notifications') return item.title
    return (
      <span className="flex items-center gap-2">
        {item.title}
        {unread > 0 && (
          <span className="ml-auto rounded-full bg-[#834de3] px-2 py-0.5 text-[10px] font-semibold text-white">
            {unread}
          </span>
        )}
      </span>
    )
  }

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="flex h-16 items-center border-b bg-white p-4 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="border-gray-300 bg-transparent">
              <Menu className="h-5 w-5 text-gray-600" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] sm:w-[300px]">
            <div className="flex h-full flex-col">
              <div className="flex items-center border-b py-4">
                <Link href="/" className="flex items-center">
                  <span className="text-xl font-bold text-gray-800">Akazi-Link</span>
                </Link>
              </div>
              <div className="flex-1 overflow-auto py-2">
                <nav className="grid gap-1 px-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100",
                        pathname === item.href ? "bg-gray-100 text-gray-800" : "text-gray-600",
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="flex w-full items-center gap-2">
                        {item.title}
                        {item.title === 'Notifications' && unread > 0 && (
                          <span className="ml-auto rounded-full bg-[#834de3] px-2 py-0.5 text-[10px] font-semibold text-white">
                            {unread}
                          </span>
                        )}
                      </span>
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="border-t p-4">
                <div className="flex items-center gap-3 rounded-md px-3 py-2">
                  <div className="h-8 w-8 rounded-full bg-gray-200">
                    <img
                      src="/placeholder.svg?height=32&width=32"
                      alt="User"
                      className="h-full w-full rounded-full"
                      width={32}
                      height={32}
                    />
                  </div>
                  <div className="flex flex-1 items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">John Doe</p>
                      <p className="text-xs text-gray-600">john@example.com</p>
                    </div>
                  </div>
                </div>
                <Link href="/login">
                  <Button className="mt-2 w-full justify-start gap-3 text-gray-600 hover:text-gray-800">
                    <LogOut className="h-4 w-4" />
                    <span>Log out</span>
                  </Button>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <div className="ml-4 flex-1">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-gray-800">JobHub</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gray-200">
            <img
              src="/placeholder.svg?height=32&width=32"
              alt="User"
              className="h-full w-full rounded-full"
              width={32}
              height={32}
            />
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden w-64 flex-shrink-0 border-r border-gray-200 bg-white md:block">
        <div className="flex h-16 items-center border-b border-gray-200 px-6">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-gray-800">JobHub</span>
          </Link>
        </div>
        <div className="flex flex-col py-4">
          <nav className="grid gap-1 px-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100",
                  pathname === item.href ? "bg-gray-100 text-gray-800" : "text-gray-600",
                )}
              >
                <item.icon className="h-4 w-4" />
                <span className="flex w-full items-center gap-2">
                  {item.title}
                  {item.title === 'Notifications' && unread > 0 && (
                    <span className="ml-auto rounded-full bg-[#834de3] px-2 py-0.5 text-[10px] font-semibold text-white">
                      {unread}
                    </span>
                  )}
                </span>
              </Link>
            ))}
          </nav>
          <div className="mt-auto border-t border-gray-200 p-4">
            <div className="flex items-center gap-3 rounded-md px-3 py-2">
              <div className="h-8 w-8 rounded-full bg-gray-200">
                <img
                  src="/placeholder.svg?height=32&width=32"
                  alt="User"
                  className="h-full w-full rounded-full"
                  width={32}
                  height={32}
                />
              </div>
              <div className="flex flex-1 items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">John Doe</p>
                  <p className="text-xs text-gray-600">john@example.com</p>
                </div>
              </div>
            </div>
            <Link href="/login">
              <Button className="mt-2 w-full text-center justify-start gap-3 bg-[#834de3] hover:bg-[#8d6ee9] text-white">
                <span>Log out</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
