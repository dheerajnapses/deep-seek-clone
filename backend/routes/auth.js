const express = require("express")
const passport = require("passport")
const { register, login, getCurrentUser, googleCallback } = require("../controllers/authController")
const { authenticateToken } = require("../middleware/auth")

const router = express.Router()


// Register new user
router.post("/register", register)

// Login user
router.post("/login", login)

// Google OAuth routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }))

router.get("/google/callback", passport.authenticate("google", { session: false }), googleCallback)

// Get current user
router.get("/me", authenticateToken, getCurrentUser)

// Logout user
router.post("/logout", (req, res) => {
  res.clearCookie("auth_token", {
    httpOnly: true,
    sameSite: "none",
    secure: true
  })

  res.json({ message: "Logged out successfully" })
})


module.exports = router
