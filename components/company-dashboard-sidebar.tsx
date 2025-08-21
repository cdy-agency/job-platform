"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import {
  BarChart,
  Bell,
  Briefcase,
  Building,
  File,
  Handshake,
  Home,
  LogOut,
  Menu,
  PlusCircle,
  Users,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { fetchCompanyNotifications, fetchCompanyProfile } from "@/lib/api"
import { useAuth } from "@/context/authContext"
import { useRouter } from "next/navigation"

const navItems = [
  {
    title: "Notification",
    href: "/dashboard/company/notifications",
    icon: Bell,
    shortCode: "N",
  },
  {
    title: "Dashboard",
    href: "/dashboard/company",
    icon: Home,
    shortCode: "D",
  },
  {
    title: "Post Job",
    href: "/dashboard/company/post-job",
    icon: PlusCircle,
    shortCode: "PJ",
  },
  {
    title: "Manage Jobs",
    href: "/dashboard/company/jobs",
    icon: Briefcase,
    shortCode: "MJ",
  },
  {
    title: "Applicants",
    href: "/dashboard/company/applicants",
    icon: Users,
    shortCode: "A",
  },
  {
    title: "All Employee",
    href: "/dashboard/company/employees",
    icon: Handshake,
    shortCode: "AE",
  },
  {
    title: "Company Profile",
    href: "/dashboard/company/profile",
    icon: Building,
    shortCode: "CP",
  },
]

interface SidebarContentProps {
  isMobile?: boolean;
  pathname: string;
  unread: number;
  companyProfile: any;
  isCollapsed: boolean;
  logout: () => void;
  router: any;
  onToggleCollapse: () => void;
}

