const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const tokenStore = require("../utils/tokenStore");
const {startPolling} = require("../controllers/gmailController");

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      profile.tokens = { accessToken, refreshToken };
      tokenStore.accessToken = accessToken;
      tokenStore.refreshToken = refreshToken;
      startPolling();
      return done(null, profile);
    }
  )
);

module.exports = passport;
