require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const passport = require("./middlewares/passport");
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

const port = 3000;


app.listen(port, () => {
    console.log(`Server is runnig at port ${port}`);
});

