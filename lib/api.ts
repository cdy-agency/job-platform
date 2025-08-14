import { AxiosInstance } from "axios";
import {
  EmployeeRegisterType,
  LoginType,
  CompanyRegisterType,
} from "@/types/auth.schema";
import { api } from "./axiosInstance";
import { AuthResponse, CompanyUser, EmployeeUser } from "@/types/types";

export const registerEmployee = async (data: EmployeeRegisterType): Promise<AuthResponse<EmployeeUser>> => {
  const response = await api.post("/auth/register/employee", data);
  return response.data;
};

export const registerCompany = async (
  data: CompanyRegisterType
): Promise<AuthResponse<CompanyUser>> => {
  // Backend accepts JSON payload per README
  const response = await api.post("/auth/register/company", data);
  return response.data;
};

export const loginUser = async (
  data: LoginType
): Promise<any> => {
  const response = await api.post("/auth/login", data);
  const res = response.data;
  if (!res.user && res.role) {
    res.user = { role: res.role };
  }
  return res;
};

// Employee APIs
export const fetchEmployeeProfile = async () => {
  const res = await api.get("/employee/profile");
  return res.data;
};

export const fetchJobs = async (category?: string) => {
  const normalizeJobs = (payload: any): any[] => {
    if (!payload) return []
    if (Array.isArray(payload)) return payload
    if (Array.isArray(payload?.jobs)) return payload.jobs
    if (Array.isArray(payload?.data?.jobs)) return payload.data.jobs
    if (Array.isArray(payload?.data)) return payload.data
    return []
  }
  try {
    const res = await api.get("/jobs", { params: { category } });
    return normalizeJobs(res.data)
  } catch (publicErr) {
    const res = await api.get("/employee/jobs", { params: { category } });
    return normalizeJobs(res.data)
  }
};

export const applyToJob = async (
  jobId: string,
  payload: { skills: string[]; experience?: string; appliedVia?: 'normal' | 'whatsapp' | 'referral' }
) => {
  const res = await api.post(`/employee/apply/${jobId}`, payload);
  return res.data;
};

export const fetchEmployeeApplications = async () => {
  const res = await api.get("/employee/applications");
  return res.data;
};

export const fetchEmployeeNotifications = async () => {
  const res = await api.get("/employee/notifications");
  return res.data;
};

// Company APIs
export const fetchCompanyProfile = async () => {
  const res = await api.get("/company/profile");
  return res.data;
};

export const updateCompanyProfile = async (data: Partial<CompanyUser>) => {
  const res = await api.patch("/company/profile", data);
  return res.data;
};

export const postJob = async (data: {
  title: string;
  description: string;
  skills: string[];
  experience?: string;
  employmentType: 'fulltime' | 'part-time' | 'internship';
  salary?: string;
  category: string;
}) => {
  const res = await api.post("/company/job", data);
  return res.data;
};

export const fetchCompanyJobs = async () => {
  const res = await api.get("/company/jobs");
  return res.data;
};

export const fetchJobApplicants = async (jobId: string) => {
  const res = await api.get(`/company/applicants/${jobId}`);
  return res.data;
};

// Admin APIs
export const adminLogin = async (data: LoginType) => {
  const res = await api.post("/admin/login", data);
  const dataRes = res.data;
  if (!dataRes.user && dataRes.role) {
    dataRes.user = { role: dataRes.role };
  }
  return dataRes;
};

export const adminUpdatePassword = async (payload: { currentPassword: string; newPassword: string }) => {
  const res = await api.patch("/admin/update-password", payload);
  return res.data;
};

export const fetchAdminEmployees = async () => {
  const res = await api.get("/admin/employees");
  return res.data;
};

export const fetchAdminCompanies = async () => {
  const res = await api.get("/admin/companies");
  return res.data;
};

export const approveCompany = async (companyId: string) => {
  const res = await api.patch(`/admin/company/${companyId}/approve`);
  return res.data;
};

export const fetchJobById = async (jobId: string) => {
  const extractJob = (payload: any): any | null => {
    if (!payload) return null
    if (payload?.job) return payload.job
    if (payload?.data?.job) return payload.data.job
    if (payload?._id || payload?.id) return payload
    return null
  }
  try {
    const res = await api.get(`/jobs/${jobId}`);
    return extractJob(res.data)
  } catch (err) {
    try {
      const allJobs = await fetchJobs();
      return (Array.isArray(allJobs) ? allJobs : []).find(
        (j: any) => j?._id === jobId || j?.id === jobId
      ) || null;
    } catch {
      return null;
    }
  }
};

export const fetchUsersDirectory = async (): Promise<any[]> => {
  const normalizeUsers = (payload: any): any[] => {
    if (!payload) return []
    if (Array.isArray(payload)) return payload
    if (Array.isArray(payload?.users)) return payload.users
    if (Array.isArray(payload?.data?.users)) return payload.data.users
    if (Array.isArray(payload?.data)) return payload.data
    return []
  }
  const tryPaths = [
    "/users",
    "/employees",
    "/employee/employees",
    "/employee/directory",
    "/employee/list",
  ]
  for (const path of tryPaths) {
    try {
      const res = await api.get(path)
      return normalizeUsers(res.data)
    } catch (e) {
      // try next
    }
  }
  return []
};

export const fetchUserById = async (userId: string) => {
  const candidates = [
    `/users/${userId}`,
    `/employees/${userId}`,
    `/employee/employees/${userId}`,
  ]
  for (const path of candidates) {
    try {
      const res = await api.get(path)
      const data = res.data
      if (data?.user) return data.user
      if (data?.data?.user) return data.data.user
      if (data?._id || data?.id) return data
    } catch (e) {
      // try next
    }
  }
  try {
    const list = await fetchUsersDirectory();
    return (Array.isArray(list) ? list : []).find((u: any) => u?._id === userId || u?.id === userId) || null;
  } catch {
    return null
  }
};
