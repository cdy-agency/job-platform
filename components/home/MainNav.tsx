"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Home" },
  { href: "/jobs", label: "Jobs" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/terms-policy", label: "Contact" },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="hidden md:flex items-center space-x-4 flex-1 justify-center">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-[#834de3] relative py-2",
            pathname === item.href 
              ? "text-[#834de3]" 
              : "text-gray-700"
          )}
        >
          {item.label}
          {pathname === item.href && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#834de3]" />
          )}
        </Link>
      ))}
    </nav>
  )
}
