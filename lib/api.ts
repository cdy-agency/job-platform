import { Application, Company, Employee, Job, LoginResponse } from "./types"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || ""

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    cache: "no-store",
  })

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(text || `Request failed: ${res.status}`)
  }

  if (res.status === 204) {
    return undefined as unknown as T
  }

  return (await res.json()) as T
}

function authHeader(token?: string) {
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const authApi = {
  login: (email: string, password: string) =>
    request<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  registerEmployee: (payload: { name: string; email: string; password: string }) =>
    request<Employee>("/api/auth/register/employee", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  registerCompany: (payload: {
    companyName: string
    email: string
    password: string
    location?: string
    phoneNumber?: string
    website?: string
  }) =>
    request<Company>("/api/auth/register/company", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
}

export const employeeApi = {
  me: (token: string) =>
    request<Employee>("/api/employee/profile", { headers: { ...authHeader(token) } }),
  listJobs: (token: string, category?: string) =>
    request<Job[]>(`/api/employee/jobs${category ? `?category=${encodeURIComponent(category)}` : ""}`, {
      headers: { ...authHeader(token) },
    }),
  apply: (
    token: string,
    jobId: string,
    payload: { skills: string[]; experience?: string; appliedVia: "normal" | "whatsapp" | "referral" },
  ) => request<Application>(`/api/employee/apply/${jobId}`, {
    method: "POST",
    headers: { ...authHeader(token) },
    body: JSON.stringify(payload),
  }),
  applications: (token: string) =>
    request<Application[]>("/api/employee/applications", { headers: { ...authHeader(token) } }),
  notifications: (token: string) =>
    request<{ message: string; read: boolean; createdAt: string }[]>("/api/employee/notifications", {
      headers: { ...authHeader(token) },
    }),
}

export const companyApi = {
  me: (token: string) => request<Company>("/api/company/profile", { headers: { ...authHeader(token) } }),
  update: (token: string, payload: Partial<Company>) =>
    request<Company>("/api/company/profile", {
      method: "PATCH",
      headers: { ...authHeader(token) },
      body: JSON.stringify(payload),
    }),
  postJob: (token: string, payload: Partial<Job>) =>
    request<Job>("/api/company/job", {
      method: "POST",
      headers: { ...authHeader(token) },
      body: JSON.stringify(payload),
    }),
  myJobs: (token: string) => request<Job[]>("/api/company/jobs", { headers: { ...authHeader(token) } }),
  applicants: (token: string, jobId: string) =>
    request<Application[]>(`/api/company/applicants/${jobId}`, { headers: { ...authHeader(token) } }),
}

export const adminApi = {
  login: (email: string, password: string) =>
    request<LoginResponse>("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  updatePassword: (token: string, payload: { password: string }) =>
    request<void>("/api/admin/update-password", {
      method: "PATCH",
      headers: { ...authHeader(token) },
      body: JSON.stringify(payload),
    }),
  employees: (token: string) => request<Employee[]>("/api/admin/employees", { headers: { ...authHeader(token) } }),
  companies: (token: string) => request<Company[]>("/api/admin/companies", { headers: { ...authHeader(token) } }),
  approveCompany: (token: string, id: string, approve = true) =>
    request<Company>(`/api/admin/company/${id}/approve`, {
      method: "PATCH",
      headers: { ...authHeader(token) },
      body: JSON.stringify({ approve }),
    }),
}