const SidebarContent = ({ 
  isMobile = false, 
  pathname, 
  unread, 
  companyProfile, 
  isCollapsed, 
  logout, 
  router, 
  onToggleCollapse,
}: SidebarContentProps) => (
  <div className="flex h-full flex-col">
    {/* Header */}
    <div className="flex h-16 items-center border-b border-slate-200 px-4 sticky top-0 z-10 bg-slate-900/60 backdrop-blur supports-[backdrop-filter]:bg-slate-900/40">
      <Link href="/" className="flex items-center gap-2">
        <span className="text-lg font-semibold text-slate-900">Akazi-Link</span>
      </Link>
      <button
        type="button"
        onClick={onToggleCollapse}
        className="ml-auto hidden md:inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow hover:bg-slate-50"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        title={isCollapsed ? 'Expand' : 'Collapse'}
      >
        <ChevronRight className={cn("h-4 w-4 transition-transform", isCollapsed ? "rotate-0" : "-rotate-180")} />
      </button>
    </div>

    {/* Back Home Button */}
    <div className="border-b border-slate-200 p-4">
      <Link href="/">
        <Button variant="outline" className="w-full justify-start gap-2">
          <Home className="h-4 w-4" />
          Back Home
        </Button>
      </Link>
    </div>

    {/* Navigation */}
    <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group relative flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              isActive 
                ? "bg-gradient-to-r from-[#834de3] to-[#9b59b6] text-white shadow-lg shadow-purple-500/25" 
                : "text-slate-300 hover:bg-slate-800 hover:text-white",
              isCollapsed && !isMobile ? "justify-center" : "gap-3"
            )}
            title={isCollapsed && !isMobile ? item.title : undefined}
          >
            <item.icon className={cn(
              "h-5 w-5 flex-shrink-0",
              isActive ? "text-white" : "text-slate-400 group-hover:text-white"
            )} />
            
            {(!isCollapsed || isMobile) && (
              <>
                <span className="flex-1">{item.title}</span>
                {item.title.toLowerCase().includes('notification') && unread > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </>
            )}

            {/* Collapsed state indicator */}
            {isCollapsed && !isMobile && (
              <div className="absolute left-full ml-2 hidden group-hover:block z-50">
                <div className="rounded-md bg-slate-800 px-2 py-1 text-xs text-white shadow-lg border border-slate-700">
                  {item.title}
                  {item.title.toLowerCase().includes('notification') && unread > 0 && (
                    <span className="ml-2 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px]">
                      {unread}
                    </span>
                  )}
                </div>
              </div>
            )}
          </Link>
        );
      })}
    </nav>

    {/* User Profile Section */}
    <div className="border-t border-slate-700/50 bg-slate-800/50 p-4">
      {(!isCollapsed || isMobile) ? (
        <>
          <div className="mb-3 flex items-center gap-3 rounded-lg bg-slate-700/30 p-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#834de3] to-[#9b59b6] p-0.5">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-800">
                <span className="text-sm font-bold text-white">
                  {companyProfile?.companyName?.charAt(0) || 'C'}
                </span>
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                {companyProfile?.companyName || 'Company Name'}
              </p>
              <p className="truncate text-xs text-slate-400">
                {companyProfile?.email || 'company@example.com'}
              </p>
            </div>
          </div>
          <Button 
            className="w-full justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 hover:shadow-lg transition-all duration-200" 
            onClick={() => { logout(); router.push('/login'); }}
          >
            <LogOut className="h-4 w-4" />
            <span>Log out</span>
          </Button>
        </>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#834de3] to-[#9b59b6] p-0.5">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-800">
              <span className="text-sm font-bold text-white">
                {companyProfile?.companyName?.charAt(0) || 'C'}
              </span>
            </div>
          </div>
          <Button 
            size="sm"
            className="w-full justify-center bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 p-2" 
            onClick={() => { logout(); router.push('/login'); }}
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  </div>
);

export function CompanyDashboardSidebar() {
  const pathname = usePathname()
  const [unread, setUnread] = useState<number>(0)
  const [companyProfile, setCompanyProfile] = useState<any | null>(null)
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false)
  const { logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchCompanyNotifications()
        const list = Array.isArray(res?.notifications) ? res.notifications : Array.isArray(res) ? res : []
        const count = list.filter((n: any) => !n.read).length
        setUnread(count)
      } catch {
        setUnread(0)
      }
    }
    load()
  }, [])

  useEffect(() => {
    const CompanyProfile = async () => {
      try {
        const data = await fetchCompanyProfile()
        setCompanyProfile(data)
      } catch (error) {
        console.log('Failed to get company details', error)
      }
    }
    CompanyProfile()
  }, [])

  const renderLabel = (itemTitle: string) => (
    <span className="flex w-full items-center gap-2">
      {itemTitle}
      {itemTitle.toLowerCase().includes('notification') && unread > 0 && (
        <span className="ml-auto rounded-full bg-[#834de3] px-2 py-0.5 text-[10px] font-semibold text-white">{unread}</span>
      )}
    </span>
  )

  return (
    <>
      {/* Mobile Header and Sidebar */}
      <div className="flex h-16 items-center border-b bg-white p-4 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="border-gray-300 bg-transparent">
              <Menu className="h-5 w-5 text-gray-600" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0">
            <SidebarContent 
              isMobile={true} 
              pathname={pathname}
              unread={unread}
              companyProfile={companyProfile}
              isCollapsed={isCollapsed}
              logout={logout}
              router={router}
            />
          </SheetContent>
        </Sheet>
        
        <div className="ml-4 flex-1">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-gray-800">Akazi-Link</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#834de3] to-[#9b59b6] p-0.5">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
              <span className="text-xs font-bold text-[#834de3]">
                {companyProfile?.companyName?.charAt(0) || 'C'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden md:block flex-shrink-0 border-r border-slate-200 transition-all duration-300 ease-in-out fixed left-0 top-0 h-screen overflow-y-auto",
        isCollapsed ? "w-16" : "w-72"
      )}>
        <SidebarContent 
          isMobile={false}
          pathname={pathname}
          unread={unread}
          companyProfile={companyProfile}
          isCollapsed={isCollapsed}
          logout={logout}
          router={router}
          onToggleCollapse={() => setIsCollapsed((v) => !v)}
        />
      </div>
      
      {/* Spacer to prevent content overlap */}
      <div className={cn(
        "hidden md:block flex-shrink-0",
        isCollapsed ? "w-16" : "w-72"
      )}></div>
    </>
  )
}