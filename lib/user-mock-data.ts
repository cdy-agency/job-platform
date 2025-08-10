// Extended User interface
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  profileImage?: string;
  joinDate: string;
  status: "active" | "inactive";
  // Extended fields
  title: string;
  bio: string;
  company: string;
  experience: string;
  education: Education[];
  skills: string[];
  documents: Document[];
  projects: Project[];
  socialLinks: SocialLinks;
  rating: number;
  completedProjects: number;
  languages: string[];
  availability: "available" | "busy" | "unavailable";
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
  description: string;
}

export interface Document {
  id: string;
  name: string;
  type: "cv" | "certificate" | "portfolio" | "other";
  url: string;
  uploadDate: string;
  size: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  status: "completed" | "in-progress" | "planned";
  image?: string;
}

export interface SocialLinks {
  website?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
}

// Extended mock data
export const mockUsers: User[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "0786664545",
    location: "Western Province",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    joinDate: "2024-01-15",
    status: "active",
    title: "Senior Full Stack Developer",
    bio: "Passionate full-stack developer with 5+ years of experience building scalable web applications. I love creating user-friendly interfaces and robust backend systems.",
    company: "TechCorp Rwanda",
    experience: "5+ years",
    education: [
      {
        degree: "Bachelor of Computer Science",
        institution: "University of Rwanda",
        year: "2019",
        description: "Specialized in Software Engineering and Database Systems"
      },
      {
        degree: "Full Stack Web Development Bootcamp",
        institution: "Rwanda Coding Academy",
        year: "2020",
        description: "Intensive 6-month program covering modern web technologies"
      }
    ],
    skills: ["React", "Node.js", "TypeScript", "Python", "PostgreSQL", "AWS", "Docker"],
    documents: [
      {
        id: "cv1",
        name: "Sarah_Johnson_CV_2024.pdf",
        type: "cv",
        url: "/documents/sarah_cv.pdf",
        uploadDate: "2024-01-10",
        size: "2.3 MB"
      },
      {
        id: "cert1",
        name: "AWS_Solutions_Architect_Certificate.pdf",
        type: "certificate",
        url: "/documents/aws_cert.pdf",
        uploadDate: "2024-02-15",
        size: "1.1 MB"
      },
      {
        id: "portfolio1",
        name: "Portfolio_Projects_2024.pdf",
        type: "portfolio",
        url: "/documents/portfolio.pdf",
        uploadDate: "2024-03-01",
        size: "5.7 MB"
      }
    ],
    projects: [
      {
        id: "p1",
        title: "E-commerce Platform",
        description: "Built a full-featured e-commerce platform with React, Node.js, and PostgreSQL",
        technologies: ["React", "Node.js", "PostgreSQL", "Stripe"],
        status: "completed",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop"
      },
      {
        id: "p2",
        title: "Task Management App",
        description: "Collaborative task management application with real-time updates",
        technologies: ["React", "Socket.io", "MongoDB"],
        status: "in-progress"
      }
    ],
    socialLinks: {
      website: "https://sarahjohnson.dev",
      github: "https://github.com/sarahjohnson",
      linkedin: "https://linkedin.com/in/sarahjohnson",
      twitter: "https://twitter.com/sarahdev"
    },
    rating: 4.8,
    completedProjects: 23,
    languages: ["English", "Kinyarwanda", "French"],
    availability: "available"
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@email.com",
    phone: "0786664546",
    location: "Eastern Province",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    joinDate: "2024-02-20",
    status: "active",
    title: "DevOps Engineer",
    bio: "Experienced DevOps engineer specializing in cloud infrastructure and automation. I help teams deploy faster and more reliably.",
    company: "CloudTech Solutions",
    experience: "6+ years",
    education: [
      {
        degree: "Master of Information Technology",
        institution: "Carnegie Mellon University",
        year: "2018",
        description: "Focused on Cloud Computing and Distributed Systems"
      }
    ],
    skills: ["AWS", "Docker", "Kubernetes", "Terraform", "Jenkins", "Python", "Bash"],
    documents: [
      {
        id: "cv2",
        name: "Michael_Chen_Resume_2024.pdf",
        type: "cv",
        url: "/documents/michael_cv.pdf",
        uploadDate: "2024-02-18",
        size: "1.9 MB"
      },
      {
        id: "cert2",
        name: "AWS_DevOps_Professional_Certificate.pdf",
        type: "certificate",
        url: "/documents/aws_devops_cert.pdf",
        uploadDate: "2024-03-10",
        size: "1.5 MB"
      }
    ],
    projects: [
      {
        id: "p3",
        title: "CI/CD Pipeline Automation",
        description: "Automated deployment pipeline reducing deployment time by 80%",
        technologies: ["Jenkins", "Docker", "AWS", "Terraform"],
        status: "completed"
      }
    ],
    socialLinks: {
      github: "https://github.com/michaelchen",
      linkedin: "https://linkedin.com/in/michaelchen"
    },
    rating: 4.9,
    completedProjects: 31,
    languages: ["English", "Mandarin", "Kinyarwanda"],
    availability: "busy"
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@email.com",
    phone: "0786664547",
    location: "Northern Province",
    profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    joinDate: "2024-01-08",
    status: "active",
    title: "UX/UI Designer",
    bio: "Creative designer focused on creating intuitive and beautiful user experiences. I believe great design should be both functional and delightful.",
    company: "Design Studio Rwanda",
    experience: "4+ years",
    education: [
      {
        degree: "Bachelor of Fine Arts",
        institution: "Rwanda Institute of Art",
        year: "2020",
        description: "Focused on Digital Design and User Experience"
      }
    ],
    skills: ["Figma", "Adobe Creative Suite", "Sketch", "Prototyping", "User Research"],
    documents: [
      {
        id: "cv3",
        name: "Emily_Rodriguez_CV_2024.pdf",
        type: "cv",
        url: "/documents/emily_cv.pdf",
        uploadDate: "2024-01-05",
        size: "1.8 MB"
      },
      {
        id: "portfolio3",
        name: "Design_Portfolio_2024.pdf",
        type: "portfolio",
        url: "/documents/emily_portfolio.pdf",
        uploadDate: "2024-02-20",
        size: "12.4 MB"
      }
    ],
    projects: [
      {
        id: "p4",
        title: "Mobile Banking App Design",
        description: "Complete UX/UI design for a mobile banking application",
        technologies: ["Figma", "Principle", "Adobe XD"],
        status: "completed",
        image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=200&fit=crop"
      }
    ],
    socialLinks: {
      website: "https://emilydesigns.com",
      linkedin: "https://linkedin.com/in/emilyrodriguez"
    },
    rating: 4.9,
    completedProjects: 18,
    languages: ["English", "Spanish", "Kinyarwanda"],
    availability: "available"
  },
  {
    id: "4",
    name: "David Uwimana",
    email: "david.uwimana@email.com",
    phone: "0786664548",
    location: "Kigali City",
    profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    joinDate: "2024-03-12",
    status: "active",
    title: "Data Scientist",
    bio: "Data scientist with expertise in machine learning and statistical analysis. I turn complex data into actionable insights.",
    company: "Analytics Pro Rwanda",
    experience: "3+ years",
    education: [
      {
        degree: "Master of Data Science",
        institution: "University of Rwanda",
        year: "2021",
        description: "Specialized in Machine Learning and Statistical Modeling"
      }
    ],
    skills: ["Python", "R", "TensorFlow", "SQL", "Tableau", "Machine Learning", "Statistics"],
    documents: [
      {
        id: "cv4",
        name: "David_Uwimana_CV_2024.pdf",
        type: "cv",
        url: "/documents/david_cv.pdf",
        uploadDate: "2024-03-10",
        size: "2.1 MB"
      },
      {
        id: "cert4",
        name: "Google_Data_Analytics_Certificate.pdf",
        type: "certificate",
        url: "/documents/google_analytics_cert.pdf",
        uploadDate: "2024-03-15",
        size: "1.3 MB"
      }
    ],
    projects: [
      {
        id: "p5",
        title: "Sales Prediction Model",
        description: "Machine learning model to predict sales trends with 95% accuracy",
        technologies: ["Python", "TensorFlow", "Pandas", "Scikit-learn"],
        status: "completed"
      }
    ],
    socialLinks: {
      github: "https://github.com/daviduwimana",
      linkedin: "https://linkedin.com/in/daviduwimana"
    },
    rating: 4.7,
    completedProjects: 15,
    languages: ["English", "Kinyarwanda", "French"],
    availability: "available"
  }
];