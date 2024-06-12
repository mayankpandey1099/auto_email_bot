const passport = require("../middlewares/passportMiddleware");
const express = require("express");
const googleRouter = express.Router();

googleRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "profile",
      "email",
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/gmail.send",
    ],
    accessType: "offline",
    prompt: "consent",
  })
);

googleRouter.get(
  "/google/callback",
  passport.authenticate("google"),
  (req, res) => {
    try {
      res.redirect("/");
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  }
);


module.exports = { googleRouter };
