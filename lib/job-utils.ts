import { mockJobs } from "./mock-data"

export interface Job {
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
  requirements: string[]
  responsibilities: string[]
  postedDate: string
  applicationDeadline: string
  applicants: string[]
}

export interface JobFilters {
  searchTerm?: string
  jobType?: string
  location?: string
  salaryRange?: string
  category?: string
}

export function filterJobs(jobs: Job[], filters: JobFilters): Job[] {
  return jobs.filter((job) => {
    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      const matchesSearch =
        job.title.toLowerCase().includes(searchLower) ||
        job.company.name.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower) ||
        job.location.toLowerCase().includes(searchLower)
      
      if (!matchesSearch) return false
    }

    // Job type filter
    if (filters.jobType && filters.jobType !== "all") {
      if (job.type !== filters.jobType) return false
    }

    // Location filter
    if (filters.location && filters.location !== "all") {
      if (!job.location.toLowerCase().includes(filters.location.toLowerCase())) return false
    }

    // Category filter
    if (filters.category && filters.category !== "all") {
      if (job.category !== filters.category) return false
    }

    // Salary range filter
    if (filters.salaryRange && filters.salaryRange !== "all") {
      const salary = Number.parseInt(job.salary.replace(/[^0-9]/g, ""))
      
      switch (filters.salaryRange) {
        case "under-50k":
          if (salary >= 50000) return false
          break
        case "50k-100k":
          if (salary < 50000 || salary > 100000) return false
          break
        case "over-100k":
          if (salary <= 100000) return false
          break
      }
    }

    return true
  })
}

export function sortJobs(jobs: Job[], sortBy: string): Job[] {
  const sortedJobs = [...jobs]
  
  switch (sortBy) {
    case "newest":
      return sortedJobs.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime())
    case "oldest":
      return sortedJobs.sort((a, b) => new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime())
    case "salary-high":
      return sortedJobs.sort((a, b) => {
        const salaryA = Number.parseInt(a.salary.replace(/[^0-9]/g, ""))
        const salaryB = Number.parseInt(b.salary.replace(/[^0-9]/g, ""))
        return salaryB - salaryA
      })
    case "salary-low":
      return sortedJobs.sort((a, b) => {
        const salaryA = Number.parseInt(a.salary.replace(/[^0-9]/g, ""))
        const salaryB = Number.parseInt(b.salary.replace(/[^0-9]/g, ""))
        return salaryA - salaryB
      })
    case "title":
      return sortedJobs.sort((a, b) => a.title.localeCompare(b.title))
    case "company":
      return sortedJobs.sort((a, b) => a.company.name.localeCompare(b.company.name))
    default:
      return sortedJobs
  }
}

export function getUniqueJobCategories(): string[] {
  const categories = mockJobs.map(job => job.category).filter(Boolean) as string[]
  return Array.from(new Set(categories)).sort()
}

export function getUniqueJobTypes(): string[] {
  const types = mockJobs.map(job => job.type)
  return Array.from(new Set(types)).sort()
}

export function getUniqueLocations(): string[] {
  const locations = mockJobs.map(job => job.location)
  return Array.from(new Set(locations)).sort()
}

export function getJobStats() {
  const total = mockJobs.length
  const categories = getUniqueJobCategories()
  const types = getUniqueJobTypes()
  const locations = getUniqueLocations()
  
  return {
    total,
    categories: categories.length,
    types: types.length,
    locations: locations.length,
    recentJobs: mockJobs.filter(job => {
      const posted = new Date(job.postedDate)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return posted > weekAgo
    }).length
  }
}