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

export const loginUser = async (
  data: LoginType
): Promise<AuthResponse<EmployeeUser | CompanyUser | AdminUser>> => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

// Employee endpoints
export const getEmployeeProfile = async () => {
  const response = await api.get("/employee/profile");
  return response.data as EmployeeUser;
};

export const listJobsForEmployee = async (category?: string) => {
  const response = await api.get("/employee/jobs", { params: { category } });
  return response.data as Job[];
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
  return response.data as Application[];
};

export const listEmployeeNotifications = async () => {
  const response = await api.get("/employee/notifications");
  return response.data as Notification[];
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
  return response.data as Job[];
};

export const listApplicantsForJob = async (jobId: string) => {
  const response = await api.get(`/company/applicants/${jobId}`);
  return response.data as Application[];
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
  return response.data as EmployeeUser[];
};

export const adminListCompanies = async () => {
  const response = await api.get("/admin/companies");
  return response.data as CompanyProfile[];
};

export const adminApproveCompany = async (id: string) => {
  const response = await api.patch(`/admin/company/${id}/approve`);
  return response.data as CompanyProfile;
};
