const express = require("express");
const passport = require("passport");
const accountService = require("./account.service");
const productService = require("../products/product.service");
const { userSchema } = require("./account.validationSchema");
const { z } = require("zod");

// Controller methods
const getRegisterPage = async (req, res) => {
  const categories = await productService.getAllCategories();
  res.render("pages/register", { categories: categories });
};

const getLoginPage = async (req, res) => {
  const categories = await productService.getAllCategories();
  res.render("pages/login", { categories: categories });
};

const updatePassword = async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  try {
    userSchema.shape.password.parse(newPassword);

    await accountService.updatePassword(email, currentPassword, newPassword);

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
    const confirmed = await accountService.confirmUser(email, confirmationCode);

    if (confirmed) {
      const user = await accountService.findUserByEmail(email);

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
    await accountService.resetPassword(email);
    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: error.message });
  }
};

const updatePasswordWithToken = async (req, res) => {
  const { email, resetPasswordToken, newPassword } = req.body;
  try {
    const updated = await accountService.updatePassword(
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

const accountController = {
  getRegisterPage,
  getLoginPage,
  updatePassword,
  getConfirmUser,
  confirmUser,
  resetPassword,
  updatePasswordWithToken,
};

module.exports = {
  ...accountController,
};
