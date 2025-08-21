"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="container px-4 sm:px-8">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          <div className="flex flex-col justify-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Find Your Dream Job Today
            </h1>
            <p className="mb-8 text-xl text-muted-foreground">
              Connect with top companies and discover opportunities that match your skills and aspirations.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/register">
                <Button size="lg" className="bg-blue-500 hover:bg-blue-600">
                  Get Started
                </Button>
              </Link>
              <Link href="/jobs">
                <Button size="lg" variant="outline">
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
  )
}
