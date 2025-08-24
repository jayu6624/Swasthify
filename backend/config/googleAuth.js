const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user.model");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Google OAuth profile:", {
          id: profile.id,
          displayName: profile.displayName,
          email: profile.emails[0].value
        });

        // Check if user already exists
        let user = await User.findOne({ email: profile.emails[0].value });
        console.log("Existing user found:", user ? "Yes" : "No");

        if (user) {
          // User exists, return user
          console.log("Returning existing user:", user._id);
          return done(null, user);
        } else {
          // Create new user
          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            isEmailVerified: true, // Google emails are verified
            profilePicture: profile.photos[0]?.value || null,
          });

          await user.save();
          console.log("Created new user:", user._id);
          return done(null, user);
        }
      } catch (error) {
        console.error("Google OAuth strategy error:", error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
