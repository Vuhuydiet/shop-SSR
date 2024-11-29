// controllers/authController.js
const passport = require("passport");
const { userSchema } = require("./account.validationSchema");
const accountService = require("./account.service");

const postRegister = async (req, res) => {
  const { email, password } = req.body;

  try {
    const validatedData = userSchema.parse({ email, password });

    if (await accountService.userExists(validatedData.email)) {
      return res.status(400).json({
        message: "This email already taken. Please choose a different one.",
        ok: false,
      });
    }
    await accountService.registerUser(
      validatedData.email,
      validatedData.password
    );

    res.status(201).json({
      ok: true,
      message:
        "Registration successful. Please check your email to verify your account.",
      redirectUrl: `/confirm?email=${encodeURIComponent(validatedData.email)}`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        ok: false,
        message: error.errors[0].message,
      });
    }
    res.status(400).json({
      ok: false,
      message: error.message,
    });
    console.error(error.message);
  }
};

const postLogin = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    if (!user) {
      console.error(info);
      if (info && info.redirectUrl) {
        return res
          .status(400)
          .json({ message: info.message, redirectUrl: info.redirectUrl });
      }
      return res.status(400).json({ message: info.message });
    }

    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ message: "Internal Server Error" });
      }
      req.session.save((err) => {
        if (err) {
          return res.status(500).json({ message: "Internal Server Error" });
        }
        return res
          .status(200)
          .json({ message: "Login successful", redirectUrl: "/" });
      });
    });
  })(req, res, next);
};

const logout = async (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Internal Server Error" });
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
