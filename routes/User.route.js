const express = require("express");
const passport = require("passport");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { authSchema } = require("../models/joi.schema");
const { IsAuthenticated, IsnotAuthenticated } = require("../User.authenticate");
require("../config/passport-local.config")(passport);

router.get("/register", IsnotAuthenticated, (req, res) => {
  res.render("register");
});
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const { value, error } = authSchema.validate(req.body);

    const valid = error == null;

    if (!valid) {
      req.flash("error_msg", "Input by user is not valid");
      res.render("register", {
        notValid: req.flash("error_msg"),
      });
    }
    User.findOne({
      email: value.email,
    })
      .then(async (user) => {
        if (user != null) {
          req.flash("_msg", "Email is already registered, Login!");
          res.render("login", { msg: req.flash("_msg") });
        } else {
          await bcrypt
            .hash(password, 10)
            .then(async (hash) => {
              let newUser = await new User({
                name,
                email,
                password: hash,
              });
              await newUser
                .save()
                .then((user) => {
                  req.flash(
                    "_msg",
                    "You have registered successfully! " + user.name
                  );
                  res.render("login", {
                    _msg: req.flash("_msg"),
                  });
                })
                .then((err) => {
                  if (err) {
                    throw err;
                  }
                });
            })
            .then((err) => {
              if (err) {
                throw err;
              }
            });
        }
      })
      .then((err) => {
        if (err) {
          throw err;
        }
      });
  } catch (err) {
    console.log(" an error occured" + err);
  }
});
router.get("/login", (req, res) => {
  res.render("login", {error: req.flash('error') });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/user/login",
    failuireFlash: true
  })
);
module.exports = router;
