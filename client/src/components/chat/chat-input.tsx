"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mic, Brain, Search, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import useSpeechRecognition from "@/lib/useSpeechRecognition";

interface ChatInputProps {
  onSubmit: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSubmit, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [isSpeechActive, setIsSpeechActive] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { transcript, isListening, error } =
    useSpeechRecognition(isSpeechActive);

  useEffect(() => {
    if (transcript) {
      setInput((prevInput) => prevInput + " " + transcript);
    }
  }, [transcript]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSubmit(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  }, [input]);

  return (
    <div
      className={`w-full max-w-4xl md:ml-64 mb-4 rounded-xl bg-[#f4f4f6] py-4 px-4 shadow-[0_-1px_6px_rgba(0,0,0,0.05)]`}
    >
      <form onSubmit={handleSubmit} className="w-full">
        {/* Textarea */}
        <Textarea
          ref={textareaRef}
          placeholder={
            isListening ? "Listening..." : "Ask Anything to deepseek"
          }
          className="w-full resize-none overflow-hidden text-sm bg-transparent border-none outline-none ring-0 focus:outline-none focus:ring-0 focus:border-none focus-visible:outline-none shadow-none px-0 py-0"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          rows={1}
        />

        {/* Icons below the textarea */}
        <div className="mt-2 flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={isLoading}
              className="h-9 w-9 rounded-md border border-gray-300"
            >
              <Search className="h-5 w-5 text-gray-600" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={isLoading}
              className="h-9 w-9 rounded-md border border-gray-300"
            >
              <Brain className="h-5 w-5 text-gray-600" />
            </Button>
          </div>

          {/* Right icons */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={isLoading}
              onClick={() => setIsSpeechActive(!isSpeechActive)}
              className="h-9 w-9 rounded-md border border-gray-300"
            >
              {isListening ? (
                <Pause className="h-5 w-5 text-blue-600" />
              ) : (
                <Mic className="h-5 w-5 text-gray-600" />
              )}
            </Button>

            <Button
              type="submit"
              size="icon"
              className={cn(
                "bg-blue-600 text-white h-9 w-9 p-2 rounded-md",
                !input.trim() && "opacity-50 cursor-not-allowed"
              )}
              disabled={isLoading || !input.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
