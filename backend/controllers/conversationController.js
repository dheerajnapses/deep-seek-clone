const Chat = require("../models/Chat")
const Conversation = require("../models/Conversation")
const { generateStreamingResponse } = require("../utils/deepseek-ai-provider")

// Send a message and get AI response (streaming)
exports.sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params
    const { message } = req.body
    console.log(message)

    if (!message || !message.content) {
      return res.status(400).json({ error: "Message content is required" })
    }

    // Verify chat belongs to user
    const chat = await Chat.findOne({
      _id: chatId,
      userId: req.user.id,
    })

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" })
    }

    // Get existing conversation or create new one
    let conversation = await Conversation.findOne({ chatId })

    if (!conversation) {
      conversation = new Conversation({
        chatId,
        messages: [],
      })
    }

    // Add user message to conversation
    const userMessage = {
      role: "user",
      content: message.content,
    }

    conversation.messages.push(userMessage)

    // Update chat timestamp
    chat.updatedAt = Date.now()
    await chat.save()

    // Save conversation with user message
    await conversation.save()

    // Set up streaming response
    res.setHeader("Content-Type", "text/event-stream")
    res.setHeader("Cache-Control", "no-cache")
    res.setHeader("Connection", "keep-alive")

    // Generate streaming response
    let assistantResponse = ""

    try {
      assistantResponse = await generateStreamingResponse(conversation.messages, (chunk) => {
        // Send chunk to client
        res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`)
      })

      const titleMatch = assistantResponse.match(/\[TITLE:\s*(.*?)\]/i)
     const cleanResponse = assistantResponse.replace(/\[TITLE:\s*.*?\]/i, "").trim()

// Add assistant response to conversation (without title tag)
conversation.messages.push({
  role: "assistant",
  content: cleanResponse,
})

      // Save conversation with assistant response
      await conversation.save()

          // If it's the first assistant response, extract title
          if(chat.title=== 'New Chat'){
            const assistantMessages = conversation.messages.filter(msg => msg.role === "assistant")
            if (assistantMessages.length === 1) {
              if (titleMatch ) {
                chat.title = titleMatch[1].trim()
                await chat.save()
              }
            }
          }
    

      // End the stream
      res.write("data: [DONE]\n\n")
      res.end()
    } catch (error) {
      console.error("Error generating response:", error)
      res.write(`data: ${JSON.stringify({ error: "Failed to generate response" })}\n\n`)
      res.end()
    }
  } catch (error) {
    console.error("Error in conversation API:", error)
    res.status(500).json({ error: error.message || "Failed to process request" })
  }
}

// Get conversation history
exports.getConversation = async (req, res) => {
  try {
    const { chatId } = req.params

    // Verify chat belongs to user
    const chat = await Chat.findOne({
      _id: chatId,
      userId: req.user.id,
    })

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" })
    }

    // Get conversation
    const conversation = await Conversation.findOne({ chatId })

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" })
    }

    // Filter out system messages for the frontend
    const messages = conversation.messages.filter((msg) => msg.role !== "system")

    res.json({ messages })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
