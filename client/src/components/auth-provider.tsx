"use client"

import type React from "react"

import { useEffect } from "react"
import { useAuthStore } from "@/store/authStore"
import { usePathname, useRouter } from "next/navigation"
import { Loader } from "./Loader"

const publicRoutes = ["/sign-in", "/sign-up", "/forgot-password"]

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, loadUser ,user} = useAuthStore()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    loadUser()
  }, [loadUser])


  useEffect(() => {
    if (!isLoading) {
     if (isAuthenticated && !publicRoutes.includes(pathname)) {
        return; 
      } 
    }
  }, [isAuthenticated, isLoading, pathname, router])
  if(isLoading){
    return <Loader type="default" position="center"/>
  }

  return <>{children}</>
}
