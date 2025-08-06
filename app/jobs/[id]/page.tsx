"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Bookmark, Building, Calendar, MapPin, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { Footer } from "@/components/footer"
import { getJobById, getSimilarJobs } from "@/lib/mock-data"
import { ApplyJobForm } from "@/components/apply-job-form"
import { Breadcrumb } from "@/components/breadcrumb"

export default function JobDetailsPage({ params }: { params: { id: string } }) {
  const [isApplying, setIsApplying] = useState(false)
  const router = useRouter()

  const job = getJobById(params.id)
  const similarJobs = getSimilarJobs(params.id, 3)

  if (!job) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="mb-4 text-2xl font-bold text-gray-800">Job not found</h1>
        <p className="mb-6 text-gray-600">The job you are looking for does not exist.</p>
        <Button onClick={() => router.push("/jobs")} className="bg-blue-500 text-white hover:bg-blue-600">
          Back to Jobs
        </Button>
      </div>
    )
  }

  const handleApply = () => {
    setIsApplying(true)
  }

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
        <div className="container px-4 py-6 sm:px-8">
          <Breadcrumb 
            items={[
              { label: "Jobs", href: "/jobs" },
              { label: job.title }
            ]} 
          />
          <div className="mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/jobs")}
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Jobs
            </Button>
          </div>
          <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
            <div className="space-y-6">
              <Card className="border-gray-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 overflow-hidden rounded-md">
                        <img
                          src={job.company.logo || "/placeholder.svg"}
                          alt={job.company.name}
                          className="h-full w-full object-cover"
                          width={48}
                          height={48}
                        />
                      </div>
                      <div>
                        <CardTitle className="text-2xl text-gray-800">{job.title}</CardTitle>
                        <CardDescription className="flex flex-wrap items-center gap-2 text-gray-600">
                          <span>{job.company.name}</span>
                          <span>•</span>
                          <span className="flex items-center">
                            <MapPin className="mr-1 h-3 w-3" />
                            {job.location}
                          </span>
                          <span>•</span>
                          <span className="flex items-center">
                            <Calendar className="mr-1 h-3 w-3" />
                            Posted {new Date(job.postedDate).toLocaleDateString()}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-gray-300 bg-transparent text-gray-600 hover:text-gray-800"
                      >
                        <Bookmark className="h-4 w-4" />
                        <span className="sr-only">Save job</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-gray-300 bg-transparent text-gray-600 hover:text-gray-800"
                      >
                        <Share2 className="h-4 w-4" />
                        <span className="sr-only">Share job</span>
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-800">{job.type}</span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-800">{job.salary}</span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-800">{job.category}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="description">
                    <TabsList className="mb-4">
                      <TabsTrigger value="description" className="text-gray-600">
                        Description
                      </TabsTrigger>
                      <TabsTrigger value="requirements" className="text-gray-600">
                        Requirements
                      </TabsTrigger>
                      <TabsTrigger value="responsibilities" className="text-gray-600">
                        Responsibilities
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="description" className="space-y-4 text-gray-600">
                      <p>{job.description}</p>
                    </TabsContent>
                    <TabsContent value="requirements" className="space-y-4">
                      <ul className="ml-6 list-disc space-y-2 text-gray-600">
                        {job.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </TabsContent>
                    <TabsContent value="responsibilities" className="space-y-4">
                      <ul className="ml-6 list-disc space-y-2 text-gray-600">
                        {job.responsibilities.map((resp, index) => (
                          <li key={index}>{resp}</li>
                        ))}
                      </ul>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {isApplying ? (
                <Card className="border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-gray-800">Apply for this position</CardTitle>
                    <CardDescription className="text-gray-600">
                      Fill out the form below to apply for this job
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ApplyJobForm jobId={job.id} onCancel={() => setIsApplying(false)} />
                  </CardContent>
                </Card>
              ) : null}
            </div>

            <div className="space-y-6">
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-800">Job Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="mb-1 text-sm font-medium text-gray-800">Job Type</h4>
                    <p className="text-gray-600">{job.type}</p>
                  </div>
                  <div>
                    <h4 className="mb-1 text-sm font-medium text-gray-800">Location</h4>
                    <p className="text-gray-600">{job.location}</p>
                  </div>
                  <div>
                    <h4 className="mb-1 text-sm font-medium text-gray-800">Salary</h4>
                    <p className="text-gray-600">{job.salary}</p>
                  </div>
                  <div>
                    <h4 className="mb-1 text-sm font-medium text-gray-800">Posted Date</h4>
                    <p className="text-gray-600">{new Date(job.postedDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h4 className="mb-1 text-sm font-medium text-gray-800">Application Deadline</h4>
                    <p className="text-gray-600">{new Date(job.applicationDeadline).toLocaleDateString()}</p>
                  </div>
                  <Separator className="bg-gray-200" />
                  <div>
                    <h4 className="mb-1 text-sm font-medium text-gray-800">About the company</h4>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-gray-600" />
                      <Link href={`/companies/${job.company.id}`} className="text-blue-500 hover:underline">
                        {job.company.name}
                      </Link>
                    </div>
                  </div>
                  <div className="pt-2">
                    {!isApplying && (
                      <Button className="w-full bg-blue-500 text-white hover:bg-blue-600" onClick={handleApply}>
                        Apply Now
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-800">Similar Jobs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    {similarJobs.length > 0 ? (
                      similarJobs.map((similarJob) => (
                        <div key={similarJob.id} className="rounded-md border border-gray-200 p-3">
                          <h4 className="font-medium text-gray-800">{similarJob.title}</h4>
                          <p className="text-sm text-gray-600">{similarJob.company.name} • {similarJob.location}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">{similarJob.type}</span>
                            <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-800">{similarJob.salary}</span>
                          </div>
                          <div className="mt-2">
                            <Link href={`/jobs/${similarJob.id}`}>
                              <Button variant="link" className="h-auto p-0 text-blue-500">
                                View Job
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No similar jobs found.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
