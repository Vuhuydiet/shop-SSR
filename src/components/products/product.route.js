const express = require("express");
const router = express.Router();

const productController = require("./product.controller");
const {
  handleValidationErrors,
} = require("../../libraries/validator/validator");
const { body, query, param } = require("express-validator");

const productIdValidator = () => {
  return [param("productId").isNumeric().toInt()];
};

const queryValidator = () => {
  return [
    // query('category')      .optional() .isNumeric().toInt(),
    query("categories")
      .optional()
      .custom((value) => {
        return Array.isArray(value) || Number.isFinite(Number(value));
      })
      .customSanitizer((value) => {
        if (!Array.isArray(value)) {
          return [Number(value)];
        }
        return value.map((val) => Number(val));
      }),
    query("categories.*").optional().isNumeric().toInt(),
    query("brands")
      .optional()
      .custom((value) => {
        return (
          Array.isArray(value) || (typeof value === "string" && value !== "")
        );
      })
      .customSanitizer((value) => {
        if (!Array.isArray(value)) {
          return [value];
        }
        return value;
      }),
    query("brands.*").optional().isString(),
    query("postedAfter").optional().isISO8601().toDate(),
    query("postedBefore").optional().isISO8601().toDate(),
    query("minPrice").optional().isNumeric().toFloat(),
    query("maxPrice").optional().isNumeric().toFloat(),
    query("minQuantity").optional().isNumeric().toInt(),
    query("maxQuantity").optional().isNumeric().toInt(),
    query("sortBy")
      .optional()
      .isString()
      .isIn(["currentPrice", "quantity", "publishedAt"]),
    query("order").optional().isString().isIn(["asc", "desc"]),
    query("offset").optional().isNumeric().toInt(),
    query("limit").optional().isNumeric().toInt(),
  ];
};

const keywordQueryValidator = () => {
  return [query("keyword").optional().isString()];
};

router.get(
  "/",
  keywordQueryValidator(),
  queryValidator(),
  handleValidationErrors,
  productController.getAllProducts
);

router.get(
  "/:productId",
  productIdValidator(),
  handleValidationErrors,
  productController.getProductById
);

module.exports = router;
