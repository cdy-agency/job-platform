import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Authorization header if token exists in localStorage (browser only)
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
      // Some backends expect x-auth-token instead of Authorization
      (config.headers as any)["x-auth-token"] = token;
    }
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || "";
    if (typeof window !== "undefined" && (status === 401 || status === 403)) {
      if (/invalid token/i.test(message) || /access denied/i.test(message)) {
        try {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        } catch {}
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);