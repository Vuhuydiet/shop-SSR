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

// Get products list
router.get(
  "/api",
  passport.authenticate("jwt", { session: false }),
  authorize(["ADMIN"]),

  query("productName").optional().isString(),
  query("status").optional().isIn(["PUBLISHED", "UNPUBLISHED", "DELETED"]),
  query("brandId").optional().isInt().toInt(),
  query("categoryId").optional().isInt().toInt(),
  query("minPrice").optional().isInt().toInt(),
  query("maxPrice").optional().isInt().toInt(),
  query("sortBy")
    .optional()
    .isIn(["productName", "currentPrice", "publishedAt", "stock"]),
  query("order").optional().isIn(["asc", "desc"]),
  query("limit").optional().isInt().toInt(),
  query("offset").optional().isInt().toInt(),
  handleValidationErrors,

  productManagementController.getProducts
);

// Get single product
router.get(
  "/api/:productId",
  passport.authenticate("jwt", { session: false }),
  authorize(["ADMIN"]),

  param("productId").isInt().toInt(),
  handleValidationErrors,

  productManagementController.getProduct
);

// Create product
router.post(
  "/api",
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
  "/api/:productId",
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
  "/api/:productId",
  passport.authenticate("jwt", { session: false }),
  authorize(["ADMIN"]),

  param("productId").isInt().toInt(),
  handleValidationErrors,

  productManagementController.deleteProduct
);

module.exports = router;
