export type UserRole = "employee" | "company" | "superadmin"

export interface BaseUser {
  _id: string
  email: string
  role: UserRole
  createdAt: string
  updatedAt: string
}

export interface Employee extends BaseUser {
  name: string
  dateOfBirth?: string
  phoneNumber?: string
}

export interface Company extends BaseUser {
  companyName: string
  location?: string
  phoneNumber?: string
  website?: string
  logo?: string
  isApproved: boolean
}

export interface JobCompanyRef {
  _id: string
  companyName: string
  logo?: string
}

export type EmploymentType = "fulltime" | "part-time" | "internship"

export interface Job {
  _id: string
  title: string
  description: string
  skills: string[]
  experience?: string
  employmentType: EmploymentType
  salary?: string
  category: string
  companyId: string | JobCompanyRef
  createdAt: string
  updatedAt: string
}

export type ApplicationStatus = "pending" | "reviewed" | "interview" | "hired" | "rejected"
export type AppliedVia = "normal" | "whatsapp" | "referral"

export interface ApplicationNotification {
  message: string
  read: boolean
  createdAt: string
}

export interface Application {
  _id: string
  jobId: string | Job
  employeeId: string | Employee
  skills: string[]
  experience?: string
  appliedVia: AppliedVia
  status: ApplicationStatus
  notifications: ApplicationNotification[]
  createdAt: string
  updatedAt: string
}

export interface LoginResponse<TUser extends BaseUser = BaseUser> {
  token: string
  user: TUser
}