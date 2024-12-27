const express = require("express");
const checkoutController = require("./checkout.controller");
const { isAuthenticated } = require("../accounts/account.middleware");
const { body, query } = require("express-validator");
const {
  handleValidationErrors,
} = require("../../libraries/validator/validator");
const router = express.Router();

router.post(
  "/submit-order",
  isAuthenticated,

  body("products").isArray(),
  body("products.*.productId").isInt().toInt(),
  body("products.*.quantity").isInt().toInt(),
  handleValidationErrors,

  checkoutController.submitOrder
);

router.get("/", isAuthenticated, checkoutController.getCheckoutPage);

module.exports = router;
