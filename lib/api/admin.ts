import { api } from '@/lib/axiosInstance'

export const getLoggedinCompany = async () => {
  const res = await api.get('/admin/me')
  return res.data
}

export const getCompanies = async () => {
  const res = await api.get('/admin/companies')
  return res.data
}

export const getPendingReviewCompanies = async () => {
  const res = await api.get('/admin/companies/pending-review')
  return res.data
}

export const getCompanyById = async (id: string) => {
  try {
    const res = await api.get(`/admin/company/${id}`)
    return res.data
  } catch (e: any) {
    try {
      const resAlt = await api.get(`/admin/company/${id}`)
      return resAlt.data
    } catch (e2: any) {
      throw e2 || e
    }
  }
}

export const approveCompanyProfile = async (id: string) => {
  try {
    const res = await api.patch(`/admin/company/${id}/approve-profile`)
    return res.data
  } catch (e: any) {
    const resAlt = await api.patch(`/admin/companies/${id}/approve-profile`)
    return resAlt.data
  }
}

export const rejectCompanyProfile = async (id: string, reason: string) => {
  try {
    const res = await api.patch(`/admin/company/${id}/reject-profile`, { rejectionReason: reason })
    return res.data
  } catch (e: any) {
    const resAlt = await api.patch(`/admin/companies/${id}/reject-profile`, { rejectionReason: reason })
    return resAlt.data
  }
}

export const disableCompany = async (id: string) => {
  try {
    const res = await api.patch(`/admin/company/${id}/disable`)
    return res.data
  } catch (e: any) {
    const resAlt = await api.patch(`/admin/companies/${id}/disable`)
    return resAlt.data
  }
}

export const enableCompany = async (id: string) => {
  try {
    const res = await api.patch(`/admin/company/${id}/enable`)
    return res.data
  } catch (e: any) {
    const resAlt = await api.patch(`/admin/companies/${id}/enable`)
    return resAlt.data
  }
}

export const deleteCompany = async (id: string) => {
  try {
    const res = await api.delete(`/admin/company/${id}/delete`)
    return res.data
  } catch (e: any) {
    const resAlt = await api.delete(`/admin/companies/${id}/delete`)
    return resAlt.data
  }
}

export const fetchRequests = async () => {
  const response = await api.get("/company/work-requests");
  return response.data;
};