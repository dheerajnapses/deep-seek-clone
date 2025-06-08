const Chat = require("../models/Chat")
const Conversation = require("../models/Conversation")
const { DEFAULT_SYSTEM_MESSAGE } = require("../utils/deepseek-ai-provider")

// Get all chats for a user
exports.getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user.id }).sort({ updatedAt: -1 })
    res.json({ chats })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Create a new chat
exports.createChat = async (req, res) => {
  try {
    const { title, description } = req.body

    const chat = new Chat({
      userId: req.user.id,
      title: title || "New Chat",
      description,
    })

    await chat.save()


    res.status(201).json({ chat })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Get a specific chat
exports.getChat = async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.id,
      userId: req.user.id,
    })

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" })
    }

    // Get conversation
    const conversation = await Conversation.findOne({ chatId: req.params.id })

    // Filter out system messages for the frontend
    const messages = conversation ? conversation.messages.filter((msg) => msg.role !== "system") : []

    res.json({
      chat,
      messages,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


// Delete a chat
exports.deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.id,
      userId: req.user.id,
    })

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" })
    }

    await Chat.deleteOne({ _id: req.params.id })
    await Conversation.deleteOne({ chatId: req.params.id })

    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
