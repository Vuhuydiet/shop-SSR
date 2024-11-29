const express = require("express");
const router = express.Router();
const passport = require("passport");
const accountController = require("./account.controller");

router.get("/register", accountController.getRegisterPage);
router.post("/register", accountController.postRegister);
router.get("/login", accountController.getLoginPage);
router.post("/login", accountController.postLogin);
router.get("/logout", accountController.logout);
router.post("/updatePassword", accountController.updatePassword);
router.get("/confirm", accountController.getConfirmUser);
router.post("/confirm", accountController.confirmUser);
router.post("/resetPassword", accountController.resetPassword);
router.post(
  "/updatePasswordConfirm",
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
    failureRedirect: "/account/login",
  })
);

module.exports = router;
