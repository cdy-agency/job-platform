import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"

export function PageHeader() {
  return (
    <header className="border-b bg-white">
      <div className="container flex h-16 items-center px-4 sm:px-8">
        <Link href="/" className="flex items-center">
          <span className="text-xl font-bold text-gray-800">JobHub</span>
        </Link>
        <MainNav />
        <div className="ml-auto flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800">
              Log in
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm" className="bg-blue-500 text-white hover:bg-blue-600">
              Sign up
            </Button>
          </Link>
        </div>
        <MobileNav />
      </div>
    </header>
  )
}