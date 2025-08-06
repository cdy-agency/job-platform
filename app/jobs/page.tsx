"use client"

import { useState } from "react"
import Link from "next/link"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { Footer } from "@/components/footer"
import { JobCard } from "@/components/job-card"
import { mockJobs } from "@/lib/mock-data"

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [jobType, setJobType] = useState("all")
  const [location, setLocation] = useState("all")
  const [salaryRange, setSalaryRange] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  // Filter jobs based on search term, job type, location, and salary range
  const filteredJobs = mockJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = jobType === "all" || job.type === jobType
    const matchesLocation = location === "all" || job.location.toLowerCase().includes(location.toLowerCase())

    // Simple salary range filtering (just for demonstration)
    let matchesSalary = true
    if (salaryRange === "under-50k") {
      matchesSalary = job.salary.includes("50,000") || Number.parseInt(job.salary.replace(/[^0-9]/g, "")) < 50000
    } else if (salaryRange === "50k-100k") {
      const salary = Number.parseInt(job.salary.replace(/[^0-9]/g, ""))
      matchesSalary = salary >= 50000 && salary <= 100000
    } else if (salaryRange === "over-100k") {
      matchesSalary = Number.parseInt(job.salary.replace(/[^0-9]/g, "")) > 100000
    }

    return matchesSearch && matchesType && matchesLocation && matchesSalary
  })

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
        <section className="bg-gray-50 py-8">
          <div className="container px-4 sm:px-8">
            <div className="mb-8">
              <h1 className="mb-2 text-3xl font-bold text-gray-800">Find Your Dream Job</h1>
              <p className="text-gray-600">Browse through our extensive list of opportunities</p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <div className="grid gap-4 md:grid-cols-[1fr_auto_auto_auto]">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-600" />
                  <Input
                    placeholder="Search jobs, companies, or keywords"
                    className="border-gray-300 pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={jobType} onValueChange={setJobType}>
                  <SelectTrigger className="w-full border-gray-300 md:w-[180px]">
                    <SelectValue placeholder="Job Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger className="w-full border-gray-300 md:w-[180px]">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                    <SelectItem value="New York">New York</SelectItem>
                    <SelectItem value="San Francisco">San Francisco</SelectItem>
                    <SelectItem value="Chicago">Chicago</SelectItem>
                    <SelectItem value="Boston">Boston</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={salaryRange} onValueChange={setSalaryRange}>
                  <SelectTrigger className="w-full border-gray-300 md:w-[180px]">
                    <SelectValue placeholder="Salary Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Salaries</SelectItem>
                    <SelectItem value="under-50k">Under $50,000</SelectItem>
                    <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                    <SelectItem value="over-100k">Over $100,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>
        <section className="py-8">
          <div className="container px-4 sm:px-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                {filteredJobs.length} {filteredJobs.length === 1 ? "Job" : "Jobs"} Found
              </h2>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] border-gray-300">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="salary-high">Salary: High to Low</SelectItem>
                  <SelectItem value="salary-low">Salary: Low to High</SelectItem>
                  <SelectItem value="title">Job Title A-Z</SelectItem>
                  <SelectItem value="company">Company A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-6">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <JobCard 
                    key={job.id} 
                    job={job} 
                    variant="detailed" 
                    showPostedDate={true}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-8 text-center">
                  <h3 className="mb-2 text-xl font-semibold text-gray-800">No jobs found</h3>
                  <p className="mb-6 text-gray-600">Try adjusting your search filters or search term</p>
                  <Button
                    variant="outline"
                    className="border-gray-300 bg-transparent text-gray-800"
                    onClick={() => {
                      setSearchTerm("")
                      setJobType("all")
                      setLocation("all")
                      setSalaryRange("all")
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
