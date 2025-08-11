// Mock data for users (job seekers)
export const mockUsers = [
  {
    id: "user1",
    name: "John Doe",
    email: "john@example.com",
    role: "user",
    profilePicture: "/placeholder.svg?height=100&width=100",
    applications: ["app1", "app3"],
    savedJobs: ["job2", "job4"],
    resume: "John Doe Resume.pdf",
    skills: ["JavaScript", "React", "Node.js"],
    experience: [
      {
        title: "Frontend Developer",
        company: "Tech Solutions Inc.",
        duration: "2020 - Present",
        description: "Developing responsive web applications using React and TypeScript.",
      },
      {
        title: "Web Developer",
        company: "Digital Agency",
        duration: "2018 - 2020",
        description: "Created websites and web applications for various clients.",
      },
    ],
    education: [
      {
        degree: "Bachelor of Science in Computer Science",
        institution: "University of Technology",
        year: "2014 - 2018",
      },
    ],
    preferences: {
      jobTypes: ["Full-time", "Remote"],
      locations: ["Western", "Remote"],
      salaryRange: "$80,000 - $120,000",
      notifications: {
        email: true,
        jobAlerts: true,
        applicationUpdates: true,
        marketingEmails: false,
      },
    },
  },
  {
    id: "user2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "user",
    profilePicture: "/placeholder.svg?height=100&width=100",
    applications: ["app2"],
    savedJobs: ["job1", "job5"],
    resume: "Jane Smith Resume.pdf",
    skills: ["UX Design", "Figma", "Adobe XD"],
    experience: [
      {
        title: "UX Designer",
        company: "Creative Design Studio",
        duration: "2019 - Present",
        description: "Designing user experiences for web and mobile applications.",
      },
      {
        title: "Graphic Designer",
        company: "Print Media Ltd.",
        duration: "2017 - 2019",
        description: "Created visual concepts for various print and digital media.",
      },
    ],
    education: [
      {
        degree: "Bachelor of Fine Arts in Design",
        institution: "Art Institute",
        year: "2013 - 2017",
      },
    ],
    preferences: {
      jobTypes: ["Full-time", "Contract"],
      locations: ["Eastern", "Remote"],
      salaryRange: "$90,000 - $130,000",
      notifications: {
        email: true,
        jobAlerts: true,
        applicationUpdates: true,
        marketingEmails: true,
      },
    },
  },
]

// Mock data for companies
export const mockCompanies = [
  {
    id: "company1",
    name: "Acme Inc",
    email: "hr@acme.com",
    role: "company",
    profilePicture: "/placeholder.svg?height=100&width=100",
    logo: "/placeholder.svg?height=40&width=40",
    location: "Southern",
    industry: "Technology",
    description: "A leading technology company specializing in innovative solutions.",
    website: "https://acme.example.com",
    registrationNumber: "ACM123456789",
    contactPerson: "Robert Johnson",
    phoneNumber: "+1 (555) 123-4567",
    verificationDocuments: ["business_license.pdf", "tax_id.pdf"],
    postedJobs: ["job1", "job4", "job6"],
    team: [
      {
        name: "Robert Johnson",
        position: "HR Manager",
        email: "robert@acme.com",
      },
      {
        name: "Sarah Williams",
        position: "Talent Acquisition",
        email: "sarah@acme.com",
      },
    ],
    settings: {
      notifications: {
        email: true,
        newApplications: true,
        marketingEmails: false,
      },
      hiringWorkflow: {
        autoScreening: true,
        requireCoverLetter: true,
        sendAutomaticRejections: false,
      },
    },
  },
  {
    id: "company2",
    name: "TechCorp",
    email: "careers@techcorp.com",
    role: "company",
    profilePicture: "/placeholder.svg?height=100&width=100",
    logo: "/placeholder.svg?height=40&width=40",
    location: "San Francisco, CA",
    industry: "Software",
    description: "Building the next generation of software solutions.",
    website: "https://techcorp.example.com",
    registrationNumber: "TEC987654321",
    contactPerson: "Michael Brown",
    phoneNumber: "+1 (555) 987-6543",
    verificationDocuments: ["incorporation_certificate.pdf", "business_registration.pdf"],
    postedJobs: ["job2", "job3", "job5"],
    team: [
      {
        name: "Michael Brown",
        position: "Recruiting Lead",
        email: "michael@techcorp.com",
      },
      {
        name: "Emily Davis",
        position: "HR Specialist",
        email: "emily@techcorp.com",
      },
    ],
    settings: {
      notifications: {
        email: true,
        newApplications: true,
        marketingEmails: true,
      },
      hiringWorkflow: {
        autoScreening: false,
        requireCoverLetter: false,
        sendAutomaticRejections: true,
      },
    },
  },
]

