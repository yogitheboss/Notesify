import axios from "axios";
import { useUserStore } from "../store/user";

const BASE_URL = "http://localhost:3000";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to add token
apiClient.interceptors.request.use((config) => {
  const token = useUserStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle token expiry
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useUserStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
