const express = require("express");
const router = express.Router();

const controller = require("./home.controller");

router.get("/", controller.getHomePage);
router.get("/about", controller.getAboutPage);
// router.get('/contact', controller.getContactPage);.

module.exports = router;
