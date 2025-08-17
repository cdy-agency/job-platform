import axios from "axios";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
    headers: {
        "Content-Type":"application/json"
    },
   
})

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined'){
    const token = localStorage.getItem('token')
    if (token) {
      config.headers = config.headers || {}
      config.headers['Authorization'] = `Bearer ${token}`
    }
  }
  console.log(`Making ${config.method?.toUpperCase()} request to: ${config.baseURL}${config.url}`)
  return config
})

api.interceptors.response.use(
  (response) => {
    console.log(`Response received from: ${response.config.url}`, response.status)
    return response
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    })
    return Promise.reject(error)
  }
)