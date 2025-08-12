import axios from "axios";
import { getToken } from "@/utils/auth-utils";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
    headers: {
        "Content-Type":"application/json"
    }
})

api.interceptors.request.use((config) => {
    try {
        const token = getToken();
        if (token) {
            config.headers = config.headers || {};
            (config.headers as any)["Authorization"] = `Bearer ${token}`;
        }
    } catch {}
    return config;
});