const express = require("express");
const router = express.Router();
const userController = require("./profile.controller");
const { isAuthenticated } = require("../accounts/account.middleware");

router.get("/", isAuthenticated, userController.getUserProfile);
router.get("/address", isAuthenticated, userController.getUserAddress);

module.exports = router;
