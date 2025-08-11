export interface EmployeeUser {
  id: string
  name: string
  phoneNumber: string
  dateOfBirth: string
  role: "employee"
}

export interface CompanyUser {
  id: string
  companyName: string,
  location: string
  phoneNumber: string,
  website: string
  logo: string
  role: "company"
  isApproved?: boolean
}

export interface AdminUser {
  id: string
  email: string
  role: "superadmin"
}

export type AuthUser = EmployeeUser | CompanyUser | AdminUser

export type RegisterEmployeeRequest ={
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
  dateOfBirth: string,
  phoneNumber: string,
}

export type RegisterCompanyRequest = {
  companyName: string;
  email: string;
  password: string;
  confirmPassword: string;
  location: string;
  phoneNumber: string;
  website: string;
  logo: File | null;
}

export type LoginRequest = {
  email: string;
  password: string;
};

export type AuthResponse<T extends AuthUser = AuthUser> = {
  user: T
  token: string;
}

// Backend-aligned types used in API wrappers
export interface CompanyProfile {
  _id: string
  email: string
  role: "company"
  createdAt: string
  updatedAt: string
  companyName: string
  location?: string
  phoneNumber?: string
  website?: string
  logo?: string
  isApproved: boolean
}

export interface Job {
  _id: string
  title: string
  description: string
  skills: string[]
  experience?: string
  employmentType: "fulltime" | "part-time" | "internship"
  salary?: string
  category: string
  companyId: string | { _id: string; companyName: string; logo?: string }
  createdAt: string
  updatedAt: string
}

export interface Notification {
  message: string
  read: boolean
  createdAt: string
}

export interface Application {
  _id: string
  jobId: string | Job
  employeeId: string | EmployeeUser
  skills: string[]
  experience?: string
  appliedVia: "normal" | "whatsapp" | "referral"
  status: "pending" | "reviewed" | "interview" | "hired" | "rejected"
  notifications: Notification[]
  createdAt: string
  updatedAt: string
}

// Existing FE-only types kept for UI components using mock data
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