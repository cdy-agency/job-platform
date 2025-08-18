import { api } from "../axiosInstance"

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
  files.forEach((file, index) => {
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
  files.forEach((file, index) => {
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
