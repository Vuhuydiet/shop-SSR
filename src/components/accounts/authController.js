// controllers/authController.js
const passport = require("passport");
const { accountSchema } = require("./account.validationSchema");
const accountService = require("./account.service");
const {
  BadRequestError,
  InternalServerError,
} = require("../../core/ErrorResponse");
const { CreatedResponse, OKResponse } = require("../../core/SuccessResponse");

const postRegister = async (req, res) => {
  const { email, password } = req.body;

  try {
    accountSchema.parse({ email, password });
  } catch (error) {
    throw new BadRequestError({
      message: error.errors[0].message,
    });
  }

  if (await accountService.userExists(email)) {
    throw new BadRequestError({
      message: "This email already taken. Please choose a different one.",
    });
  }
  await accountService.registerUser(email, password);

  new CreatedResponse({
    message:
      "Registration successful. Please check your email to verify your account.",
    metadata: {
      redirectUrl: `/users/confirm?email=${email}`,
    },
  }).send(res);
};

const postLogin = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    if (!user) {
      if (info && info.redirectUrl) {
        // throw new BadRequestError({
        //   message: info.message,
        //   error: { redirectUrl: info.redirectUrl },
        // });
        res
          .status(400)
          .json({ message: info.message, redirectUrl: info.redirectUrl });
      }

      // throw new BadRequestError({ message: info.message });
      res.status(400).json({ message: info.message });
    }

    req.logIn(user, (err) => {
      if (err) {
        // throw new InternalServerError({ error: err });
        // res.status(500).json({ message: "Internal Server Error" });
        console.error(err);
        return;
      }

      req.session.save((err) => {
        if (err) {
          // throw new InternalServerError({ error: err });
          // throw new Error(err);
          console.error(err);
          return;
        }

        new OKResponse({
          message: "Login successful",
          metadata: { redirectUrl: "/" },
        }).send(res);
      });
    });
  })(req, res, next);
};

const logout = async (req, res) => {
  req.logout((err) => {
    if (err) {
      throw new InternalServerError({ error: err });
    }
    req.session.destroy((err) => {
      if (err) {
        throw new InternalServerError({ error: err });
      }
      res.redirect("/");
    });
  });
};

module.exports = {
  postRegister,
  postLogin,
  logout,
};
