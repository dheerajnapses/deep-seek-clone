const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20").Strategy
const jwt = require("jsonwebtoken")
const User = require("../../models/User")
const dotenv = require("dotenv")
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value })
          console.log(user)
        if (user) {
          // Update user with Google info if they previously used email/password
          if (!user.profilePicture) {
            user.profilePicture = profile.photos[0].value
            await user.save()
          }
        } else {
          // Create new user
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            profilePicture: profile.photos[0].value,
            provider: "google",
            providerId: profile.id,
          })
        }

        return done(null, user)
      } catch (error) {
        return done(error)
      }
    },
  ),
)