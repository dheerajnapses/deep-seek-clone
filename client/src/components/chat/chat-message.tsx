import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Markdown } from "@/components/markdown"
import { useAuthStore } from "@/store/authStore"
import { Copy, ThumbsUp, ThumbsDown } from "lucide-react" // Assuming you're using lucide-react for icons
import { useState, useEffect } from "react" // For showing "Copied" notification
import toast from "react-hot-toast";
import { Loader } from "../Loader"

interface ChatMessageProps {
  message: {
    role: "user" | "assistant" | "system"
    content: string
    comment?: string
  }
  isUserLoading?: boolean
  isAiLoading?: boolean
}

export function ChatMessage({ message,  isUserLoading, isAiLoading }: ChatMessageProps) {
  const { user } = useAuthStore()

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content)
    toast.success('copied')
  }


  return (
    <div
      className={cn(
        "flex w-full items-start gap-4 p-4 rounded-lg",
        message.role === "user" ? "bg-blue-50 mt-10" : "bg-muted/50 ",
        "mb-4 relative" // gap between messages
      )}
    >
      {/* Avatar */}
      <Avatar className="h-8 w-8">
        {message.role === "user" ? (
          user?.profilePicture ? (
            <AvatarImage src={user.profilePicture || "/placeholder.svg"} alt={user.name} />
          ) : (
            <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
          )
        ) : (
          <AvatarImage src="/images/deepseek-small-logo.svg" alt="DeepSeek" />
        )}
      </Avatar>

      {/* Message content */}
      <div className="flex-1 space-y-2">
        {message.role === "user" && isUserLoading ? (
          <Loader type="user" position="left" className="mr-2" />
        ) : message.role === "assistant" && isAiLoading ? (
          <Loader type="ai" />
        ) : (
          <div className="prose prose-sm max-w-none">
            <Markdown content={message.content} />
          </div>
        )}
      </div>

 

      {/* Icons */}
      {message.role === "user" ? (
        // User's message - Copy icon on the right side
        <div className="absolute right-4 top-1/2 mt-4 transform -translate-y-1/2">
          <Copy
            className="h-5 w-5 text-gray-600 cursor-pointer"
            onClick={() => handleCopy(message.content)}
          />
        </div>
      ) : (
        <div className="absolute left-4 -bottom-10 transform -translate-y-1/2 flex gap-3 ">
          <Copy
            className="h-5 w-5 text-gray-600 cursor-pointer"
            onClick={() => handleCopy(message.content)}
          />

         <ThumbsUp
            className="h-5 w-5 text-green-500 cursor-pointer"
            onClick={() => console.log("Liked")}
          />
          <ThumbsDown
            className="h-5 w-5 text-red-500 cursor-pointer"
            onClick={() => console.log("Disliked")}
          />

        </div>
      )}
    </div>
  )
}
