const express = require("express");
const router = express.Router();

const productController = require("./product.controller");
const { handleValidationErrors } = require("../../libraries/validator/validator");
const { query, param } = require("express-validator");
const reviewController = require("./reviews/review.controller");

const queryValidator = () => {
  return [
    query("page").optional().isNumeric().toInt(),
    query("limit").optional().isNumeric().toInt(),
    query("keyword").optional().isString(),
    query("category").optional().isNumeric().toInt(),
    query("brand").optional().isNumeric().toInt(),
    query("postedAfter").optional().isISO8601().toDate(),
    query("postedBefore").optional().isISO8601().toDate(),
    query("minPrice").optional().isNumeric().toFloat(),
    query("maxPrice").optional().isNumeric().toFloat(),
    query("minRating").optional().isNumeric().toFloat(),
    query("maxRating").optional().isNumeric().toFloat(),
    query("minQuantity").optional().isNumeric().toInt(),
    query("maxQuantity").optional().isNumeric().toInt(),
    query("sortBy").optional().isString().isIn(["currentPrice", "quantity", "publishedAt"]),
    query("order").optional().isString().isIn(["asc", "desc"]),
    query("offset").optional().isNumeric().toInt(),
    query("limit").optional().isNumeric().toInt(),
  ];
};


router.get(
  "/",
  queryValidator(),
  handleValidationErrors,
  productController.getAllProductsJSON
);

router.get(
    "/api",
    queryValidator(),
    handleValidationErrors,
    productController.getAllProductsJSON
);

router.get(
  "/:productId",
  param("productId").isNumeric().toInt(),
  handleValidationErrors,
  productController.getProductById
);


router.get(
  '/:productId/reviews',

  param('productId').isInt().toInt(),
  query('page').optional().isInt().toInt(),
  query('limit').optional().isInt().toInt(),
  query('rating').optional().isInt().toInt(),
  query('sortBy').optional().isIn(['createdAt']),
  handleValidationErrors,

  reviewController.getReviews
)

module.exports = router;
