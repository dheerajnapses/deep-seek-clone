"use client"

import { useEffect } from "react"
import { useAuthStore } from "@/store/authStore"
import { usePathname, useRouter } from "next/navigation"
import { Loader } from "./Loader"

const publicRoutes = ["/sign-in", "/sign-up", "/forgot-password"]

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, loadUser } = useAuthStore()
  const pathname = usePathname()
  const router = useRouter()

  // Load user once on mount
  useEffect(() => {
    loadUser()
  }, [loadUser])

  // Redirect logic
  useEffect(() => {
    if (!isLoading) {
      const isPublic = publicRoutes.includes(pathname)
      if (!isAuthenticated && !isPublic) {
        // 🚫 Not authenticated and trying to access protected route
        router.push("/sign-in")
      }
      if (isAuthenticated && isPublic) {
        // ✅ Authenticated and trying to access a public page → redirect to home
        router.push("/")
      }
    }
  }, [isAuthenticated, isLoading, pathname, router])

  if (isLoading) {
    return <Loader type="default" position="center" />
  }

  return <>{children}</>
}
