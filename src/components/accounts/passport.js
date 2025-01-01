const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const accountService = require("./account.service");
const { validatePassword, getHashedPassword } = require("./password");
const env = require("../../config/env");

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
        const isMatch = validatePassword(password, user.hashedPassword);
        if (!isMatch) {
          return done(null, false, {
            message: "Email or password is invalid.",
          });
        }
        // if (!user.confirmed) {
        //   return done(null, false, {
        //     message: `We've sent a confirmation email to ${email}. Please check your inbox.`,
        //     redirectUrl: `/users/confirm?email=${email}`,
        //   });
        // }

        await accountService.updateLastLogin(user.userId);
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/users/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      let user = await accountService.findUserByEmail(profile.emails[0].value);
        
      if (!user) {
          user = await accountService.createUser({
            oauthId: profile.id,
            oauthProvider: "google",
            email: profile.emails[0].value,
            fullname: profile.displayName,
            hashedPassword: getHashedPassword('thisisasecretpassword%#&!(theymaynotguessed!@#!@3becauseIam!@#!@toolazytohandlethis'),
            // profilePicture: profile.photos[0].value,
          });
      } 
      return done(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.userId);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await accountService.findUserById(id);
    done(null, user);
  } catch (err) {
    done(err, false);
  }
});


passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.JWT_PUBLIC_KEY,
      algorithms: ['RS256'],
    },
    async (jwt_payload, done) => {
      try {
        const { userId, role } = jwt_payload.sub;
        const user = role === 'USER' ? 
          await accountService.findUserById(userId) :
          await accountService.findAdminById(userId);
        return done(null, { userId, role });
      } catch (err) {
        return done(err, false);
      }
    },
  ),
);


module.exports = passport;
