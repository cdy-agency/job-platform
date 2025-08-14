import { api } from '@/lib/axiosInstance'

export const getCompanies = async () => {
  const res = await api.get('/admin/companies')
  return res.data
}

export const getPendingReviewCompanies = async () => {
  const res = await api.get('/admin/companies/pending-review')
  return res.data
}

export const getCompanyById = async (id: string) => {
  const res = await api.get(`/admin/company/${id}`)
  return res.data
}

export const approveCompanyProfile = async (id: string) => {
  const res = await api.patch(`/admin/company/${id}/approve-profile`)
  return res.data
}

export const rejectCompanyProfile = async (id: string, reason: string) => {
  const res = await api.patch(`/admin/company/${id}/reject-profile`, { rejectionReason: reason })
  return res.data
}

export const disableCompany = async (id: string) => {
  const res = await api.patch(`/admin/company/${id}/disable`)
  return res.data
}

export const enableCompany = async (id: string) => {
  const res = await api.patch(`/admin/company/${id}/enable`)
  return res.data
}

export const deleteCompany = async (id: string) => {
  const res = await api.delete(`/admin/company/${id}/delete`)
  return res.data
}