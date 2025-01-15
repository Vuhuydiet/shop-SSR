const express = require("express");
const router = express.Router();
const passport = require("passport");
const accountController = require("./account.controller");
const authController = require("./authController");
const { isAuthenticated, isNotAuthenticated } = require("./account.middleware");

// Auth routes
router.post("/register", isNotAuthenticated, authController.postRegister);
router.post("/login", isNotAuthenticated, authController.postLogin);
router.get("/logout", isAuthenticated, authController.logout);

// User routes
router.get("/register", isNotAuthenticated, accountController.getRegisterPage);
router.get("/login", isNotAuthenticated, accountController.getLoginPage);
router.post(
  "/update-password",
  isAuthenticated,
  accountController.updatePassword
);
router.get("/confirm", accountController.getConfirmUser);
router.post("/confirm", accountController.confirmUser);
router.get("/forgot-password", accountController.getForgotPassword);
router.get("/reset-password", accountController.getResetPassword);
router.post("/reset-password-token", accountController.resetPassword);
router.post(
  "/update-password-with-token",
  accountController.updatePasswordWithToken
);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/users/login",
  })
);

module.exports = router;
