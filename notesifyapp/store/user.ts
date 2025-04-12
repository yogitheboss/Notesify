import { create } from "zustand";
import apiClient from "../utils/apiClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  email: string;
  name: string;
  _id: string;
  photoURL?: string;
  displayName?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface UserState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (email: string, password: string, name: string) => Promise<User>;
  logout: () => void;
  initialize: () => Promise<void>;
}

export const useUserStore = create<UserState>()((set) => ({
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,

  initialize: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userData = await AsyncStorage.getItem("user");

      if (token && userData) {
        const user = JSON.parse(userData);
        set({ user, token, isAuthenticated: true });
      }
    } catch (error) {
      console.error("Failed to initialize user:", error);
    }
  },

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true });
      const response = await apiClient.post("/api/auth/login", {
        email,
        password,
      });

      const { user, token } = response.data.data;

      // Save to AsyncStorage
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      set({
        user,
        token,
        isLoading: false,
        isAuthenticated: true,
      });

      return user;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  signup: async (email: string, password: string, name: string) => {
    try {
      set({ isLoading: true });
      const response = await apiClient.post("/api/auth/signup", {
        email,
        password,
        name,
      });

      const { user, token } = response.data.data;

      // Save to AsyncStorage
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      set({
        user,
        token,
        isLoading: false,
        isAuthenticated: true,
      });

      return user;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    // Remove from AsyncStorage
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");

    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },
}));
