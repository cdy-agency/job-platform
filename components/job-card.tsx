import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Calendar, MapPin } from "lucide-react"

interface Job {
  id: string
  title: string
  company: {
    id: string
    name: string
    logo?: string
  }
  location: string
  type: string
  category?: string
  salary: string
  description: string
  postedDate: string
}

interface JobCardProps {
  job: Job
  variant?: "default" | "detailed"
  showPostedDate?: boolean
}

export function JobCard({ job, variant = "default", showPostedDate = false }: JobCardProps) {
  if (variant === "detailed") {
    // Used in the jobs listing page with more information
    return (
      <Card className="overflow-hidden border-gray-200">
        <div className="grid md:grid-cols-[1fr_auto]">
          <CardHeader className="flex flex-row items-start gap-4 space-y-0">
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
              <h3 className="font-semibold text-gray-800">{job.title}</h3>
              <p className="text-sm text-gray-600">{job.company.name}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-800">{job.type}</span>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-800">
                  {job.location}
                </span>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-800">
                  {job.salary}
                </span>
              </div>
            </div>
          </CardHeader>
          {showPostedDate && (
            <CardContent className="hidden md:flex md:items-center md:px-6">
              <p className="text-sm text-gray-600 flex items-center">
                <Calendar className="mr-1 h-3 w-3" />
                Posted {new Date(job.postedDate).toLocaleDateString()}
              </p>
            </CardContent>
          )}
          <CardFooter className="flex justify-between border-t p-4 md:border-l md:border-t-0">
            <Link href={`/jobs/${job.id}`} className="w-full">
              <Button className="w-full bg-blue-500 text-white hover:bg-blue-600">View Details</Button>
            </Link>
          </CardFooter>
        </div>
      </Card>
    )
  }

  // Default variant - compact card used on landing page and featured sections
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4 flex items-center gap-3">
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
          <h3 className="font-semibold text-gray-800">{job.title}</h3>
          <p className="text-sm text-gray-600">{job.company.name}</p>
        </div>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-800">{job.type}</span>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-800 flex items-center">
          <MapPin className="mr-1 h-3 w-3" />
          {job.location}
        </span>
      </div>
      <p className="mb-4 line-clamp-3 text-sm text-gray-600">{job.description}</p>
      {showPostedDate && (
        <p className="mb-4 text-xs text-gray-500 flex items-center">
          <Calendar className="mr-1 h-3 w-3" />
          Posted {new Date(job.postedDate).toLocaleDateString()}
        </p>
      )}
      <Link href={`/jobs/${job.id}`}>
        <Button className="w-full bg-blue-500 text-white hover:bg-blue-600">View Details</Button>
      </Link>
    </div>
  )
}