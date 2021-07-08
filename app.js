require("dotenv").config();
const express = require("express");
const { IsAuthenticated, IsnotAuthenticated } = require("./User.authenticate");
const app = express();
const userRoute = require("./routes/User.route");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const passport = require("passport");
require("./config/passport-local.config")(passport);

let URI = process.env.MONGO_URI;

// use public directory for static files
app.use(express.static("public"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

// express-session, cookies

app.use(cookieParser("secret"));
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

// ejs setup for front end

const expressLayouts = require("express-ejs-layouts");
app.use(expressLayouts);
app.set("view engine", "ejs");

// connnect to database and use options

let options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};
mongoose
  .connect(URI, options)
  .then(console.log("connetcted to database"))
  .catch((e) => console.log("error occured " + e));

//initial routes for setup
app.get("/", (req, res) => {
  res.redirect("/home");
});

app.get("/home", IsAuthenticated, (req, res) => {
  res.render("home", {name: req.user.name});
});

// New user route
app.use("/user", userRoute);

app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error = req.flash('error', "invalid username of password");
  
  next();
});
//logout route

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("user/login"); // will always fire after session is destroyed
});

app.listen(3000, () => console.log("app online on port 3000!"));
