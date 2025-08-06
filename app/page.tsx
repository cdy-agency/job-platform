import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { Footer } from "@/components/footer"
import { JobCard } from "@/components/job-card"
import { Briefcase, CheckCircle, Search, Users } from "lucide-react"
import { mockJobs } from "@/lib/mock-data"

export default function Home() {
  // Get featured jobs (just the first 3)
  const featuredJobs = mockJobs.slice(0, 3)

  return (
    <div className="flex min-h-screen flex-col">
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

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-white py-16 md:py-24">
          <div className="container px-4 sm:px-8">
            <div className="grid gap-8 md:grid-cols-2 md:gap-12">
              <div className="flex flex-col justify-center">
                <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-800 sm:text-5xl md:text-6xl">
                  Find Your Dream Job Today
                </h1>
                <p className="mb-8 text-xl text-gray-600">
                  Connect with top companies and discover opportunities that match your skills and aspirations.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Link href="/register">
                    <Button size="lg" className="bg-blue-500 text-white hover:bg-blue-600">
                      Get Started
                    </Button>
                  </Link>
                  <Link href="/jobs">
                    <Button size="lg" variant="outline" className="border-gray-300 bg-transparent text-gray-800">
                      Browse Jobs
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=400&width=500"
                  alt="Job seekers and employers"
                  className="rounded-lg"
                  width={500}
                  height={400}
                />
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-gray-50 py-16">
          <div className="container px-4 sm:px-8">
            <div className="mb-10 text-center">
              <h2 className="mb-2 text-3xl font-bold text-gray-800">How It Works</h2>
              <p className="text-gray-600">Simple steps to find your next career opportunity</p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
                  <Search className="h-10 w-10 text-blue-500" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-800">Search Jobs</h3>
                <p className="text-gray-600">
                  Browse through thousands of opportunities across various industries and locations.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
                  <CheckCircle className="h-10 w-10 text-blue-500" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-800">Apply with Ease</h3>
                <p className="text-gray-600">
                  Create your profile once and apply to multiple positions with just a few clicks.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
                  <Briefcase className="h-10 w-10 text-blue-500" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-800">Land Your Dream Job</h3>
                <p className="text-gray-600">Connect directly with employers and start your new career journey.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Jobs Section */}
        <section className="py-16">
          <div className="container px-4 sm:px-8">
            <div className="mb-10 text-center">
              <h2 className="mb-2 text-3xl font-bold text-gray-800">Featured Jobs</h2>
              <p className="text-gray-600">Explore our handpicked selection of top opportunities</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {featuredJobs.map((job) => (
                <JobCard key={job.id} job={job} variant="default" />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link href="/jobs">
                <Button size="lg" variant="outline" className="border-gray-300 bg-transparent text-gray-800">
                  View All Jobs
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* For Employers Section */}
        <section className="bg-gray-50 py-16">
          <div className="container px-4 sm:px-8">
            <div className="grid gap-8 md:grid-cols-2 md:gap-12">
              <div className="flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=400&width=500"
                  alt="Hiring managers"
                  className="rounded-lg"
                  width={500}
                  height={400}
                />
              </div>
              <div className="flex flex-col justify-center">
                <h2 className="mb-4 text-3xl font-bold text-gray-800">For Employers</h2>
                <p className="mb-6 text-lg text-gray-600">
                  Find the perfect candidates for your open positions. Our platform connects you with qualified
                  professionals ready to join your team.
                </p>
                <ul className="mb-8 space-y-4">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                    <span className="text-gray-600">Post job listings and reach thousands of candidates</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                    <span className="text-gray-600">Review applications and manage candidates</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                    <span className="text-gray-600">Streamline your hiring process</span>
                  </li>
                </ul>
                <Link href="/register">
                  <Button size="lg" className="bg-blue-500 text-white hover:bg-blue-600">
                    <Users className="mr-2 h-5 w-5" />
                    Start Hiring
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16">
          <div className="container px-4 sm:px-8">
            <div className="mx-auto max-w-2xl">
              <div className="mb-8 text-center">
                <h2 className="mb-2 text-3xl font-bold text-gray-800">Contact Us</h2>
                <p className="text-gray-600">Have questions? We're here to help!</p>
              </div>
              <form className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-800">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-800">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Your email"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="mb-1 block text-sm font-medium text-gray-800">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Subject"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="mb-1 block text-sm font-medium text-gray-800">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Your message"
                  ></textarea>
                </div>
                <Button type="submit" className="w-full bg-blue-500 text-white hover:bg-blue-600">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
