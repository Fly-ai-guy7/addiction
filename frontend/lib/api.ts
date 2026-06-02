import axios from "axios";

// TODO: Get from env var
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const api = axios.create({
    baseURL: `${API_URL}/api/v1`,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add interceptor for Auth later
api.interceptors.request.use((config) => {
    // const token = ... get from Clerk
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
});
