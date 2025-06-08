const express = require("express")
const { sendMessage, getConversation } = require("../controllers/conversationController")
const { authenticateToken } = require("../middleware/auth")

const router = express.Router()

// Middleware to authenticate JWT token
router.use(authenticateToken)

// Send a message and get AI response (streaming)
router.post("/:chatId/messages", sendMessage)

// Get conversation history
router.get("/:chatId", getConversation)

module.exports = router
