"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuthStore } from "@/store/authStore"
import { Loader } from "@/components/Loader"

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  console.log(token)
  const { loadUser } = useAuthStore()

  useEffect(() => {
    if (token) {
      loadUser().then(() => {
        router.push("/")
      })
    } else {
      router.push("/sign-in")
    }
  }, [token, loadUser, router])

  return (
    <div className="flex h-screen items-center justify-center">
       <Loader type="default" position="center"/>
    </div>
  )
}
