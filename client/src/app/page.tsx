"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"
import { ChatInput } from "@/components/chat/chat-input"
import { ChatSidebar } from "@/components/chat/chat-sidebar"
import { useChatStore } from "@/store/chatStore"

export default function Home() {
  const { isAuthenticated, isLoading } = useAuthStore()
  const { createChat, isLoading: chatLoading } = useChatStore()
  const router = useRouter()


  const handleSendMessage = async (message: string) => {
    if (isAuthenticated && !chatLoading) {
      try {
        const chat = await createChat("New Chat")
        console.log(chat)
        router.push(`/chat/${chat._id}?message=${encodeURIComponent(message)}`)
      } catch (error) {
        console.error("Error sending message:", error)
      }
    }
  }

  return (
    <div className="flex h-screen">
      <ChatSidebar />
      <div className="flex flex-col mt-60  mx-auto">
        <div className="flex flex-col items-center gap-2 md:ml-40">
          <div className="flex items-center gap-4  justify-center">
            <div className="h-16 w-16">
              <img src="/images/deepseek-small-logo.svg" alt="DeepSeek Logo" className="h-full w-full" />
            </div>
            <h2 className="text-2xl font-bold">Hi, I'm DeepSeek.</h2>
          </div>
          <p className="text-center text-muted-foreground">How can I help you today?</p>
        </div>
        <div className="fixed left-0 top-30 right-0 bottom-0 mx-auto flex px-4 justify-center items-center">
                <ChatInput onSubmit={handleSendMessage} isLoading={isLoading} />
              </div>
      </div>
    </div>
  )
}