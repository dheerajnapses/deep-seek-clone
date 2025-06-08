"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore"
import { useRouter } from "next/navigation"

export default function SignUp() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const { register, isLoading } = useAuthStore()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error( "Passwords do not match",)
      return
    }
    try {
      const user = await register(name, email, password)
      console.log(user)
      toast.success(`Account created successfully`)
      router.push('/')
    } catch (error: any) {
      toast.error(error.message || "Failed to register")
    }
  }


  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
             <div className="flex justify-center mb-12">
                    <Image src="/images/deepseek-logo.svg" alt="DeepSeek Logo" width={230} height={230} className="rounded-full" />
                </div>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-semibold">Create an account</CardTitle>
          <CardDescription>Enter your information to create an account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Input
                  id="name"
                  placeholder="Full name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  required
                />
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Input
                  id="email"
                  placeholder="Email address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Input
                  id="password"
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Input
                  id="confirmPassword"
                  placeholder="Confirm password"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                  required
                />
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              </div>
            </div>
         
            <div className="text-left  text-xs text-gray-500">
            By signing up or logging in, you consent to DeepSeek's{" "}
          <a href="#" className="text-black underline">
            Terms of Use
          </a>{" "}
          and{" "}
          <a href="#" className="text-black underline">
            Privacy Policy
          </a>
          .
            </div>
            <Button type="submit" className="w-full bg-blue-500" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Sign up"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Button variant="link" className="p-0" asChild>
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}
