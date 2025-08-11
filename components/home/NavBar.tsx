"use client"

import { MobileNav } from "./MobileNav"
import Link from "next/link"
import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Phone, Mail, Linkedin, Instagram, Facebook, Twitter } from "lucide-react"
import { useAuth } from "@/context/authContext"
import { useRouter } from "next/navigation"

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 30)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const dashboardPath = user?.role === 'superadmin'
    ? '/dashboard/admin'
    : user?.role === 'company'
      ? '/dashboard/company'
      : '/dashboard/user'

  const displayName = (user as any)?.companyName || (user as any)?.name || 'Account'
  const avatar = (user as any)?.logo || ''

  return (
    <div className="relative">
      {/* Top contact bar - completely hides when scrolled */}
      <div 
        className={`bg-gray-50 border-b border-gray-200 transition-all duration-300 ${
          isScrolled ? 'h-0 overflow-hidden' : 'h-12'
        }`}
      >
        <div className="container max-w-7xl mx-auto px-4 sm:px-4 h-full">
          <div className="flex items-center justify-between h-12 text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700">0784041381</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700">akazilink@gmail.com</span>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-3">
              <a href="#" className="text-gray-500 hover:text-[#834de3] transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" className="text-gray-500 hover:text-[#834de3] transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="text-gray-500 hover:text-[#834de3] transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="text-gray-500 hover:text-[#834de3] transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation header - becomes sticky when contact bar disappears */}
      <header 
        className={`w-full bg-white border-b border-gray-200 transition-all duration-300 ${
          isScrolled 
            ? 'fixed top-0 left-0 right-0 z-50 shadow-lg' 
            : 'relative shadow-sm'
        }`}
      >
        <div className="container max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo - Left */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-bold text-[#834de3]">Akazi-Link</span>
              </Link>
            </div>
            
            {/* Desktop Navigation - Center */}
            <div className="hidden md:flex flex-1 justify-center">
              <nav className="flex items-center space-x-8">
                {[
                  { href: "/", label: "Home" },
                  { href: "/jobs", label: "Jobs" },
                  { href: "/users", label: "Users" },
                  { href: "/contact", label: "Contact" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm font-medium text-gray-700 hover:text-[#834de3] transition-colors relative group"
                  >
                    {item.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#834de3] transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                ))}
              </nav>
            </div>
            
            {/* Desktop Auth/User - Right */}
            <div className="hidden md:flex items-center gap-4 flex-shrink-0">
              {user ? (
                <div className="flex items-center gap-3">
                  <Link href={dashboardPath}>
                    <Button 
                      size="sm"
                      variant="outline"
                      className="border-[#834de3] bg-white hover:bg-[#f5f0ff] text-[#834de3] font-medium px-4"
                    >
                      <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#ece7fb] overflow-hidden">
                        {avatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={avatar} alt="avatar" className="h-6 w-6 object-cover" />
                        ) : (
                          <span className="text-xs font-bold text-[#834de3]">
                            {displayName?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        )}
                      </span>
                      {displayName}
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-300 bg-white text-gray-700"
                    onClick={() => { logout(); router.push('/') }}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <>
                  <Link href="/login">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-[#834de3] bg-[#834de3] hover:bg-[#8d6ee9] text-white font-medium px-6"
                    >
                      Log in
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button 
                      size="sm" 
                      className="bg-[#834de3] hover:bg-[rgb(141,110,233)] text-white font-medium px-6"
                    >
                      Create account
                    </Button>
                  </Link>
                </>
              )}
            </div>
            
            {/* Mobile Navigation */}
            <div className="md:hidden">
              <MobileNav />
            </div>
          </div>
        </div>
      </header>

      {/* Spacer to prevent content jump when navbar becomes fixed */}
      {isScrolled && <div className="h-16"></div>}
    </div>
  )
}

export default NavBar