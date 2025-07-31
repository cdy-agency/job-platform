export function CompanyShowcase() {
  const companies = [
    { name: "Acme Inc", logo: "/placeholder.svg?height=40&width=120" },
    { name: "TechCorp", logo: "/placeholder.svg?height=40&width=120" },
    { name: "Globex", logo: "/placeholder.svg?height=40&width=120" },
    { name: "Initech", logo: "/placeholder.svg?height=40&width=120" },
    { name: "Umbrella Corp", logo: "/placeholder.svg?height=40&width=120" },
    { name: "Stark Industries", logo: "/placeholder.svg?height=40&width=120" },
  ]

  return (
    <section className="bg-gray-50 py-16">
      <div className="container px-4 sm:px-8">
        <div className="mb-10 text-center">
          <h2 className="mb-2 text-3xl font-bold">Trusted by Top Companies</h2>
          <p className="text-muted-foreground">Join thousands of companies that find top talent on our platform</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {companies.map((company) => (
            <div key={company.name} className="flex items-center justify-center">
              <img
                src={company.logo || "/placeholder.svg"}
                alt={company.name}
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
