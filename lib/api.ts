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
  // Try public jobs endpoint first, then fall back to employee endpoint
  try {
    const res = await api.get("/jobs", { params: { category } });
    return res.data;
  } catch (publicErr) {
    const res = await api.get("/employee/jobs", { params: { category } });
    return res.data;
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
  try {
    const res = await api.get(`/jobs/${jobId}`);
    return res.data;
  } catch (err) {
    try {
      // Fallback: fetch all then find
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
  // Prefer public users endpoint, fallback to admin list
  try {
    const res = await api.get("/users");
    return Array.isArray(res.data) ? res.data : [];
  } catch (publicErr) {
    try {
      const res2 = await api.get("/admin/employees");
      return Array.isArray(res2.data) ? res2.data : [];
    } catch {
      return [];
    }
  }
};

export const fetchUserById = async (userId: string) => {
  try {
    const res = await api.get(`/admin/employees/${userId}`);
    return res.data;
  } catch (adminErr) {
    try {
      const res2 = await api.get(`/users/${userId}`);
      return res2.data;
    } catch {
      try {
        const list = await fetchUsersDirectory();
        return (Array.isArray(list) ? list : []).find((u: any) => u?._id === userId || u?.id === userId) || null;
      } catch {
        return null;
      }
    }
  }
};
