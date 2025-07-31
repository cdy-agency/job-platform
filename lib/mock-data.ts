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
      locations: ["New York", "Remote"],
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
      locations: ["San Francisco", "Los Angeles", "Remote"],
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
    location: "New York, NY",
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
export const mockJobs = [
  {
    id: "job1",
    title: "Frontend Developer",
    company: {
      id: "company1",
      name: "Acme Inc",
      logo: "/placeholder.svg?height=40&width=40",
    },
    location: "New York, NY",
    type: "Full-time",
    category: "Engineering",
    salary: "$80,000 - $100,000",
    description:
      "We are looking for a skilled Frontend Developer to join our team. You will be responsible for building responsive web applications using React and TypeScript.",
    requirements: [
      "3+ years of experience with React",
      "Strong knowledge of JavaScript/TypeScript",
      "Experience with responsive design",
      "Familiarity with modern frontend tools",
    ],
    responsibilities: [
      "Develop new user-facing features",
      "Build reusable components and libraries",
      "Optimize applications for maximum speed and scalability",
      "Collaborate with backend developers and designers",
    ],
    postedDate: "2023-07-15",
    applicationDeadline: "2023-08-15",
    applicants: ["user1"],
  },
  {
    id: "job2",
    title: "UX Designer",
    company: {
      id: "company2",
      name: "TechCorp",
      logo: "/placeholder.svg?height=40&width=40",
    },
    location: "San Francisco, CA",
    type: "Full-time",
    category: "Design",
    salary: "$90,000 - $110,000",
    description:
      "TechCorp is seeking a talented UX Designer to create amazing user experiences. You will work on designing intuitive interfaces for web and mobile applications.",
    requirements: [
      "4+ years of UX design experience",
      "Proficiency with design tools like Figma and Adobe XD",
      "Portfolio demonstrating UX process and solutions",
      "Experience conducting user research",
    ],
    responsibilities: [
      "Create wireframes, prototypes, and user flows",
      "Conduct user research and usability testing",
      "Collaborate with product managers and developers",
      "Iterate on designs based on user feedback",
    ],
    postedDate: "2023-07-10",
    applicationDeadline: "2023-08-10",
    applicants: ["user2"],
  },
  {
    id: "job3",
    title: "Backend Developer",
    company: {
      id: "company2",
      name: "TechCorp",
      logo: "/placeholder.svg?height=40&width=40",
    },
    location: "Remote",
    type: "Full-time",
    category: "Engineering",
    salary: "$95,000 - $120,000",
    description:
      "We're looking for a Backend Developer to build and maintain our server-side applications. You will work with Node.js, Express, and MongoDB.",
    requirements: [
      "3+ years of experience with Node.js",
      "Knowledge of MongoDB or similar NoSQL databases",
      "Experience with RESTful APIs",
      "Understanding of server-side templating languages",
    ],
    responsibilities: [
      "Design and implement backend services",
      "Optimize application performance",
      "Ensure data security and protection",
      "Collaborate with frontend developers",
    ],
    postedDate: "2023-07-05",
    applicationDeadline: "2023-08-05",
    applicants: ["user1"],
  },
  {
    id: "job4",
    title: "Product Manager",
    company: {
      id: "company1",
      name: "Acme Inc",
      logo: "/placeholder.svg?height=40&width=40",
    },
    location: "Chicago, IL",
    type: "Full-time",
    category: "Product",
    salary: "$110,000 - $130,000",
    description:
      "Acme Inc is looking for a Product Manager to lead our product development efforts. You will be responsible for defining product vision, strategy, and roadmap.",
    requirements: [
      "5+ years of product management experience",
      "Strong analytical and problem-solving skills",
      "Experience with agile methodologies",
      "Excellent communication and leadership skills",
    ],
    responsibilities: [
      "Define product vision and strategy",
      "Create and prioritize product backlog",
      "Work with engineering, design, and marketing teams",
      "Analyze market trends and competition",
    ],
    postedDate: "2023-06-28",
    applicationDeadline: "2023-07-28",
    applicants: [],
  },
  {
    id: "job5",
    title: "Data Scientist",
    company: {
      id: "company2",
      name: "TechCorp",
      logo: "/placeholder.svg?height=40&width=40",
    },
    location: "Boston, MA",
    type: "Full-time",
    category: "Data Science",
    salary: "$100,000 - $140,000",
    description:
      "TechCorp is seeking a Data Scientist to analyze complex data sets and extract valuable insights. You will work with machine learning models and statistical analysis.",
    requirements: [
      "Master's degree in Computer Science, Statistics, or related field",
      "Experience with Python, R, and SQL",
      "Knowledge of machine learning algorithms",
      "Experience with data visualization tools",
    ],
    responsibilities: [
      "Analyze large datasets to extract insights",
      "Develop machine learning models",
      "Create data visualizations and reports",
      "Collaborate with product and engineering teams",
    ],
    postedDate: "2023-06-20",
    applicationDeadline: "2023-07-20",
    applicants: [],
  },
  {
    id: "job6",
    title: "DevOps Engineer",
    company: {
      id: "company1",
      name: "Acme Inc",
      logo: "/placeholder.svg?height=40&width=40",
    },
    location: "Remote",
    type: "Full-time",
    category: "Engineering",
    salary: "$90,000 - $120,000",
    description:
      "We are looking for a DevOps Engineer to help us build and maintain our cloud infrastructure. You will work with AWS, Docker, and Kubernetes.",
    requirements: [
      "3+ years of experience with AWS or similar cloud platforms",
      "Experience with Docker and Kubernetes",
      "Knowledge of CI/CD pipelines",
      "Familiarity with infrastructure as code tools",
    ],
    responsibilities: [
      "Design and implement cloud infrastructure",
      "Automate deployment processes",
      "Monitor system performance and security",
      "Troubleshoot and resolve infrastructure issues",
    ],
    postedDate: "2023-06-15",
    applicationDeadline: "2023-07-15",
    applicants: [],
  },
  {
    id: "job7",
    title: "Marketing Specialist",
    company: {
      id: "company1",
      name: "Acme Inc",
      logo: "/placeholder.svg?height=40&width=40",
    },
    location: "New York, NY",
    type: "Part-time",
    category: "Marketing",
    salary: "$50,000 - $70,000",
    description:
      "Acme Inc is looking for a Marketing Specialist to help grow our brand presence. You will be responsible for creating and executing marketing campaigns.",
    requirements: [
      "2+ years of marketing experience",
      "Knowledge of digital marketing channels",
      "Experience with social media marketing",
      "Strong writing and communication skills",
    ],
    responsibilities: [
      "Create and execute marketing campaigns",
      "Manage social media accounts",
      "Analyze marketing metrics",
      "Collaborate with design and product teams",
    ],
    postedDate: "2023-06-10",
    applicationDeadline: "2023-07-10",
    applicants: [],
  },
  {
    id: "job8",
    title: "Customer Support Representative",
    company: {
      id: "company2",
      name: "TechCorp",
      logo: "/placeholder.svg?height=40&width=40",
    },
    location: "Remote",
    type: "Part-time",
    category: "Customer Service",
    salary: "$40,000 - $55,000",
    description:
      "TechCorp is seeking a Customer Support Representative to assist our customers with product inquiries and issues. You will be the first point of contact for our customers.",
    requirements: [
      "1+ years of customer service experience",
      "Excellent communication skills",
      "Problem-solving abilities",
      "Patience and empathy",
    ],
    responsibilities: [
      "Respond to customer inquiries via email, chat, and phone",
      "Troubleshoot product issues",
      "Document customer feedback",
      "Escalate complex issues to the appropriate teams",
    ],
    postedDate: "2023-06-05",
    applicationDeadline: "2023-07-05",
    applicants: [],
  },
]

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
export function getJobsByType(type: string) {
  return mockJobs.filter((job) => job.type === type)
}

// Helper function to get jobs by location
export function getJobsByLocation(location: string) {
  return mockJobs.filter((job) => job.location.includes(location))
}
