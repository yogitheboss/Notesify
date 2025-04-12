import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Make sure this matches your server's URL and API prefix
const BASE_URL = "http://192.168.1.16:3000";

// Create a function that gets the token from AsyncStorage or store
const getAuthToken = async () => {
  try {
    // First try to get from AsyncStorage for initial requests
    const token = await AsyncStorage.getItem("token");
    if (token) return token;
    console.log("Token not found in AsyncStorage");

    // If not in AsyncStorage, try the store
    const { useUserStore } = require("../store/user");
    return useUserStore.getState().token;
  } catch (error) {
    console.error("Error getting auth token:", error);
    return null;
  }
};

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // Increase timeout to 30 seconds for file uploads
});

// Add request interceptor to add token
apiClient.interceptors.request.use(async (config) => {
  // Only add auth token for non-auth endpoints
  if (!config.url?.includes("/auth/")) {
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  // Check if we're sending form data
  if (config.data instanceof FormData) {
    // For FormData, set the correct content type and let axios handle the boundary
    config.headers["Content-Type"] = "multipart/form-data";
  }

  // Log request for debugging
  console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
  console.log(`Content-Type: ${config.headers["Content-Type"]}`);
  if (config.headers.Authorization) {
    console.log("Authorization header is set");
  }

  return config;
});

// Add response interceptor to handle token expiry
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} for ${response.config.url}`);
    return response;
  },
  async (error) => {
    console.log("API Error:", error.message);
    console.log("Request URL:", error.config?.url);
    console.log("Request Method:", error.config?.method);

    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Response data:", error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.log("No response received:", error.request);
    }

    if (error.response?.status === 401) {
      console.log("401 Unauthorized - Logging out user");
      // Clear AsyncStorage
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");

      // Dynamically import the store to avoid the circular dependency
      const { useUserStore } = require("../store/user");
      useUserStore.getState().logout();
    }

    return Promise.reject(error);
  }
);

export default apiClient;
