import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from 'react-hot-toast'
import AuthProvider from "@/components/auth-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DeepSeek AI Clone",
  description: "A clone of DeepSeek AI built with Next.js and Express.js",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
            {children}
            <Toaster/>
        </AuthProvider>
      </body>
    </html>
  )
}
