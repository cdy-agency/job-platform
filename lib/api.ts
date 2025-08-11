import {
  EmployeeRegisterType,
  LoginType,
  CompanyRegisterType,
} from "@/types/auth.schema";
import { api } from "./axiosInstance";
import { AuthResponse, CompanyUser, EmployeeUser, AdminUser, Job, Application, Notification, CompanyProfile } from "@/types/types";

export const registerEmployee = async (data: EmployeeRegisterType) => {
  const response = await api.post("/auth/register/employee", data);
  return response.data;
};

export const registerCompany = async (
  data: CompanyRegisterType
): Promise<AuthResponse<CompanyUser>> => {
  // Backend may accept multipart or JSON; keep JSON simple per current form usage
  const response = await api.post("/auth/register/company", data);
  return response.data;
};

function decodeJwtPayload(token: string): any | null {
  try {
    const payload = token.split(".")[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

const asArray = <T = any>(data: any, ...keys: string[]): T[] => {
  if (Array.isArray(data)) return data as T[];
  for (const k of keys) {
    const v = data?.[k];
    if (Array.isArray(v)) return v as T[];
  }
  return [] as T[];
};

export const loginUser = async (
  data: LoginType
): Promise<AuthResponse<EmployeeUser | CompanyUser | AdminUser>> => {
  const response = await api.post("/auth/login", data);
  const body = response.data as any;

  const token: string | undefined = body?.token;
  if (!token) return body;

  let user = body?.user as EmployeeUser | CompanyUser | AdminUser | undefined;
  const role: string | undefined = body?.role || (user as any)?.role;

  if (!user && role === "employee") {
    const res = await api.get("/employee/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    user = res.data as EmployeeUser;
  } else if (!user && role === "company") {
    // Do NOT call /company/profile here to avoid 403 for unapproved companies.
    // Construct a minimal company auth user from the JWT payload.
    const payload = decodeJwtPayload(token);
    user = {
      id: payload?.id || "",
      companyName: "",
      location: "",
      phoneNumber: "",
      website: "",
      logo: "",
      role: "company",
      // isApproved unknown at login time; will be checked lazily on company pages
    } as any;
  } else if (!user && role === "superadmin") {
    const payload = decodeJwtPayload(token);
    user = {
      id: payload?.id || "",
      email: payload?.email || "",
      role: "superadmin",
    } as AdminUser;
  }

  return { user: user as any, token };
};

// Employee endpoints
export const getEmployeeProfile = async () => {
  const response = await api.get("/employee/profile");
  return response.data as EmployeeUser;
};

export const listJobsForEmployee = async (category?: string) => {
  const response = await api.get("/employee/jobs", { params: { category } });
  return asArray<Job>(response.data, "jobs", "data", "results", "items");
};

export const applyForJob = async (
  jobId: string,
  payload: { skills: string[]; experience?: string; appliedVia?: "normal" | "whatsapp" | "referral" }
) => {
  const response = await api.post(`/employee/apply/${jobId}`, payload);
  return response.data as Application;
};

export const listEmployeeApplications = async () => {
  const response = await api.get("/employee/applications");
  return asArray<Application>(response.data, "applications", "data", "results", "items");
};

export const listEmployeeNotifications = async () => {
  const response = await api.get("/employee/notifications");
  return asArray<Notification>(response.data, "notifications", "data", "results", "items");
};

// Company endpoints
export const getCompanyProfile = async () => {
  const response = await api.get("/company/profile");
  return response.data as CompanyProfile;
};

export const updateCompanyProfile = async (data: Partial<CompanyProfile>) => {
  const response = await api.patch("/company/profile", data);
  return response.data as CompanyProfile;
};

export const postCompanyJob = async (data: Partial<Job>) => {
  const response = await api.post("/company/job", data);
  return response.data as Job;
};

export const listCompanyJobs = async () => {
  const response = await api.get("/company/jobs");
  return asArray<Job>(response.data, "jobs", "data", "results", "items");
};

export const listApplicantsForJob = async (jobId: string) => {
  const response = await api.get(`/company/applicants/${jobId}`);
  return asArray<Application>(response.data, "applicants", "applications", "data", "results", "items");
};

// Admin endpoints
export const adminLogin = async (data: LoginType): Promise<AuthResponse<AdminUser>> => {
  const response = await api.post("/admin/login", data);
  return response.data;
};

export const adminUpdatePassword = async (data: { currentPassword: string; newPassword: string }) => {
  const response = await api.patch("/admin/update-password", data);
  return response.data;
};

export const adminListEmployees = async () => {
  const response = await api.get("/admin/employees");
  return asArray<EmployeeUser>(response.data, "employees", "data", "results", "items");
};

export const adminListCompanies = async () => {
  const response = await api.get("/admin/companies");
  return asArray<CompanyProfile>(response.data, "companies", "data", "results", "items");
};

export const adminApproveCompany = async (id: string) => {
  const response = await api.patch(`/admin/company/${id}/approve`);
  return response.data as CompanyProfile;
};
