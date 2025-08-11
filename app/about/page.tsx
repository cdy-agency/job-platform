// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Footer } from "@/components/footer"

// export default function AboutPage() {
//   return (
//     <div className="flex min-h-screen flex-col">
//       <header className="border-b bg-background">
//         <div className="container flex h-16 items-center px-4 sm:px-8">
//           <Link href="/" className="flex items-center">
//             <span className="text-xl font-bold">JobHub</span>
//           </Link>
//           <MainNav />
//           <div className="ml-auto flex items-center gap-4">
//             <Link href="/login">
//               <Button variant="ghost" size="sm">
//                 Log in
//               </Button>
//             </Link>
//             <Link href="/register">
//               <Button size="sm">Sign up</Button>
//             </Link>
//           </div>
//           <MobileNav />
//         </div>
//       </header>
//       <main className="flex-1">
//         <section className="bg-gray-50 py-16 md:py-24">
//           <div className="container px-4 sm:px-8">
//             <div className="mx-auto max-w-3xl text-center">
//               <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">About JobHub</h1>
//               <p className="mb-8 text-xl text-muted-foreground">Connecting talent with opportunity since 2020</p>
//             </div>
//           </div>
//         </section>

//         <section className="py-16">
//           <div className="container px-4 sm:px-8">
//             <div className="grid gap-12 md:grid-cols-2">
//               <div>
//                 <h2 className="mb-4 text-3xl font-bold">Our Mission</h2>
//                 <p className="mb-4 text-muted-foreground">
//                   At JobHub, we believe that finding the right job or the right candidate shouldn't be a challenge. Our
//                   mission is to create a seamless connection between talented individuals and forward-thinking
//                   companies.
//                 </p>
//                 <p className="text-muted-foreground">
//                   We're dedicated to transforming the job search and recruitment process through innovative technology
//                   and a deep understanding of both job seekers' and employers' needs.
//                 </p>
//               </div>
//               <div className="flex items-center justify-center">
//                 <img
//                   src="/placeholder.svg?height=300&width=400"
//                   alt="Our team"
//                   className="rounded-lg"
//                   width={400}
//                   height={300}
//                 />
//               </div>
//             </div>
//           </div>
//         </section>

//         <section className="bg-gray-50 py-16">
//           <div className="container px-4 sm:px-8">
//             <h2 className="mb-12 text-center text-3xl font-bold">Our Values</h2>
//             <div className="grid gap-8 md:grid-cols-3">
//               <div className="rounded-lg bg-white p-6 shadow-sm">
//                 <h3 className="mb-3 text-xl font-semibold">Innovation</h3>
//                 <p className="text-muted-foreground">
//                   We constantly push boundaries to create better solutions for job seekers and employers alike.
//                 </p>
//               </div>
//               <div className="rounded-lg bg-white p-6 shadow-sm">
//                 <h3 className="mb-3 text-xl font-semibold">Inclusivity</h3>
//                 <p className="text-muted-foreground">
//                   We believe in equal opportunities for all, regardless of background or circumstances.
//                 </p>
//               </div>
//               <div className="rounded-lg bg-white p-6 shadow-sm">
//                 <h3 className="mb-3 text-xl font-semibold">Integrity</h3>
//                 <p className="text-muted-foreground">
//                   We operate with transparency and honesty in all our interactions and business practices.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </section>

//         <section className="py-16">
//           <div className="container px-4 sm:px-8">
//             <h2 className="mb-12 text-center text-3xl font-bold">Our Team</h2>
//             <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//               {[
//                 {
//                   name: "Sarah Johnson",
//                   role: "CEO & Founder",
//                   image: "/placeholder.svg?height=200&width=200",
//                 },
//                 {
//                   name: "Michael Chen",
//                   role: "CTO",
//                   image: "/placeholder.svg?height=200&width=200",
//                 },
//                 {
//                   name: "Aisha Patel",
//                   role: "Head of Product",
//                   image: "/placeholder.svg?height=200&width=200",
//                 },
//                 {
//                   name: "David Kim",
//                   role: "Head of Marketing",
//                   image: "/placeholder.svg?height=200&width=200",
//                 },
//               ].map((member) => (
//                 <div key={member.name} className="flex flex-col items-center text-center">
//                   <div className="mb-4 h-40 w-40 overflow-hidden rounded-full">
//                     <img
//                       src={member.image || "/placeholder.svg"}
//                       alt={member.name}
//                       className="h-full w-full object-cover"
//                       width={160}
//                       height={160}
//                     />
//                   </div>
//                   <h3 className="text-lg font-semibold">{member.name}</h3>
//                   <p className="text-muted-foreground">{member.role}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         <section className="bg-blue-500 py-16 text-white">
//           <div className="container px-4 sm:px-8">
//             <div className="mx-auto max-w-3xl text-center">
//               <h2 className="mb-4 text-3xl font-bold">Join Our Community</h2>
//               <p className="mb-8">
//                 Whether you're looking for your next career move or searching for top talent, JobHub is here to help you
//                 succeed.
//               </p>
//               <div className="flex flex-col justify-center gap-4 sm:flex-row">
//                 <Link href="/register">
//                   <Button size="lg" variant="secondary">
//                     Sign Up Now
//                   </Button>
//                 </Link>
//                 <Link href="/contact">
//                   <Button
//                     size="lg"
//                     variant="outline"
//                     className="border-white text-white hover:bg-white hover:text-blue-500 bg-transparent"
//                   >
//                     Contact Us
//                   </Button>
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </section>
//       </main>
//       <Footer />
//     </div>
//   )
// }
