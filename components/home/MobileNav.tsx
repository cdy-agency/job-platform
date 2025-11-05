"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const { t, i18n } = useTranslation("common");

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
  };

  //  Same links as Desktop Navbar
  const navItems = [
    { href: "/", label: t("home") },
    { href: "/jobs", label: t("jobs") },
    { href: "/users", label: t("users") },
    { href: "/domestic-work", label: t("domestic-work") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* Menu button */}
      <SheetTrigger asChild>
        <Button className="md:hidden hover:bg-gray-100">
          <Menu className="h-5 w-5 text-gray-700" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>

      {/* Sidebar menu content */}
      <SheetContent side="right" className="w-[280px] bg-white">
        <div className="flex h-full flex-col">
          {/* Header with logo and close button */}
          <div className="flex items-center justify-between border-b border-gray-200 py-4">
            <Link
              href="/"
              className="text-2xl font-bold text-[#834de3]"
              onClick={() => setOpen(false)}
            >
              Akazi Link
            </Link>
            <Button
              onClick={() => setOpen(false)}
              className="hover:bg-gray-100"
              variant="ghost"
              size="icon"
            >
              <X className="h-5 w-5 text-gray-700" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>

          {/* Navigation links */}
          <nav className="flex-1 py-6 overflow-y-auto">
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

          {/* Bottom actions */}
          <div className="border-t border-gray-200 py-4 space-y-3 flex flex-col">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 flex justify-center gap-2"
                >
                  <Globe className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {i18n.language === "rw" ? "Kinyarwanda" : "English"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => changeLanguage("en")}>
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage("rw")}>
                  Kinyarwanda
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Auth buttons */}
            <Link href="/login" onClick={() => setOpen(false)}>
              <Button
                variant="outline"
                className="w-full border-[#834de3] text-[#834de3] hover:bg-[#834de3] hover:text-white bg-white"
              >
                {t("login")}
              </Button>
            </Link>
            <Link href="/register" onClick={() => setOpen(false)}>
              <Button className="w-full bg-[#834de3] hover:bg-[rgb(141,110,233)] text-white font-medium">
                {t("register")}
              </Button>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
