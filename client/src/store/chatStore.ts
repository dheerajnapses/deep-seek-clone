import { create } from "zustand";
import api from "@/lib/api";

interface Chat {
  _id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  comment?: string;
}

interface ChatState {
  chats: Chat[];
  currentChat: Chat | null;
  messages: Message[];
  isLoading: boolean;
  isChatLoading:boolean
  error: string | null;
  isUserLoading: boolean;
  isAiLoading: boolean;
  hasFetchedChatsOnce: boolean;
  fetchChats: () => Promise<void>;
  fetchChat: (chatId: string) => Promise<void>;
  createChat: (title?: string) => Promise<Chat>;
  deleteChat: (chatId: string) => Promise<void>;
  sendMessage: (chatId: string, content: string) => Promise<void>;
}

export const useChatStore = create<ChatState>()((set, get) => ({
  chats: [],
  currentChat: null,
  messages: [],
  isLoading: false,
  error: null,
  isUserLoading: false,
  isAiLoading: false,
  hasFetchedChatsOnce: false,
  isChatLoading:false,

  fetchChats: async () => {
    try {
      set({ isChatLoading: true, error: null });
      const { data } = await api.get("/chats");
      set({ chats: data.chats, isChatLoading: false });
    } catch (error: any) {
      set({
        isChatLoading: false,
        error: error.response?.data?.error || "Failed to fetch chats",
      });
    }
  },

  fetchChat: async (chatId) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await api.get(`/chats/${chatId}`);
      set({
        currentChat: data.chat,
        messages: data.messages,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.error || "Failed to fetch chat",
      });
    }
  },

  createChat: async (title) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await api.post("/chats", { title });
      console.log("this is calling", data);
      set((state) => ({
        chats: [data.chat, ...state.chats],
        isLoading: false,
      }));
      return data.chat;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.error || "Failed to create chat",
      });
      throw error;
    }
  },

  deleteChat: async (chatId) => {
    try {
      await api.delete(`/chats/${chatId}`);
      set((state) => ({
        chats: state.chats.filter((c) => c._id !== chatId),
      }));
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.error || "Failed to delete chat",
      });
    }
  },

  sendMessage: async (chatId, content) => {
    const userMessage = { role: "user" as const, content };
    set((state) => ({
      messages: [...state.messages, userMessage],
      isUserLoading: true,
    }));

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
        }/conversations/${chatId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ message: userMessage }),
        }
      );

      if (!response.ok) throw new Error("Failed to send message");

      set({
        isUserLoading: false,
        isAiLoading: true,
      });

      const tempAssistantMessage = { role: "assistant" as const, content: "" };
      set((state) => ({ messages: [...state.messages, tempAssistantMessage] }));

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantResponse = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split("\n").filter(Boolean);
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6).trim();
              if (data === "[DONE]") continue;
              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  assistantResponse += parsed.content;
                  set((state) => {
                    const updated = [...state.messages];
                    const last = updated[updated.length - 1];
                    if (last?.role === "assistant")
                      last.content = assistantResponse;
                    return {
                      messages: updated,
                      isAiLoading: assistantResponse === "", // Keep loading until we get content
                    };
                  });
                }
              } catch (e) {
                console.error("Stream parse error:", e);
              }
            }
          }
        }
      }
      if (!get().hasFetchedChatsOnce) {
        const state = get()
        const lastMessage = state.messages[state.messages.length - 1]
        if (lastMessage?.role === "assistant" && lastMessage.content.trim().length > 0) {
            console.log('going here')
          await get().fetchChats()
        set({ hasFetchedChatsOnce: true })
      }
    }
      await get().fetchChat(chatId);
    } catch (error: any) {
      set({
        error: error.message || "Send message failed",
        isUserLoading: false,
        isAiLoading: false,
      });
      set((state) => {
        const msgs = [...state.messages];
        if (msgs[msgs.length - 1]?.role === "assistant") msgs.pop();
        return { messages: msgs };
      });
    } finally {
      set({
        isUserLoading: false,
        isAiLoading: false,
        hasFetchedChatsOnce:false
      });
    }
  },
}));
