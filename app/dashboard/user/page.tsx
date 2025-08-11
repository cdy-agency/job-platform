import Link from "next/link"
import { Bell, Briefcase, Clock, Eye, FileText, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { employeeApi } from "@/lib/api"
import { Application, Job } from "@/lib/types"
import { getAuth } from "@/hooks/useAuth"

export default function UserDashboardPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([])
  const [userName, setUserName] = useState<string>("")

  useEffect(() => {
    const { token, user } = getAuth()
    setUserName(user?.email || "")
    const load = async () => {
      try {
        if (!token) return
        const [apps, jobs] = await Promise.all([
          employeeApi.applications(token),
          employeeApi.listJobs(token),
        ])
        setApplications(apps)
        setRecommendedJobs(jobs.slice(0, 3))
      } catch {
        setApplications([])
        setRecommendedJobs([])
      }
    }
    load()
  }, [])

  return (
    <div className="container space-y-8 p-6 pb-16">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {userName}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="border-gray-300 bg-transparent text-gray-600 hover:text-gray-800"
          >
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Link href="/jobs">
            <Button className="bg-blue-500 text-white hover:bg-blue-600">
              <Search className="mr-2 h-4 w-4" />
              Find Jobs
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-800">{applications.length}</div>
              <Briefcase className="h-5 w-5 text-gray-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Saved Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-800">0</div>
              <FileText className="h-5 w-5 text-gray-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Profile Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-800">—</div>
              <Eye className="h-5 w-5 text-gray-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Days Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-800">—</div>
              <Clock className="h-5 w-5 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-800">Recent Applications</CardTitle>
            <CardDescription className="text-gray-600">Your recently submitted job applications</CardDescription>
          </CardHeader>
          <CardContent>
            {applications.length > 0 ? (
              <div className="space-y-4">
                {applications.map((app) => {
                  const job = (typeof app.jobId === "object" ? (app.jobId as Job) : undefined)
                  if (!job) return null

                  const company = typeof job.companyId === "object" ? job.companyId : undefined

                  return (
                    <div key={app._id} className="flex items-center justify-between">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 overflow-hidden rounded">
                          <img
                            src={(company && company.logo) || "/placeholder.svg"}
                            alt={company?.companyName || "Company"}
                            className="h-full w-full object-cover"
                            width={40}
                            height={40}
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">{job.title}</h4>
                          <p className="text-sm text-gray-600">{company?.companyName}</p>
                          <p className="text-xs text-gray-600">Applied on {new Date(app.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-800">{app.status}</span>
                    </div>
                  )
                })}
                <div className="pt-2 text-center">
                  <Link href="/dashboard/user/applications">
                    <Button variant="link" className="text-blue-500">
                      View all applications
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-8 text-center">
                <h3 className="mb-2 text-lg font-semibold text-gray-800">No applications yet</h3>
                <p className="mb-6 text-sm text-gray-600">Start applying to jobs to see your applications here</p>
                <Link href="/jobs">
                  <Button className="bg-blue-500 text-white hover:bg-blue-600">Browse Jobs</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-800">Recommended Jobs</CardTitle>
            <CardDescription className="text-gray-600">Jobs that match your skills and experience</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendedJobs.map((job) => (
                <div key={job._id} className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded">
                      <img
                        src={(typeof job.companyId === "object" && job.companyId.logo) || "/placeholder.svg"}
                        alt={(typeof job.companyId === "object" && job.companyId.companyName) || "Company"}
                        className="h-full w-full object-cover"
                        width={40}
                        height={40}
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{job.title}</h4>
                      <p className="text-sm text-gray-600">
                        {typeof job.companyId === "object" ? job.companyId.companyName : ""}
                      </p>
                      <div className="mt-1 flex gap-2">
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-800">
                          {job.employmentType}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link href={`/jobs/${job._id}`}>
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800">
                      View
                    </Button>
                  </Link>
                </div>
              ))}
              <div className="pt-2 text-center">
                <Link href="/jobs">
                  <Button variant="link" className="text-blue-500">
                    View more jobs
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-800">Complete Your Profile</CardTitle>
          <CardDescription className="text-gray-600">A complete profile helps you stand out to employers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Upload your resume</h4>
                  <p className="text-sm text-gray-600">Add your latest resume to apply for jobs faster</p>
                </div>
              </div>
              <Link href="/dashboard/user/profile">
                <Button variant="outline" className="border-gray-300 bg-transparent text-gray-800">
                  Upload
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Add work experience</h4>
                  <p className="text-sm text-gray-600">Showcase your professional background</p>
                </div>
              </div>
              <Link href="/dashboard/user/profile">
                <Button variant="outline" className="border-gray-300 bg-transparent text-gray-800">
                  Add
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                  <Search className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Set job preferences</h4>
                  <p className="text-sm text-gray-600">Tell us what you're looking for in your next role</p>
                </div>
              </div>
              <Link href="/dashboard/user/settings">
                <Button variant="outline" className="border-gray-300 bg-transparent text-gray-800">
                  Set
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
