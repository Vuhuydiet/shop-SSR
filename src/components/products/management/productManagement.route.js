const express = require("express");
const router = express.Router();
const { query, param, body } = require("express-validator");
const {
  handleValidationErrors,
} = require("../../../libraries/validator/validator");
const productManagementController = require("./productManagement.controller");
const passport = require("./../../accounts/passport");
const { authorize } = require("./../../accounts/account.middleware");

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const queryValidator = () => {
  return [
    query("page").optional().isNumeric().toInt(),
    query("limit").optional().isNumeric().toInt(),
    query("keyword").optional().isString(),
    query("categories")
      .optional()
      .customSanitizer((value) => {
        const values = Array.isArray(value) ? value : [value];
        return values.map((value) => parseInt(value));
      })
      .custom((values) => {
        return !values.some((value) => {
          return isNaN(value);
        });
      }),
    query("brands")
      .optional()
      .customSanitizer((value) => {
        const values = Array.isArray(value) ? value : [value];
        return values.map((value) => parseInt(value));
      })
      .custom((values) => {
        // console.log(values);
        return !values.some((value) => {
          return isNaN(value);
        });
      })
      .withMessage("failed"),
    query("postedAfter").optional().isISO8601().toDate(),
    query("postedBefore").optional().isISO8601().toDate(),
    query("minPrice").optional().isNumeric().toFloat(),
    query("maxPrice").optional().isNumeric().toFloat(),
    query("minRating").optional().isNumeric().toFloat(),
    query("maxRating").optional().isNumeric().toFloat(),
    query("minQuantity").optional().isNumeric().toInt(),
    query("maxQuantity").optional().isNumeric().toInt(),
    query("status")
      .optional()
      .isString()
      .isIn(["PUBLISHED", "UNPUBLISHED", "DELETED"]),
    query("sortBy")
      .optional()
      .isString()
      .isIn(["currentPrice", "quantity", "publishedAt", "totalPurchase"]),
    query("order").optional().isString().isIn(["asc", "desc"]),
    query("offset").optional().isNumeric().toInt(),
    query("limit").optional().isNumeric().toInt(),
    query("searchTerm").optional().isString(),
  ];
};

router.get(
  '/categories',

  productManagementController.getCategories
);

router.get(
  '/brands',
  productManagementController.getBrands
);

// Get products list
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  authorize(["ADMIN"]),

  queryValidator(),
  handleValidationErrors,

  productManagementController.getProducts
);

// Get single product
router.get(
  "/:productId",
  passport.authenticate("jwt", { session: false }),
  authorize(["ADMIN"]),

  param("productId").isInt().toInt(),
  handleValidationErrors,

  productManagementController.getProduct
);

// Create product
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  authorize(["ADMIN"]),
  upload.array("images", 5),

  body("productName").isString().notEmpty(),
  body("productDescription").optional().isString(),
  body("brandId").isInt().toInt(),
  body("categoryId").isInt().toInt(),
  body("stock").isInt().toInt(),
  body("currentPrice").isInt().toInt(),
  body("originalPrice").isInt().toInt(),
  body("status").optional().isIn(["PUBLISHED", "UNPUBLISHED"]),
  body("productImages").isArray(),
  body("productImages.*.publicId").isString(),
  body("productImages.*.url").isString(),
  handleValidationErrors,

  productManagementController.createProduct
);

// Update product
router.patch(
  "/:productId",
  passport.authenticate("jwt", { session: false }),
  authorize(["ADMIN"]),
  upload.array("images", 5),

  param("productId").isInt().toInt(),
  body("productName").optional().isString(),
  body("productDescription").optional().isString(),
  body("brandId").optional().isInt().toInt(),
  body("categoryId").optional().isInt().toInt(),
  body("stock").optional().isInt().toInt(),
  body("currentPrice").optional().isInt().toInt(),
  body("originalPrice").optional().isInt().toInt(),
  body("status").optional().isIn(["PUBLISHED", "UNPUBLISHED", "DELETED"]),
  body("productImages").optional().isArray(),
  body("productImages.*.publicId").optional().isString(),
  body("productImages.*.url").optional().isString(),
  handleValidationErrors,

  productManagementController.updateProduct
);

// Delete product
router.delete(
  "/:productId",
  passport.authenticate("jwt", { session: false }),
  authorize(["ADMIN"]),

  param("productId").isInt().toInt(),
  handleValidationErrors,

  productManagementController.deleteProduct
);

module.exports = router;
