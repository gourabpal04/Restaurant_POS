import axios from "axios";
import { toast } from "react-hot-toast";

const defaultHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:8000",
  withCredentials: true,
  headers: defaultHeaders,
  timeout: 10000, // 10 seconds
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("Response error:", error);
    const message = error.response?.data?.message || error.message || "An error occurred";
    toast.error(message);
    return Promise.reject(error);
  }
);

export default axiosInstance;