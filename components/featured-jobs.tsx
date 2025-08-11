import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { Job } from "@/lib/types"
import { employeeApi } from "@/lib/api"
import { getAuth } from "@/hooks/useAuth"

export function FeaturedJobs() {
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([])
  useEffect(() => {
    const { token } = getAuth()
    const load = async () => {
      try {
        if (token) {
          const jobs = await employeeApi.listJobs(token)
          setFeaturedJobs(jobs.slice(0, 4))
        } else {
          const jobs = await fetch("/api/employee/jobs").then((r) => r.json()).catch(() => [])
          setFeaturedJobs((jobs as Job[]).slice(0, 4))
        }
      } catch {
        setFeaturedJobs([])
      }
    }
    load()
  }, [])

  return (
    <section className="bg-gray-50 py-16">
      <div className="container px-4 sm:px-8">
        <div className="mb-10 text-center">
          <h2 className="mb-2 text-3xl font-bold">Featured Jobs</h2>
          <p className="text-muted-foreground">Explore our handpicked selection of top opportunities</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredJobs.map((job) => (
            <Card key={job._id} className="flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <img
                    src={(typeof job.companyId === "object" && job.companyId.logo) || "/placeholder.svg"}
                    alt={(typeof job.companyId === "object" && job.companyId.companyName) || "Company"}
                    className="h-8 w-8 rounded"
                    width={32}
                    height={32}
                  />
                  <div>
                    <h3 className="font-semibold">{job.title}</h3>
                    <p className="text-sm text-muted-foreground">{typeof job.companyId === "object" ? job.companyId.companyName : ""}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 pb-2">
                <div className="mb-2 flex flex-wrap gap-2">
                  <Badge variant="secondary">{job.employmentType}</Badge>
                </div>
                <p className="line-clamp-3 text-sm text-muted-foreground">{job.description.substring(0, 100)}...</p>
              </CardContent>
              <CardFooter>
                <Link href={`/jobs/${job._id}`} className="w-full">
                  <Button variant="outline" className="w-full bg-transparent">
                    View Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/jobs">
            <Button size="lg">View All Jobs</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
