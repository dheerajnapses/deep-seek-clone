const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const passport = require("passport")
const connectToMongoDB = require("./utils/connectdb")
const cookieParser =  require('cookie-parser')

//config passpost
require('./controllers/strategy/google-strategy')
// Load environment variables
dotenv.config()

// Initialize Express app
const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)

// Initialize Passport
app.use(passport.initialize())
 
// Routes
app.use("/api/auth", require("./routes/auth"))
app.use("/api/chats", require("./routes/chats"))
app.use("/api/conversations", require("./routes/conversations"))

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: err.message || "Something went wrong!" })
})

// Start server
app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server running on port ${PORT}`)
})
