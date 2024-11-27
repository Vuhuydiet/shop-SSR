const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("./user.controller");

router.get("/register", userController.getRegisterPage);
router.post("/register", userController.postRegister);
router.get("/login", userController.getLoginPage);
router.post("/login", userController.postLogin);
router.get("/logout", userController.logout);
router.post("/updatePassword", userController.updatePassword);
router.get("/confirm", userController.getConfirmUser);
router.post("/confirm", userController.confirmUser);
router.post("/resetPassword", userController.resetPassword);
router.post("/updatePasswordConfirm", userController.updatePasswordWithToken);

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
