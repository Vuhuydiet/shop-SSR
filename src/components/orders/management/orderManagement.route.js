const express = require("express");
const router = express.Router();
const { query, param, body } = require("express-validator");
const {
  handleValidationErrors,
} = require("../../../libraries/validator/validator");
const orderManagementController = require("./orderManagement.controller");
const passport = require("../../accounts/passport");
const { authorize } = require("../../accounts/account.middleware");

// Get orders list
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  authorize(["ADMIN"]),

  query("userId").optional().isInt().toInt(),
  query("status")
    .optional()
    .isIn([
      "PENDING",
      "CANCELLED",
      "CONFIRMED",
      "SHIPPING",
      "DELIVERED",
      "PAID",
    ]),
  query("startDate").optional().isISO8601().toDate(),
  query("endDate").optional().isISO8601().toDate(),
  query("minAmount").optional().isFloat().toFloat(),
  query("maxAmount").optional().isFloat().toFloat(),
  query("paymentMethod").optional().isIn(["COD", "VNPAY"]),
  query("sortBy").optional().isIn(["createdAt", "totalAmount", "status"]),
  query("order").optional().isIn(["asc", "desc"]),
  query("limit").optional().isInt().toInt(),
  query("offset").optional().isInt().toInt(),
  handleValidationErrors,

  orderManagementController.getOrders
);

router.get(
  "/:orderId",
  passport.authenticate("jwt", { session: false }),
  authorize(["ADMIN"]),

  param("orderId").isInt().toInt(),
  handleValidationErrors,

  orderManagementController.getOrderDetail
);

router.patch(
  "/:orderId/status",
  passport.authenticate("jwt", { session: false }),
  authorize(["ADMIN"]),

  param("orderId").isInt().toInt(),
  body("status").isIn([
    "PENDING",
    "CANCELLED",
    "CONFIRMED",
    "SHIPPING",
    "DELIVERED",
    "PAID",
  ]),
  handleValidationErrors,

  orderManagementController.updateOrderStatus
);

module.exports = router;
