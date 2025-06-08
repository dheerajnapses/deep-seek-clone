const User = require("../models/User")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Please provide all required fields" })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" })
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      provider: "credentials",
    })

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" })
    res.cookie("auth_token",token,{
      httpOnly: true,
      sameSite:"none",
      secure:true
  })

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        provider: user.provider,
      },
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: "Please provide email and password" })
    }

    // Check if user exists
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password)

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" })

    res.cookie("auth_token",token,{
      httpOnly: true,
      sameSite:"none",
      secure:true
  })


    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        provider: user.provider,
      },
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        provider: user.provider,
      },
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Handle Google OAuth callback
exports.googleCallback = async (req, res) => {
  try {
    // Generate JWT token
    const token = jwt.sign({ id: req.user._id, email: req.user.email }, process.env.JWT_SECRET, { expiresIn: "1d" })
    res.cookie("auth_token",token,{
      httpOnly: true,
      sameSite:"none",
      secure:true
  })
    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
