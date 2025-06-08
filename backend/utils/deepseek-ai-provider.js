const OpenAI = require("openai")

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const DEFAULT_SYSTEM_MESSAGE =
  "You are DeepSeek, a helpful AI assistant. You provide accurate, informative, and friendly responses. Always be respectful, helpful, and concise in your responses. After your first message, also include a suitable chat title (in 3-8 words) in the format: [TITLE: Your generated title here]."

/**
 * Generate a streaming response from DeepSeek AI
 * @param {Array} messages - Array of conversation messages
 * @param {Function} onChunk - Callback for each chunk of the response
 * @returns {Promise<string>} - The complete response text
 */
async function generateStreamingResponse(messages, onChunk) {
  try {
    if (!messages.some((msg) => msg.role === "system")) {
      messages = [{ role: "system", content: DEFAULT_SYSTEM_MESSAGE }, ...messages]
    }

    const formattedMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }))

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini", 
      messages: formattedMessages,
      stream: true,
    });

    let fullResponse = ""

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || ""
      if (content) {
        fullResponse += content
        if (onChunk) {
          onChunk(content)
        }
      }
    }

    return fullResponse
  } catch (error) {
    console.error("Error in DeepSeek AI provider:", error)
    throw new Error("Failed to generate AI response")
  }
}

module.exports = {
  generateStreamingResponse,
}
