const express = require("express");
const passport = require("passport");
const userService = require("./user.service");
const productService = require("../products/product.service");
const { z } = require("zod");
const router = express.Router();

const userSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
});

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  res.redirect("/login");
};

// Middleware to check if user is NOT authenticated (for login/register pages)
const isNotAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return res.redirect("/");
  }
  next();
};

// Controller methods
const getRegisterPage = async (req, res) => {
  const categories = await productService.getAllCategories();
  res.render("pages/register", { categories: categories });
};

const postRegister = async (req, res) => {
  const { email, password } = req.body;

  try {
    const validatedData = userSchema.parse({ email, password });

    if (await userService.userExists(validatedData.email)) {
      return res.status(400).json({
        message: "This email already taken. Please choose a different one.",
        ok: false,
      });
    }
    await userService.registerUser(validatedData.email, validatedData.password);

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

const getLoginPage = async (req, res) => {
  const categories = await productService.getAllCategories();
  res.render("pages/login", { categories: categories });
};

const postLogin = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    if (!user) {
      console.log(info);
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
        return res.status(200).json({ message: "Login successful" });
      });
    });
  })(req, res, next);
};

const logout = async (req, res) => {
  req.session.destroy();
  res.redirect("/");
};

const updatePassword = async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  try {
    userSchema.shape.password.parse(newPassword);

    await userService.updatePassword(email, currentPassword, newPassword);

    res.status(200).json({
      ok: true,
      message: "Password updated successfully",
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

const getConfirmUser = async (req, res) => {
  const email = req.query.email;
  const categories = await productService.getAllCategories();

  res.render("pages/confirmCode", { categories: categories, email: email });
};

const confirmUser = async (req, res) => {
  const { email, confirmationCode } = req.body;
  try {
    const confirmed = await userService.confirmUser(email, confirmationCode);
    if (confirmed) {
      const user = await userService.findUserByEmail(email);
      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Internal Server Error" });
        }
        req.session.save((err) => {
          if (err) {
            return res.status(500).json({ message: "Internal Server Error" });
          }
          return res.status(200).json({
            message: "Account confirmed and logged in successfully",
            redirectUrl: "/",
          });
        });
      });
    } else {
      res.status(400).json({ message: "Invalid confirmation code" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const resetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    await userService.resetPassword(email);
    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: error.message });
  }
};

const updatePasswordWithToken = async (req, res) => {
  const { email, resetPasswordToken, newPassword } = req.body;
  try {
    const updated = await userService.updatePassword(
      email,
      resetPasswordToken,
      newPassword
    );
    if (updated) {
      res.status(200).json({ message: "Password updated successfully" });
    } else {
      res.status(400).json({ message: "Invalid reset token" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const userController = {
  getRegisterPage,
  postRegister,
  getLoginPage,
  postLogin,
  logout,
  updatePassword,
  getConfirmUser,
  confirmUser,
  resetPassword,
  updatePasswordWithToken,
};

module.exports = {
  ...userController,
  isAuthenticated,
  isNotAuthenticated,
};
