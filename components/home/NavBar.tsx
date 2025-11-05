"use client"

import { MobileNav } from "./MobileNav"
import Link from "next/link"
import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Phone, Mail, Linkedin, Instagram, Facebook, Twitter, Globe } from "lucide-react"
import { useAuth } from "@/context/authContext"
import { useRouter } from "next/navigation"
import { useTranslation } from 'react-i18next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()
  const { t, i18n } = useTranslation('common')

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 30)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    localStorage.setItem('language', lng)
  }

  const dashboardPath = (user as any)?.role === 'superadmin'
    ? '/dashboard/admin'
    : (user as any)?.role === 'company'
      ? '/dashboard/company'
      : '/dashboard/user'

  const displayName = (user as any)?.companyName || (user as any)?.name || 'Account'
  const avatar = (user as any)?.logo || (user as any)?.profileImage || ''
  const userEmail = (user as any)?.email || ''

  // Your contact info
  const phoneNumber = "0784041381"
  const emailAddress = "akazilink@gmail.com"

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
              {/* Phone - click opens WhatsApp */}
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <a
                  href={`https://wa.me/25${phoneNumber}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-[#834de3] transition-colors"
                >
                  {phoneNumber}
                </a>
              </div>

              {/* Email - click opens mail app */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      const email = "akazilink@gmail.com"
                      const mailtoLink = `mailto:${email}`
                      const win = window.open(mailtoLink)
                      setTimeout(() => {
                        if (!win || win.closed || typeof win.closed === 'undefined') {
                          window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`, '_blank')
                        }
                      }, 500)
                    }}
                    className="text-gray-700 hover:text-[#834de3] transition-colors"
                  >
                    akazilink@gmail.com
                  </a>
                </div>
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
                  { href: "/", label: t('home') },
                  { href: "/jobs", label: t('jobs') },
                  { href: "/users", label: t('users') },
                  { href: "/domestic-work", label: t('domestic-work') },
                  { href: "/contact", label: t('contact') },
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
              {/* Language Switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Globe className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {i18n.language === 'rw' ? 'KINY' : 'EN'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => changeLanguage('en')}>
                    English
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changeLanguage('rw')}>
                    Kinyarwanda
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

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
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">{displayName}</span>
                        <span className="text-xs text-gray-500">{userEmail}</span>
                      </div>
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-300 bg-white text-gray-700"
                    onClick={() => { logout(); router.push('/login') }}
                  >
                    {t('logout')}
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
                      {t('login')}
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button 
                      size="sm" 
                      className="bg-[#834de3] hover:bg-[rgb(141,110,233)] text-white font-medium px-6"
                    >
                      {t('register')}
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
