"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building,
  Users,
  CheckCircle,
  XCircle,
  Home,
  LogOut,
  Menu,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard/admin",
    icon: Home,
  },
  {
    title: "Notifications",
    href: "/dashboard/admin/notifications",
    icon: CheckCircle,
  },
  {
    title: "Manage Employees",
    href: "/dashboard/admin/employees",
    icon: Users,
  },
  {
    title: "Manage Companies",
    href: "/dashboard/admin/companies",
    icon: Building,
  },
  {
    title: "Profile",
    href: "/dashboard/admin/profile",
    icon: User,
  },
  // {
  //   title: "Pending Approvals",
  //   href: "/dashboard/admin/pending-approvals",
  //   icon: CheckCircle,
  // },
  // {
  //   title: "Rejected Companies",
  //   href: "/dashboard/admin/rejected-companies",
  //   icon: XCircle,
  // },
];

export function AdminDashboardSidebar() {
  const pathname = usePathname();

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
              <div className="flex items-center border-b py-4 px-4">
                <Link href="/" className="flex items-center">
                  <span className="text-xl font-bold text-gray-800">JobHub Admin</span>
                </Link>
              </div>
              <div className="flex-1 overflow-auto py-2">
                <nav className="grid gap-1 px-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 hover:text-[#834de3] hover:font-semibold",
                        pathname === item.href
                          ? "bg-gray-100 text-gray-800"
                          : "text-gray-600"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="border-t p-4">
                <div className="flex items-center gap-3 rounded-md px-3 py-2">
                  <div className="h-8 w-8 rounded-full bg-gray-200">
                    <img
                      src="/placeholder.svg?height=32&width=32"
                      alt="Admin"
                      className="h-full w-full rounded-full"
                      width={32}
                      height={32}
                    />
                  </div>
                  <div className="flex flex-1 items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">Admin User</p>
                      <p className="text-xs text-gray-600">admin@jobhub.com</p>
                    </div>
                  </div>
                </div>
                <Link href="/login">
                  <Button className="mt-2 w-full justify-start gap-3 bg-[#834de3] hover:bg-[#8d6ee9] text-white">
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
            <span className="text-xl font-bold text-gray-800">JobHub Admin</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gray-200">
            <img
              src="/placeholder.svg?height=32&width=32"
              alt="Admin"
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
            <span className="text-xl font-bold text-gray-800">JobHub Admin</span>
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
                  pathname === item.href ? "bg-gray-100 text-gray-800" : "text-gray-600"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            ))}
          </nav>
          <div className="mt-auto border-t border-gray-200 p-4">
            <div className="flex items-center gap-3 rounded-md px-3 py-2">
              <div className="h-8 w-8 rounded-full bg-gray-200">
                <img
                  src="/placeholder.svg?height=32&width=32"
                  alt="Admin"
                  className="h-full w-full rounded-full"
                  width={32}
                  height={32}
                />
              </div>
              <div className="flex flex-1 items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#834de3]">Admin User</p>
                  <p className="text-xs text-gray-600">admin@jobhub.com</p>
                </div>
              </div>
            </div>
            <Link href="/login">
              <Button className="mt-2 w-full text-center justify-start gap-3 bg-[#834de3] hover:bg-[#8d6ee9] text-white">
                <LogOut className="h-4 w-4" />
                <span>Log out</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
