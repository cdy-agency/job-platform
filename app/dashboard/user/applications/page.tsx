import Link from "next/link"
import { ArrowUpDown, Download, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockApplications, mockJobs, mockUsers } from "@/lib/mock-data"

export default function UserApplicationsPage() {
  // Mock data for the current user
  const currentUser = mockUsers[0]

  // Get user's applications
  const userApplications = mockApplications.filter((app) => app.userId === currentUser.id)

  return (
    <div className="container space-y-6 p-6 pb-16">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-800">My Applications</h1>
        <p className="text-gray-600">Track and manage your job applications</p>
      </div>

      <Card className="border-gray-200">
        <CardHeader>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <CardTitle className="text-gray-800">All Applications</CardTitle>
              <CardDescription className="text-gray-600">
                You have applied to {userApplications.length} jobs
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-gray-300 bg-transparent text-gray-800">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Sort
              </Button>
              <Button variant="outline" size="sm" className="border-gray-300 bg-transparent text-gray-800">
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {userApplications.length > 0 ? (
            <div className="space-y-6">
              {userApplications.map((app) => {
                const job = mockJobs.find((j) => j.id === app.jobId)
                if (!job) return null

                return (
                  <div
                    key={app.id}
                    className="flex flex-col justify-between gap-4 rounded-lg border border-gray-200 p-4 sm:flex-row sm:items-center"
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 overflow-hidden rounded">
                        <img
                          src={job.company.logo || "/placeholder.svg"}
                          alt={job.company.name}
                          className="h-full w-full object-cover"
                          width={48}
                          height={48}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{job.title}</h3>
                        <p className="text-sm text-gray-600">{job.company.name}</p>
                        <div className="mt-1 flex flex-wrap gap-2">
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-800">
                            {job.location}
                          </span>
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-800">{job.employmentType}</span>
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-800">
                            Applied on {new Date(app.appliedDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs ${
                          app.status === "Applied"
                            ? "bg-blue-100 text-blue-800"
                            : app.status === "Interview"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {app.status}
                      </span>
                      <div className="flex gap-2">
                        <Button className="text-gray-600 hover:text-gray-800">
                          <Download className="mr-1 h-4 w-4" />
                          Resume
                        </Button>
                        <Link href={`/jobs/${job.id}`}>
                          <Button className="text-gray-600 hover:text-gray-800">
                            <Eye className="mr-1 h-4 w-4" />
                            View Job
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-8 text-center">
              <h3 className="mb-2 text-lg font-semibold text-gray-800">No applications yet</h3>
              <p className="mb-6 text-sm text-gray-600">
                You haven't applied to any jobs yet. Start exploring opportunities!
              </p>
              <Link href="/jobs">
                <Button className="bg-blue-500 text-white hover:bg-blue-600">Browse Jobs</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
