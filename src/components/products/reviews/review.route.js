const express = require("express");
const router = express.Router();

const reviewController = require("./review.controller");
const { param, query, body } = require("express-validator");
const {
  handleValidationErrors,
} = require("../../../libraries/validator/validator");
const { isAuthenticated, isAuthenicatedReturnsErrror } = require("../../accounts/account.middleware");

router.get(
  "/:reviewId",

  param("reviewId").isInt().toInt(),
  handleValidationErrors,

  reviewController.getReview
);

router.post(
  "/",
  isAuthenicatedReturnsErrror,

  body("productId").isInt().toInt(),
  body("rating").isInt({ min: 1, max: 5 }).toInt(),
  body("reviewContent").isString().isLength({ min: 1, max: 500 }),
  handleValidationErrors,

  reviewController.postReview
);

module.exports = router;
