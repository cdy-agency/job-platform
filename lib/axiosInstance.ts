import axios from "axios";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json"
    },
    timeout: 10000,
})

// Request interceptor - no logging
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers = config.headers || {}
        config.headers['Authorization'] = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - minimal error handling without logging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle auth errors silently
    if (error?.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token')
      // Optionally redirect to login
      // window.location.href = '/login'
    }
    
    return Promise.reject(error)
  }
)

// Error message helper for your components
export const getErrorMessage = (error: any): string => {
  if (error?.response?.status === 401) return 'Please log in to continue'
  if (error?.response?.status === 403) return 'Access denied'
  if (error?.response?.status === 404) return 'Not found'
  if (error?.response?.status >= 500) return 'Server error. Please try again'
  if (error?.code === 'ECONNABORTED') return 'Request timeout'
  if (error?.code === 'ERR_NETWORK') return 'Network error'
  if (error?.response?.data?.message) return error.response.data.message
  return 'Something went wrong'
}

// Optional: Debug function you can call manually when needed
export const debugError = (error: any) => {
  if (process.env.NODE_ENV === 'development') {
    try {
      // Only log if you specifically call this function
      const errorInfo = {
        url: error?.config?.url,
        method: error?.config?.method,
        status: error?.response?.status,
        message: error?.response?.data?.message || error?.message
      }
      
      // Use alert or a custom logging method that works in your environment
      alert(`API Error: ${JSON.stringify(errorInfo, null, 2)}`)
    } catch {
      alert('API Error occurred but could not display details')
    }
  }
}