// Mock data for jobs
// Updated mock data to match JobTypes interface
export const mockJobs = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: {
      id: "company-1",
      name: "TechCorp Inc.",
      logo: "/api/placeholder/50/50"
    },
    location: "Northern",
    employmentType: "full-time", // Changed from 'type' to 'employmentType'
    category: "Frontend Development",
    salary: "80,000 - 120,000",
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
    skills: ["React", "TypeScript", "JavaScript", "CSS", "HTML"], // Added skills array
    experience: "3-5 years", // Added experience field
    image: "/api/placeholder/400/200", // Added image field
    featured: true, // Added featured field
    postedDate: "2024-01-15",
    applicationDeadline: "2024-02-15",
    applicants: ["user1", "user2", "user3"]
  },
  {
    id: "2",
    title: "Backend Engineer",
    company: {
      id: "company-2",
      name: "DataFlow Solutions",
      logo: "/api/placeholder/50/50"
    },
    location: "San Francisco, CA",
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
    applicants: ["user4", "user5"]
  },
  {
    id: "3",
    title: "UI/UX Designer",
    company: {
      id: "company-3",
      name: "Creative Studios",
      logo: "/api/placeholder/50/50"
    },
    location: "Remote",
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
    applicants: ["user6"]
  }
];

// Mock data for applications
export const mockApplications = [
  {
    id: "app1",
    userId: "user1",
    jobId: "job1",
    status: "Applied",
    appliedDate: "2023-07-16",
    resume: "John Doe Resume.pdf",
    coverLetter:
      "I am excited to apply for the Frontend Developer position at Acme Inc. With my 3+ years of experience in React and TypeScript, I believe I would be a great fit for your team. I have worked on various responsive web applications and have a strong understanding of modern frontend tools and practices. I am particularly interested in joining Acme Inc because of your innovative approach to technology solutions and your commitment to creating high-quality products. I look forward to the opportunity to contribute to your team and help build amazing user experiences.",
  },
  {
    id: "app2",
    userId: "user2",
    jobId: "job2",
    status: "Interview",
    appliedDate: "2023-07-12",
    resume: "Jane Smith Resume.pdf",
    coverLetter:
      "I am writing to express my interest in the UX Designer role at TechCorp. As a UX Designer with 4+ years of experience, I have a passion for creating intuitive and engaging user experiences. My portfolio demonstrates my ability to conduct user research, create wireframes and prototypes, and iterate on designs based on user feedback. I am particularly drawn to TechCorp's mission of building the next generation of software solutions, and I believe my skills and experience would make me a valuable addition to your team. I am excited about the opportunity to contribute to your innovative products.",
  },
  {
    id: "app3",
    userId: "user1",
    jobId: "job3",
    status: "Rejected",
    appliedDate: "2023-07-06",
    resume: "John Doe Resume.pdf",
    coverLetter:
      "I am applying for the Backend Developer position at TechCorp. While my primary experience is in frontend development, I have been expanding my skills in backend technologies, including Node.js, Express, and MongoDB. I am confident that my strong foundation in JavaScript and my experience working with RESTful APIs would allow me to quickly become a productive member of your backend team. I am eager to continue growing my backend development skills and believe that TechCorp would provide an excellent environment for this growth.",
  },
]

// Helper function to get job by ID
export function getJobById(id: string) {
  return mockJobs.find((job) => job.id === id)
}

// Helper function to get company by ID
export function getCompanyById(id: string) {
  return mockCompanies.find((company) => company.id === id)
}

// Helper function to get user by ID
export function getUserById(id: string) {
  return mockUsers.find((user) => user.id === id)
}

// Helper function to get applications by user ID
export function getApplicationsByUserId(userId: string) {
  return mockApplications.filter((app) => app.userId === userId)
}

// Helper function to get applications by job ID
export function getApplicationsByJobId(jobId: string) {
  return mockApplications.filter((app) => app.jobId === jobId)
}

// Helper function to get jobs by company ID
export function getJobsByCompanyId(companyId: string) {
  return mockJobs.filter((job) => job.company.id === companyId)
}

// Helper function to get jobs by category
export function getJobsByCategory(category: string) {
  return mockJobs.filter((job) => job.category === category)
}

// Helper function to get jobs by type
// export function getJobsByType(type: string) {
//   return mockJobs.filter((job) => job.type === type)
// }

// Helper function to get jobs by location
export function getJobsByLocation(location: string) {
  return mockJobs.filter((job) => job.location.includes(location))
}
