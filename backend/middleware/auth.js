const jwt = require("jsonwebtoken")

const authenticateToken = (req, res, next) => {
  // Get token from header
  const token = req?.cookies?.auth_token;

  if (!token) {
    return res.status(401).json({ error: "No token, authorization denied" })
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ error: "Token is not valid" })
  }
}

module.exports = { authenticateToken }
