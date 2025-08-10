export interface CompanyTypes {
  id: string;
  name: string;
  logo: string;
}

export interface JobTypes {
  id: string;
  title: string;
  company: {
    id: string;
    name: string;
    logo: string;
  };
  companyId: string;
  location: string;
  employmentType: string;
  category: string;
  salary: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  skills: string[];
  experience: string;
  image: string;
  featured: boolean;
  postedDate: string;
  applicationDeadline: string;
  applicants: string[];
  createdAt: string;
  updatedAt: string;
}

// types/index.ts

// Frontend-only interfaces (no mongoose dependency)
export interface IUser {
  id: string;
  email: string;
  role: 'employee' | 'company' | 'superadmin';
  createdAt: string;
  updatedAt: string;
}

export interface ICompany extends IUser {
  companyName: string;
  location?: string;
  phoneNumber?: string;
  website?: string;
  logo?: string; // URL to logo
  isApproved: boolean;
}

// Form data interfaces for components
export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  role: 'employee' | 'company';
  companyName?: string;
  location?: string;
  phoneNumber?: string;
  website?: string;
  logo?: File;
}

export interface LoginFormData {
  email: string;
  password: string;
}