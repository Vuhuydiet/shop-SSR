const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcryptjs");
const accountService = require("./account.service");

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        const user = await accountService.findUserByEmail(email);
        if (!user) {
          return done(null, false, {
            message: "Email or password is invalid.",
          });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, {
            message: "Email or password is invalid.",
          });
        }
        if (!user.confirmedAt) {
          return done(null, false, {
            message: `We've sent a confirmation email to ${email}. Please check your inbox.`,
            redirectUrl: `/users/confirm?email=${encodeURIComponent(email)}`,
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "/auth/google/callback",
//     },
//     async (token, tokenSecret, profile, done) => {
//       try {
//         let user = await accountService.findOrCreateGoogleUser(profile);
//         return done(null, user);
//       } catch (err) {
//         return done(err);
//       }
//     }
//   )
// );

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await accountService.findUserById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
