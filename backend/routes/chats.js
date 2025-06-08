const express = require("express")
const { getChats, createChat, getChat, deleteChat } = require("../controllers/chatController")
const { authenticateToken } = require("../middleware/auth")

const router = express.Router()

// Middleware to authenticate JWT token
router.use(authenticateToken)

// Get all chats for a user
router.get("/", getChats)

// Create a new chat
router.post("/", createChat)

// Get a specific chat
router.get("/:id", getChat)

// Delete a chat
router.delete("/:id", deleteChat)

module.exports = router
