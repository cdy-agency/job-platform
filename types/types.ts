export interface EmployeeUser {
  id: string
  name:string
  phoneNumber: string
  dateOfBirth: string
  role:"employee"
}

export interface CompanyUser {
  id: string
  companyName: string,
  province: string
  district: string
  phoneNumber: string,
  website: string
  logo: string
  role: "company"
}

export interface admin {
  id:  string,
  name: string,
  email: string, 
  role: "superadmin"  
}

export type AuthUser = EmployeeUser | CompanyUser


export  type RegisterEmployeeRequest ={
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