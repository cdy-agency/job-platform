export const mockJobs = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: {
      id: "company-1",
      name: "TechCorp Inc.",
      logo: "/api/placeholder/50/50"
    },
    companyId: "company-1", // Added missing property
    location: "Southern Province",
    employmentType: "full-time",
    category: "Frontend Development",
    salary: "$80,000 - $120,000",
    description: "We are looking for a skilled Frontend Developer to join our team and help build amazing user experiences.",
    requirements: [
      "3+ years of React experience",
      "Strong JavaScript/TypeScript skills",
      "Experience with modern build tools"
    ],
    responsibilities: [
      "Develop user interfaces using React",
      "Collaborate with design team",
      "Write clean, maintainable code"
    ],
    skills: ["React", "TypeScript", "JavaScript", "CSS", "HTML"],
    experience: "3-5 years",
    image: "/api/placeholder/400/200",
    featured: true,
    postedDate: "2024-01-15",
    applicationDeadline: "2024-02-15",
    applicants: ["user1", "user2", "user3"],
    createdAt: "2024-01-15T10:00:00Z", // Added missing property
    updatedAt: "2024-01-15T10:00:00Z"  // Added missing property
  },
  {
    id: "2",
    title: "Backend Engineer",
    company: {
      id: "company-2",
      name: "DataFlow Solutions",
      logo: "/api/placeholder/50/50"
    },
    companyId: "company-2", // Added missing property
    location: "Southern Province",
    employmentType: "full-time",
    category: "Backend Development",
    salary: "$90,000 - $140,000",
    description: "Join our backend team to build scalable APIs and microservices that power our platform.",
    requirements: [
      "5+ years of Node.js experience",
      "Database design skills",
      "API development experience"
    ],
    responsibilities: [
      "Design and implement APIs",
      "Optimize database performance",
      "Mentor junior developers"
    ],
    skills: ["Node.js", "PostgreSQL", "MongoDB", "Docker", "AWS"],
    experience: "5+ years",
    image: "/api/placeholder/400/200",
    featured: true,
    postedDate: "2024-01-20",
    applicationDeadline: "2024-02-20",
    applicants: ["user4", "user5"],
    createdAt: "2024-01-20T09:00:00Z", // Added missing property
    updatedAt: "2024-01-20T09:00:00Z"  // Added missing property
  },
  {
    id: "3",
    title: "UI/UX Designer",
    company: {
      id: "company-3",
      name: "Creative Studios",
      logo: "/api/placeholder/50/50"
    },
    companyId: "company-3", // Added missing property
    location: "Western Province",
    employmentType: "contract",
    category: "Design",
    salary: "$70,000 - $95,000",
    description: "We're seeking a talented UI/UX Designer to create beautiful and intuitive user interfaces.",
    requirements: [
      "Portfolio of design work",
      "Figma/Sketch proficiency",
      "User research experience"
    ],
    responsibilities: [
      "Create wireframes and prototypes",
      "Conduct user research",
      "Collaborate with development team"
    ],
    skills: ["Figma", "Sketch", "Adobe XD", "Prototyping", "User Research"],
    experience: "2-4 years",
    image: "/api/placeholder/400/200",
    featured: true,
    postedDate: "2024-01-25",
    applicationDeadline: "2024-02-25",
    applicants: ["user6"],
    createdAt: "2024-01-25T11:00:00Z", // Added missing property
    updatedAt: "2024-01-25T11:00:00Z"  // Added missing property
  }
];

export function getJobsByLocation(location: string) {
  return mockJobs.filter((job) => job.location.includes(location))
}

export function getJobsByCompanyId(companyId: string) {
  return mockJobs.filter((job) => job.company.id === companyId)
}

export function getJobById(id: string) {
  return mockJobs.find((job) => job.id === id)
}

export function getJobsByCategory(category: string) {
  return mockJobs.filter((job) => job.category === category)
}