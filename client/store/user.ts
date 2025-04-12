import { create } from "zustand";
import apiClient from "../utils/apiClient";

interface User {
  email: string;
  name: string;
  _id: string;
}

interface UserState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

export const useUserStore = create<UserState>()((set) => ({
  user: null,
  token: null,
  isLoading: false,

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true });
      const response = await apiClient.post("/api/auth/login", {
        email,
        password,
      });

      set({
        user: response.data.data.user,
        token: response.data.token || null,
        isLoading: false,
      });
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
      set({
        user: response.data.data.user,
        token: response.data.token || null,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    set({ user: null, token: null });
  },
}));
