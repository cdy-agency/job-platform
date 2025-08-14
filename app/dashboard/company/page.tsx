"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Bell, PlusCircle, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchCompanyJobs, fetchCompanyProfile, fetchJobApplicants } from "@/lib/api"

export default function CompanyDashboardPage() {
  const [profile, setProfile] = useState<any>(null)
  const [jobs, setJobs] = useState<any[]>([])
  const [applicants, setApplicants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCompanyProfile()
      .then((p) => setProfile(p || null))
      .catch(() => setProfile(null))
    fetchCompanyJobs()
      .then(async (list) => {
        setJobs(list || [])
        if ((list || []).length > 0) {
          const firstJobId = list[0]._id
          try {
            const apps = await fetchJobApplicants(firstJobId)
            setApplicants(apps || [])
          } catch {
            setApplicants([])
          }
        }
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="container space-y-8 p-6 pb-16">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-800">Company Dashboard</h1>
          <p className="text-gray-600">Welcome back{profile?.companyName ? `, ${profile.companyName}` : ''}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="border-gray-300 bg-transparent text-gray-600 hover:text-gray-800"
          >
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Link href="/dashboard/company/post-job">
            <Button className="bg-blue-500 text-white hover:bg-blue-600">
              <PlusCircle className="mr-2 h-4 w-4" />
              Post New Job
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-800">{jobs.length}</div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-gray-600"
              >
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
                <path d="M8 14h.01" />
                <path d="M12 14h.01" />
                <path d="M16 14h.01" />
                <path d="M8 18h.01" />
                <path d="M12 18h.01" />
                <path d="M16 18h.01" />
              </svg>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Applicants (latest job)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-800">{applicants.length}</div>
              <Users className="h-5 w-5 text-gray-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Profile Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-800">156</div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-gray-600"
              >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-800">3</div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-gray-600"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-800">Recent Job Postings</CardTitle>
            <CardDescription className="text-gray-600">Your recently posted jobs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.isArray(jobs) && jobs.slice(0, 3).map((job) => (
                <div key={job._id} className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-800">{job.title}</h4>
                    <div className="mt-1 flex flex-wrap gap-2">
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800">{job.employmentType}</span>
                      {job.location && <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-800">{job.location}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">
                      {Array.isArray(job.applicants) ? job.applicants.length : 0} Applicants
                    </span>
                    <Link href={`/dashboard/company/jobs/${job._id}`}>
                      <Button size="sm" className="text-gray-600 hover:text-gray-800">
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
              <div className="pt-2 text-center">
                <Link href="/dashboard/company/jobs">
                  <Button className="text-blue-500">
                    View all jobs
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-800">Recent Applicants</CardTitle>
            <CardDescription className="text-gray-600">Candidates who recently applied to your jobs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {applicants.map((app) => (
                <div key={app._id} className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-full">
                      <img
                        src={(app.employeeId?.profilePicture) || "/placeholder.svg"}
                        alt={(app.employeeId?.name) || 'Applicant'}
                        className="h-full w-full object-cover"
                        width={40}
                        height={40}
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{app.employeeId?.name || 'Applicant'}</h4>
                      <p className="text-sm text-gray-600">Applied for {app.jobId?.title || ''}</p>
                      <p className="text-xs text-gray-600">
                        Applied on {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : '—'}
                      </p>
                    </div>
                  </div>
                  <Link href={`/dashboard/company/applicants`}>
                    <Button size="sm" className="text-gray-600 hover:text-gray-800">
                      Review
                    </Button>
                  </Link>
                </div>
              ))}
              <div className="pt-2 text-center">
                <Link href="/dashboard/company/applicants">
                  <Button className="text-blue-500">
                    View all applicants
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
