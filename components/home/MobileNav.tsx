"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Home" },
  { href: "/jobs", label: "Jobs" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

export function MobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="md:hidden hover:bg-gray-100">
          <Menu className="h-5 w-5 text-gray-700" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px] bg-white">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-gray-200 py-4">
            <Link href="/" className="text-2xl font-bold text-[#834de3]" onClick={() => setOpen(false)}>
              Akazi Link
            </Link>
            <Button onClick={() => setOpen(false)} className="hover:bg-gray-100 ">
              <X className="h-5 w-5 text-gray-700" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>
          <nav className="flex-1 py-6">
            <ul className="flex flex-col gap-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "block px-4 py-3 text-base font-medium rounded-lg transition-colors",
                      pathname === item.href 
                        ? "text-[#834de3] bg-[#834de3]/10" 
                        : "text-gray-700 hover:text-[#834de3] hover:bg-gray-50"
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="border-t border-gray-200 py-4 space-y-3 gap-3 flex flex-col">
            <Link href="/login" onClick={() => setOpen(false)}>
              <Button variant="outline" className="w-full border-[#834de3] text-[#834de3] hover:bg-[#834de3] hover:text-white bg-white">
                Log in
              </Button>
            </Link>
            <Link href="/register" onClick={() => setOpen(false)}>
              <Button className="w-full bg-[#834de3] hover:bg-[rgb(141,110,233)] text-white font-medium">
                Create account
              </Button>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}