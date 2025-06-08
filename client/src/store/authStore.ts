import { create } from "zustand"
import { persist } from "zustand/middleware"
import api from "@/lib/api"

interface User {
  id: string
  name: string
  email: string
  profilePicture?: string
  provider: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  loadUser: () => Promise<void>
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        try {
          set({ isLoading: true, error: null })
          const { data } = await api.post("/auth/login", { email, password })
          set({ user: data.user, isAuthenticated: true, isLoading: false })
          return data.user  // ✅ Return user on success
        } catch (error: any) {
          const message = error.response?.data?.error || "Login failed"
          set({ isLoading: false, error: message })
          throw new Error(message)  // ✅ Throw error to handle in caller
        }
      },      
      register: async (name, email, password) => {
        try {
          set({ isLoading: true, error: null })
          const { data } = await api.post("/auth/register", { name, email, password })
          set({ user: data.user, isAuthenticated: true, isLoading: false })
          return data.user  // ✅ Return user
        } catch (error: any) {
          const message = error.response?.data?.error || "Registration failed"
          set({ isLoading: false, error: message })
          throw new Error(message)  // ✅ Throw for toast
        }
      },      

      logout: async () => {
        try {
           await api.post("/auth/logout", {}) 
          set({ user: null, isAuthenticated: false })
        } catch (error: any) {
          console.error("Logout failed:", error.response?.data?.error || error.message)
        }
      },      

      loadUser: async () => {
        try {
          set({ isLoading: true })
          const { data } = await api.get("/auth/me")
          set({ user: data.user, isAuthenticated: true, isLoading: false })
        } catch {
          set({ user: null, isAuthenticated: false, isLoading: false })
        }
      },

      setUser: (user) => set({ user, isAuthenticated: true }),
    }),
    {
     name: "user-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
)
