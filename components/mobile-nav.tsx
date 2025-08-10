// "use client"

// import * as React from "react"
// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { Menu, X } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
// import { cn } from "@/lib/utils"

// const navItems = [
//   { href: "/", label: "Home" },
//   { href: "/jobs", label: "Jobs" },
//   { href: "/contact", label: "Contact" },
// ]

// export function MobileNav() {
//   const pathname = usePathname()
//   const [open, setOpen] = React.useState(false)

//   return (
//     <Sheet open={open} onOpenChange={setOpen}>
//       <SheetTrigger asChild>
//         <Button  className="md:hidden">
//           <Menu className="h-5 w-5" />
//           <span className="sr-only">Toggle menu</span>
//         </Button>
//       </SheetTrigger>
//       <SheetContent side="left" className="w-[240px] sm:w-[300px]">
//         <div className="flex h-full flex-col">
//           <div className="flex items-center justify-between border-b py-4">
//             <Link href="/" className="font-bold" onClick={() => setOpen(false)}>
//               JobHub
//             </Link>
//             <Button onClick={() => setOpen(false)}>
//               <X className="h-5 w-5" />
//               <span className="sr-only">Close menu</span>
//             </Button>
//           </div>
//           <nav className="flex-1 py-4">
//             <ul className="flex flex-col gap-3">
//               {navItems.map((item) => (
//                 <li key={item.href}>
//                   <Link
//                     href={item.href}
//                     className={cn(
//                       "block px-2 py-1 text-lg font-medium transition-colors hover:text-primary",
//                       pathname === item.href ? "text-gray-800" : "text-gray-600",
//                     )}
//                     onClick={() => setOpen(false)}
//                   >
//                     {item.label}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </nav>
//           <div className="border-t py-4">
//             <div className="flex flex-col gap-2">
//               <Link href="/login" onClick={() => setOpen(false)}>
//                 <Button variant="outline" className="w-full bg-transparent">
//                   Log in
//                 </Button>
//               </Link>
//               <Link href="/register" onClick={() => setOpen(false)}>
//                 <Button className="w-full bg-blue-500 hover:bg-blue-600">Sign up</Button>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </SheetContent>
//     </Sheet>
//   )
// }
