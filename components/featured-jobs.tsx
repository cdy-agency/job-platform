"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fetchJobs } from "@/lib/api"

export function FeaturedJobs() {
  const [jobs, setJobs] = useState<any[]>([])

  useEffect(() => {
    fetchJobs()
      .then((list) => setJobs((list || []).slice(0, 4)))
      .catch(() => setJobs([]))
  }, [])

  if (jobs.length === 0) {
    return (
      <section className="bg-gray-50 py-16">
        <div className="container px-4 sm:px-8 text-center">
          <h2 className="mb-2 text-3xl font-bold">Featured Jobs</h2>
          <p className="text-muted-foreground mb-6">No featured jobs available right now</p>
          <Link href="/jobs">
            <Button size="lg">Browse Jobs</Button>
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-gray-50 py-16">
      <div className="container px-4 sm:px-8">
        <div className="mb-10 text-center">
          <h2 className="mb-2 text-3xl font-bold">Featured Jobs</h2>
          <p className="text-muted-foreground">Explore our handpicked selection of top opportunities</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {jobs.map((job: any) => (
            <Card key={job._id} className="flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <img
                    src={job.companyId?.logo || "/placeholder.svg"}
                    alt={job.companyId?.companyName || 'Company'}
                    className="h-8 w-8 rounded"
                    width={32}
                    height={32}
                  />
                  <div>
                    <h3 className="font-semibold">{job.title}</h3>
                    <p className="text-sm text-muted-foreground">{job.companyId?.companyName || 'Company'}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 pb-2">
                <div className="mb-2 flex flex-wrap gap-2">
                  <Badge variant="secondary">{job.employmentType}</Badge>
                  {job.location && <Badge variant="outline">{job.location}</Badge>}
                </div>
                <p className="line-clamp-3 text-sm text-muted-foreground">{(job.description || '').slice(0, 100)}...</p>
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
