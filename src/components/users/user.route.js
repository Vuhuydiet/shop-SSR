const express = require("express");
const router = express.Router();
const userController = require("./user.controller");

router.get("/register", userController.getRegisterPage);
router.post("/register", userController.postRegister);
router.get("/login", userController.getLoginPage);
router.post("/login", userController.postLogin);
router.get("/logout", userController.logout);

module.exports = router;
