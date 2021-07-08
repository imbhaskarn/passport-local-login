const bcrypt = require("bcrypt");
const User = require("../models/user");

const localStrategy = require("passport-local").Strategy;

module.exports = function (passport) {
  passport.use(
    new localStrategy({ usernameField: "email" }, (email, password, done) => {
      User.findOne({ email: email }, (err, user) => {
        if (err) {
          console.log("findOne error " + err);
        }
        if (!user) {
          console.log(1);
          return done(null, false)
        } else {
          bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
              console.log(2);
              return done(null, false);
            }
            if (result) {
              console.log(3);
              return done(null, user);
            } else {
              console.log(4);
              return done(null, false);
            }
          });
        }
      });
    })
  );

  passport.serializeUser((user, done) =>
    done(null, { id: user.id, name: user.name })
  );
  passport.deserializeUser((id, done) => {
    return done(null, id);
  });
};
