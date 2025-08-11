import { AxiosInstance } from "axios";
import {
  EmployeeRegisterType,
  LoginType,
  CompanyRegisterType,
} from "@/types/auth.schema";
import { api } from "./axiosInstance";
import { AuthResponse, CompanyUser, EmployeeUser } from "@/types/types";

export const registerEmployee = async (data: EmployeeRegisterType) => {
  const response = await api.post("/auth/register/employee", data);
  return response.data;
};

export const registerCompany = async (
  data: CompanyRegisterType
): Promise<AuthResponse<EmployeeUser>> => {
  const formData = new FormData();
  formData.append("companyName", data.companyName);
  formData.append("email", data.email);
  formData.append("password", data.password);
  formData.append("confirmPassword", data.confirmPassword);
  formData.append("location", data.location);
  formData.append("phoneNumber", data.phoneNumber);
  formData.append("website", data.website);
  if (data.logo) {
    formData.append("logo", data.logo);
  }

  const response = await api.post("/auth/register/company", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

export const loginUser = async (
  data: LoginType
): Promise<AuthResponse<CompanyUser>> => {
  const response = await api.post("/auth/login", data);
  return response.data;
};
