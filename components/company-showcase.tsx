"use client"

import { useEffect, useState } from 'react'
import { fetchAdminCompanies } from '@/lib/api'

export function CompanyShowcase() {
  const [companies, setCompanies] = useState<Array<{ companyName: string; logo?: string }>>([])

  useEffect(() => {
    fetchAdminCompanies()
      .then((list) => {
        const approved = (list || []).filter((c: any) => c.isApproved)
        setCompanies(approved.map((c: any) => ({ companyName: c.companyName, logo: c.logo })))
      })
      .catch(() => setCompanies([]))
  }, [])

  const fallback = [
    { companyName: "Acme Inc", logo: "/placeholder.svg?height=40&width=120" },
    { companyName: "TechCorp", logo: "/placeholder.svg?height=40&width=120" },
  ]

  const display = companies.length > 0 ? companies : fallback

  return (
    <section className="bg-gray-50 py-16">
      <div className="container px-4 sm:px-8">
        <div className="mb-10 text-center">
          <h2 className="mb-2 text-3xl font-bold">Trusted by Top Companies</h2>
          <p className="text-muted-foreground">Join thousands of companies that find top talent on our platform</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {display.map((company) => (
            <div key={company.companyName} className="flex items-center justify-center">
              <img
                src={company.logo || "/placeholder.svg"}
                alt={company.companyName}
                className="h-10 w-auto grayscale transition-all hover:grayscale-0"
                width={120}
                height={40}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
