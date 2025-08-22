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
  data: FormData
): Promise<AuthResponse<CompanyUser>> => {
  const response = await api.post("/auth/register/company", data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export const createCompanyFormData = (formData: any): FormData => {
  const form = new FormData();
  
  form.append('companyName', formData.companyName);
  form.append('email', formData.email);
  form.append('password', formData.password);
  form.append('confirmPassword', formData.confirmPassword);

  if (formData.location) {
    form.append('location', formData.location);
  }
  if (formData.companyPhoneNumber) {
    form.append('phoneNumber', formData.companyPhoneNumber); // Note: using 'phoneNumber' to match your schema
  }
  if (formData.website) {
    form.append('website', formData.website);
  }
  
  // Add the file if it exists
  if (formData.logo && formData.logo instanceof File) {
    form.append('logo', formData.logo);
  }
  
  return form;
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

export const updateAdminPassword = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  const response = await fetch('/api/admin/password', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

// Employee APIs
export const fetchEmployeeProfile = async () => {
  const res = await api.get("/employee/profile");
  const data = res.data;
  return data?.employee || data?.data?.employee || data;
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
    console.error("Error fetching public jobs:", publicErr)
    try {
      const res = await api.get("/employee/jobs", { params: { category } });
      return normalizeJobs(res.data)
    } catch (employeeErr) {
      console.error("Error fetching employee jobs:", employeeErr)
      return []
    }
  }
};

export const applyToJob = async (
  jobId: string,
  payload: { message?: string; coverLetter?: string; resumeFile?: File | null; experience?: string; appliedVia?: 'normal' | 'whatsapp' | 'referral' }
) => {
  const formData = new FormData();
  if (payload.coverLetter) formData.append('coverLetter', payload.coverLetter);
  else if (payload.message) formData.append('coverLetter', payload.message);
  if (payload.appliedVia) formData.append('appliedVia', payload.appliedVia);
  if (payload.experience) formData.append('experience', payload.experience);
  if (payload.resumeFile instanceof File) {
    formData.append('resume', payload.resumeFile);
  }
  const res = await api.post(`/employee/apply/${jobId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

// Employee account state
export const deactivateEmployeeAccount = async () => {
  const res = await api.patch('/employee/deactivate', {});
  return res.data;
};

export const activateEmployeeAccount = async () => {
  const res = await api.patch('/employee/activate', {});
  return res.data;
};

export const deleteEmployeeAccount = async () => {
  const res = await api.delete('/employee/delete');
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
  const data = res.data;
  const company = data?.company || data?.data?.company || data;
  if (data?.statusNotice) {
    (company as any).statusNotice = data.statusNotice;
  }
  return company;
};

export const updateCompanyProfile = async (data: Partial<CompanyUser>) => {
  const res = await api.patch("/company/profile", data);
  return res.data;
};

// Company account lifecycle
export const deactivateCompanyAccount = async () => {
  const res = await api.patch('/company/deactivate', {});
  return res.data;
};

export const activateCompanyAccount = async () => {
  const res = await api.patch('/company/activate', {});
  return res.data;
};

export const deleteCompanyAccount = async () => {
  const res = await api.delete('/company/delete');
  return res.data;
};

export const updateEmployeeProfile = async (data: any) => {
  const res = await api.patch("/employee/profile", data);
  return res.data;
};

// Employee file upload APIs
export const uploadEmployeeImage = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  const res = await api.post('/employee/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const uploadEmployeeDocuments = async (files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('documents', file);
  });
  const res = await api.post('/employee/upload/documents', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const updateEmployeeImage = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  const res = await api.patch('/employee/update/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const updateEmployeeDocuments = async (files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('documents', file);
  });
  const res = await api.patch('/employee/update/documents', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const deleteEmployeeImage = async () => {
  const res = await api.delete('/employee/delete/image');
  return res.data;
};

export const deleteEmployeeDocument = async (index: string) => {
  const res = await api.delete(`/employee/delete/document/${index}`);
  return res.data;
};

// Employee password reset
export const resetEmployeePassword = async (oldPassword: string, newPassword: string) => {
  const res = await api.patch('/employee/reset-password', { oldPassword, newPassword });
  return res.data;
};

export const postJob = async (data: {
  title: string;
  description: string;
  image?: File;
  location: string,
  skills?: string[];
  experience?: string;
  employmentType: 'fulltime' | 'part-time' | 'internship';
  salaryMin?: string;
  salaryMax?: string;
  category: string;
  responsibilities?: string[];
  benefits?: string[];
  companyId: string;
  applicationDeadline?: string;
}) => {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('employmentType', data.employmentType);
  formData.append('category', data.category);
  formData.append('companyId', data.companyId);
  if (data.experience) formData.append('experience', data.experience);
  if (data.salaryMin) formData.append('salaryMin', data.salaryMin);
  if (data.salaryMax) formData.append('salaryMax', data.salaryMax);
  if (data.applicationDeadline) formData.append('applicationDeadline', data.applicationDeadline);
  if (data.image instanceof File) formData.append('image', data.image);
  (data.skills || []).forEach((s) => formData.append('skills', s));
  (data.responsibilities || []).forEach((r) => formData.append('responsibilities', r));
  (data.benefits || []).forEach((b) => formData.append('benefits', b));

  const res = await api.post('/company/job', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const fetchCompanyJobs = async () => {
  const res = await api.get("/company/jobs");
  return res.data.jobs;
};

export const fetchJobApplicants = async (jobId: string) => {
  const res = await api.get(`/company/applicants/${jobId}`);
  const data = res.data;
  return data?.applicants || data?.data?.applicants || data;
};

export const updateApplicantStatus = async (applicationId: string, status: 'pending' | 'reviewed' | 'interview' | 'hired' | 'rejected') => {
  const res = await api.patch(`/company/applications/${applicationId}/status`, { status })
  return res.data
}

export const updateJob = async (
  id: string,
  data: Partial<{
    title: string;
    description: string;
    image?: File;
    location: string,
    skills: string[];
    experience: string;
    employmentType: 'fulltime' | 'part-time' | 'internship';
    salaryMin: string;
    salaryMax: string;
    category: string;
    responsibilities: string[];
    benefits: string[];
    applicationDeadline: string;
  }>
) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === 'undefined' || value === null) return;
    if (key === 'image' && value instanceof File) {
      formData.append('image', value);
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((v) => formData.append(key, String(v)));
      return;
    }
    formData.append(key, String(value));
  });
  const res = await api.patch(`/company/job/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const deleteJob = async (id: string) => {
  const res = await api.delete(`/company/job/${id}`);
  return res.data;
}

export const fetchJobSuggestions = async (category?: string) => {
  const normalizeJobs = (payload: any): any[] => {
    if (!payload) return []
    if (Array.isArray(payload)) return payload
    if (Array.isArray(payload?.jobs)) return payload.jobs
    if (Array.isArray(payload?.data?.jobs)) return payload.data.jobs
    return []
  }
  const res = await api.get('/employee/suggestions', { params: { category } })
  return normalizeJobs(res.data)
}

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

export const rejectCompany = async (companyId: string, rejectionReason: string) => {
  const res = await api.patch(`/admin/company/${companyId}/reject`, { rejectionReason });
  return res.data;
};

export const disableCompany = async (companyId: string) => {
  const res = await api.patch(`/admin/company/${companyId}/disable`);
  return res.data;
};

export const enableCompany = async (companyId: string) => {
  const res = await api.patch(`/admin/company/${companyId}/enable`);
  return res.data;
};

export const deleteCompany = async (companyId: string) => {
  const res = await api.delete(`/admin/company/${companyId}/delete`);
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
    console.error("Error fetching job by ID:", err)
    try {
      const allJobs = await fetchJobs();
      return (Array.isArray(allJobs) ? allJobs : []).find(
        (j: any) => j?._id === jobId || j?.id === jobId
      ) || null;
    } catch (fallbackErr) {
      console.error("Error in fallback job fetch:", fallbackErr)
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
  try {
    const res = await api.get("/users", { params: { status: 'active' } })
    return normalizeUsers(res.data)
  } catch (e) {
    console.error("Error fetching users directory:", e)
    return []
  }
};

export const fetchUserById = async (userId: string) => {
  try {
    const res = await api.get(`/users/${userId}`)
    const data = res.data
    if (data?.user) return data.user
    if (data?.data?.user) return data.data.user
    if (data?._id || data?.id) return data
    return null
  } catch (e) {
    console.error("Error fetching user by ID:", e)
    try {
      const list = await fetchUsersDirectory();
      return (Array.isArray(list) ? list : []).find((u: any) => u?._id === userId || u?.id === userId) || null;
    } catch {
      return null
    }
  }
};

// Company missing info completion
export const completeCompanyNextSteps = async (payload: { about?: string; documents?: string[] }) => {
  const res = await api.patch('/auth/company/complete', payload)
  return res.data
}



// Company browsing employees and sending work requests
export const fetchEmployeesDirectory = async (category?: string) => {
  const res = await api.get('/company/employees', { params: category ? { category } : undefined })
  const data = res.data
  return data?.employees || data?.data?.employees || data
}

export const sendWorkRequest = async (employeeId: string, message?: string) => {
  const res = await api.post('/company/work-requests', { employeeId, message })
  return res.data
}

// Company file upload APIs
export const uploadCompanyLogo = async (file: File) => {
  const formData = new FormData();
  formData.append('logo', file);
  const res = await api.post('/company/upload/logo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const uploadCompanyDocuments = async (files: File[]) => {
  const formData = new FormData();
  files.forEach((file, index) => {
    formData.append('documents', file);
  });
  const res = await api.post('/company/upload/documents', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const updateCompanyLogo = async (file: File) => {
  const formData = new FormData();
  formData.append('logo', file);
  const res = await api.patch('/company/update/logo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const updateCompanyDocuments = async (files: File[]) => {
  const formData = new FormData();
  files.forEach((file, index) => {
    formData.append('documents', file);
  });
  const res = await api.patch('/company/update/documents', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const deleteCompanyLogo = async () => {
  const res = await api.delete('/company/delete/logo');
  return res.data;
};

export const deleteCompanyDocument = async (index: number) => {
  const res = await api.delete(`/company/delete/document/${index}`);
  return res.data;
};

// Company profile completion
export const completeCompanyProfile = async (data: { about?: string; logo?: File; documents?: File[] }) => {
  const formData = new FormData();
  if (data.about) formData.append('about', data.about);
  if (data.logo) formData.append('logo', data.logo);
  if (data.documents) {
    data.documents.forEach((file) => {
      formData.append('documents', file); // IMPORTANT: exact field name 'documents'
    });
  }
  
  const res = await api.patch('/company/complete-profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

// Admin company review APIs
export const fetchCompaniesPendingReview = async () => {
  const res = await api.get('/admin/companies/pending-review');
  return res.data;
};

// Admin profile APIs
export const fetchAdminProfile = async () => {
  const res = await api.get('/admin/me');
  return res.data;
};

// Admin file upload APIs
export const uploadAdminImage = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  const res = await api.post('/admin/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const updateAdminImage = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  const res = await api.patch('/admin/update/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const deleteAdminImage = async () => {
  const res = await api.delete('/admin/delete/image');
  return res.data;
};

export const uploadAdminDocuments = async (files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('documents', file);
  });
  const res = await api.post('/admin/upload/documents', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const updateAdminDocuments = async (files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('documents', file);
  });
  const res = await api.patch('/admin/update/documents', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const deleteAdminDocument = async (index: string) => {
  const res = await api.delete(`/admin/delete/document/${index}`);
  return res.data;
};

export const fetchAllEmployees = async () => {
  const res = await api.get('/admin/employees');
  return res.data;
};

export const approveCompanyProfile = async (companyId: string) => {
  const res = await api.patch(`/admin/company/${companyId}/approve-profile`);
  return res.data;
};

export const rejectCompanyProfile = async (companyId: string, rejectionReason: string) => {
  const res = await api.patch(`/admin/company/${companyId}/reject-profile`, { rejectionReason });
  return res.data;
};

export const fetchEmployeeWorkRequests = async () => {
  const res = await api.get('/employee/work-requests')
  return res.data
}

export const respondToWorkRequest = async (
  id: string,
  action: 'accept' | 'reject'
) => {
  const res = await api.patch(`/employee/work-requests/${id}/respond`, { action })
  return res.data
}

export const markEmployeeNotificationRead = async (notificationId: string) => {
  try {
    const res = await api.patch(`/employee/notifications/${notificationId}/read`)
    return res.data
  } catch {
    return null
  }
}

export const deleteEmployeeNotification = async (notificationId: string) => {
  try {
    const res = await api.delete(`/employee/notifications/${notificationId}`)
    return res.data
  } catch {
    return null
  }
}

export const fetchCompanyNotifications = async () => {
  try {
    const res = await api.get('/company/notifications')
    return res.data
  } catch (e) {
    return []
  }
}

export const markCompanyNotificationRead = async (notificationId: string) => {
  try {
    const res = await api.patch(`/company/notifications/${notificationId}/read`)
    return res.data
  } catch {
    return null
  }
}

export const deleteCompanyNotification = async (notificationId: string) => {
  try {
    const res = await api.delete(`/company/notifications/${notificationId}`)
    return res.data
  } catch {
    return null
  }
}

export const fetchAdminNotifications = async () => {
  try {
    const res = await api.get('/admin/notifications')
    return res.data
  } catch {
    return []
  }
}

export const markAdminNotificationRead = async (notificationId: string) => {
  try {
    const res = await api.patch(`/admin/notifications/${notificationId}/read`)
    return res.data
  } catch {
    return null
  }
}

export const deleteAdminNotification = async (notificationId: string) => {
  try {
    const res = await api.delete(`/admin/notifications/${notificationId}`)
    return res.data
  } catch {
    return null
  }
}

export { api };
