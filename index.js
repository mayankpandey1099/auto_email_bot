require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const passport = require("./middlewares/passportMiddleware");
const {googleRouter} = require("./routers/googleRouter");

const app = express();

app.use(cors());

app.use(
  session({
    secret: "session",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", googleRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the home page!");
});

const port = 3000 || process.env.PORT;


app.listen(port, () => {
    console.log(`Server is runnig at port ${port}`);
});

