import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockJobs } from "@/lib/mock-data"

export function FeaturedJobs() {
  // Display only the first 4 jobs
  const featuredJobs = mockJobs.slice(0, 4)

  return (
    <section className="bg-gray-50 py-16">
      <div className="container px-4 sm:px-8">
        <div className="mb-10 text-center">
          <h2 className="mb-2 text-3xl font-bold">Featured Jobs</h2>
          <p className="text-muted-foreground">Explore our handpicked selection of top opportunities</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredJobs.map((job) => (
            <Card key={job.id} className="flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <img
                    src={job.company.logo || "/placeholder.svg"}
                    alt={job.company.name}
                    className="h-8 w-8 rounded"
                    width={32}
                    height={32}
                  />
                  <div>
                    <h3 className="font-semibold">{job.title}</h3>
                    <p className="text-sm text-muted-foreground">{job.company.name}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 pb-2">
                <div className="mb-2 flex flex-wrap gap-2">
                  <Badge variant="secondary">{job.type}</Badge>
                  <Badge variant="outline">{job.location}</Badge>
                </div>
                <p className="line-clamp-3 text-sm text-muted-foreground">{job.description.substring(0, 100)}...</p>
              </CardContent>
              <CardFooter>
                <Link href={`/jobs/${job.id}`} className="w-full">
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
