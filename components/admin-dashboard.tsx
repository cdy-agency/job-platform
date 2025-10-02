"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Building,
  Users,
  CheckCircle,
  Home,
  LogOut,
  Menu,
  User,
  ChevronLeft,
  ChevronRight,
  Shield,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { AppAvatar } from "@/components/ui/avatar";
import { fetchAdminNotifications } from "@/lib/api";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard/admin",
    icon: LayoutDashboard,
    shortCode: "D",
  },
  {
    title: "Notifications",
    href: "/dashboard/admin/notifications",
    icon: CheckCircle,
    shortCode: "N",
  },
  {
    title: "Manage Employees",
    href: "/dashboard/admin/employees",
    icon: Users,
    shortCode: "ME",
  },
  {
    title: "Manage Companies",
    href: "/dashboard/admin/companies",
    icon: Building,
    shortCode: "MC",
  },
  {
    title: "Domestic Work",
    href: "/dashboard/admin/domestic-work",
    icon: Users,
    shortCode: "MC",
  },
  // {
  //   title: "Profile",
  //   href: "/dashboard/admin/profile",
  //   icon: User,
  //   shortCode: "MC",
  // },
];

interface SidebarContentProps {
  isMobile?: boolean;
  pathname: string;
  unread: number;
  isCollapsed: boolean;
  logout: () => void;
  router: any;
  onToggleCollapse?: () => void;
}

const SidebarContent = ({ 
  isMobile = false, 
  pathname, 
  unread, 
  isCollapsed, 
  logout, 
  router, 
  onToggleCollapse,
}: SidebarContentProps) => (
  <div className="flex h-full flex-col bg-[#1a1a1a]">
    {/* Header */}
    <div className={cn(
      "flex items-center border-b border-gray-800 bg-[#1a1a1a]",
      isCollapsed && !isMobile ? "h-16 px-4 justify-center" : "h-16 px-6"
    )}>
      {(!isCollapsed || isMobile) ? (
        <div className="flex items-center justify-between w-full">
          <Link href="/" className="flex items-center">
            <span className="text-lg font-semibold text-white">Admin Portal</span>
          </Link>
          {!isMobile && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <span className="text-lg font-semibold text-white mb-2">AP</span>
          <button
            type="button"
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
            aria-label="Expand sidebar"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>

    {/* Navigation */}
    <nav className="flex-1 p-4 space-y-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group relative flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200",
              isActive 
                ? "bg-purple-600 text-white" 
                : "text-gray-300 hover:bg-gray-800 hover:text-white",
              isCollapsed && !isMobile ? "justify-center" : "gap-3"
            )}
            title={isCollapsed && !isMobile ? item.title : undefined}
          >
            <item.icon className={cn(
              "h-5 w-5 flex-shrink-0",
              isActive ? "text-white" : "text-gray-400 group-hover:text-white"
            )} />
            
            {(!isCollapsed || isMobile) && (
              <div className="flex items-center justify-between w-full">
                <span className="flex-1">{item.title}</span>
                {item.title === 'Notifications' && unread > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </div>
            )}

            {/* Tooltip for collapsed state */}
            {isCollapsed && !isMobile && (
              <div className="absolute left-full ml-2 hidden group-hover:block z-50">
                <div className="rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-sm text-white shadow-lg">
                  {item.title}
                  {item.title === 'Notifications' && unread > 0 && (
                    <span className="ml-2 rounded-full bg-red-500 px-1.5 py-0.5 text-xs">
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

    {/* Back Home Button */}
    {(!isCollapsed || isMobile) && (
      <div className="px-4 pb-4">
        <Link href="/">
          <Button variant="outline" className="w-full justify-start gap-3 bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white hover:border-gray-600">
            <Home className="h-4 w-4" />
            Back Home
          </Button>
        </Link>
      </div>
    )}

    {/* Admin Profile Section */}
    <div className="border-t border-gray-800 p-4 bg-[#1a1a1a]">
      {(!isCollapsed || isMobile) ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">Admin User</p>
              <p className="truncate text-xs text-gray-400">admin@AkaziLink.com</p>
              <div className="mt-1 flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-green-400"></div>
                <span className="text-xs text-green-400">Super Admin</span>
              </div>
            </div>
          </div>
          <Button 
            className="w-full justify-center gap-2 bg-red-600 hover:bg-red-700 text-white transition-colors" 
            onClick={() => { logout(); router.push('/login'); }}
          >
            <LogOut className="h-4 w-4" />
            <span>Log out</span>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-amber-500 flex items-center justify-center">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <Button 
            size="sm"
            className="w-full justify-center bg-red-600 hover:bg-red-700 text-white p-2" 
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

export function AdminDashboardSidebar() {
  const pathname = usePathname();
  const [unread, setUnread] = useState<number>(0);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const { logout, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchAdminNotifications();
        const list = Array.isArray(res?.notifications) ? res.notifications : Array.isArray(res) ? res : [];
        setUnread(list.filter((n: any) => !n.read).length);
      } catch {
        setUnread(0);
      }
    };
    load();
  }, []);

  return (
    <>
      {/* Mobile Header and Sidebar */}
      <div className="flex h-16 items-center border-b border-gray-200 bg-white p-4 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="border-gray-300 bg-transparent">
              <Menu className="h-5 w-5 text-gray-600" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0 bg-[#1a1a1a] border-r border-gray-800">
            <SidebarContent 
              isMobile={true} 
              pathname={pathname}
              unread={unread}
              isCollapsed={isCollapsed}
              logout={logout}
              router={router}
            />
          </SheetContent>
        </Sheet>
        
        <div className="ml-4 flex-1">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-gray-800">Admin Portal</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-amber-500 flex items-center justify-center">
            <Shield className="h-4 w-4 text-white" />
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden md:block flex-shrink-0 border-r border-gray-800 transition-all duration-300 ease-in-out fixed left-0 top-0 h-screen overflow-y-auto bg-[#1a1a1a]",
        isCollapsed ? "w-16" : "w-72"
      )}>
        <SidebarContent 
          isMobile={false}
          pathname={pathname}
          unread={unread}
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
  );
}