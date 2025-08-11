"use client"

import { MobileNav } from "./MobileNav"
import Link from "next/link"
import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Phone, Mail, Linkedin, Instagram, Facebook, Twitter } from "lucide-react"
import { useAuth } from "@/context/authContext"

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 30)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const displayName = user
    ? user.role === 'company'
      ? (user as any).companyName || 'Company'
      : user.role === 'employee'
        ? (user as any).name || 'Employee'
        : (user as any).email || 'Admin'
    : ''

  const dashboardHref = user
    ? user.role === 'company'
      ? '/dashboard/company'
      : user.role === 'employee'
        ? '/dashboard/user'
        : '/dashboard/admin'
    : '/login'

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
            
            {/* Desktop Right Section */}
            <div className="hidden md:flex items-center gap-4 flex-shrink-0">
              {user ? (
                <>
                  <Link href={dashboardHref}>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-[#834de3] bg-[#834de3] hover:bg-[#8d6ee9] text-white font-medium px-6"
                    >
                      Dashboard
                    </Button>
                  </Link>
                  <div className="flex items-center gap-3 px-3 py-1 border rounded-md">
                    <div className="h-8 w-8 rounded-full bg-[#ece7fb] flex items-center justify-center text-[#834de3] font-semibold text-xs">
                      {displayName?.slice(0,1) || 'U'}
                    </div>
                    <span className="text-sm text-gray-800 max-w-[160px] truncate">{displayName}</span>
                    <Button size="sm" variant="ghost" className="text-gray-600" onClick={logout}>Logout</Button>
                  </div>
                </>
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