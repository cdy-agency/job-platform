"use client"

import { Briefcase, Search, UserCheck } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      icon: <Search className="h-10 w-10 text-blue-500" />,
      title: "Search Jobs",
      description: "Browse through thousands of opportunities across various industries and locations.",
    },
    {
      icon: <UserCheck className="h-10 w-10 text-blue-500" />,
      title: "Apply with Ease",
      description: "Create your profile once and apply to multiple positions with just a few clicks.",
    },
    {
      icon: <Briefcase className="h-10 w-10 text-blue-500" />,
      title: "Land Your Dream Job",
      description: "Connect directly with employers and start your new career journey.",
    },
  ]

  return (
    <section className="py-16">
      <div className="container px-4 sm:px-8">
        <div className="mb-10 text-center">
          <h2 className="mb-2 text-3xl font-bold">How It Works</h2>
          <p className="text-muted-foreground">Simple steps to find your next career opportunity</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">{step.icon}</div>
              <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
