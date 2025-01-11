const express = require("express");
const router = express.Router();
const { query, body, param } = require("express-validator");
const {
  handleValidationErrors,
} = require("../../libraries/validator/validator");
const orderController = require("./order.controller");

// Authentication middleware
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

const queryValidator = () => {
  return [
    query("page").optional().isNumeric().toInt(),
    query("limit").optional().isNumeric().toInt(),
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
    query("sortBy").optional().isString().isIn(["createdAt", "totalAmount"]),
    query("order").optional().isString().isIn(["asc", "desc"]),
  ];
};

const createOrderValidator = () => {
  return [
    body("phoneNumber").optional().isMobilePhone(),
    body("country").notEmpty().isString(),
    body("city").notEmpty().isString(),
    body("district").notEmpty().isString(),
    body("ward").notEmpty().isString(),
    body("addressDetail").optional().isString(),
    body("paymentMethod").isIn(["COD", "VNPAY"]),
    body("details").isArray(),
    body("details.*.productId").isInt(),
    body("details.*.quantity")
      .isNumeric()
      .toInt()
      .custom((value) => {
        if (value < 1) {
          throw new Error("Quantity must be at least 1");
        }
        return true;
      }),
  ];
};

router.get(
  "/",
  requireAuth,
  queryValidator(),
  handleValidationErrors,
  orderController.getUserOrders
);

router.post(
  "/",
  requireAuth,
  createOrderValidator(),
  handleValidationErrors,
  orderController.createOrder
);

router.get(
  "/:orderId",
  requireAuth,
  param("orderId").isInt().toInt(),
  handleValidationErrors,
  orderController.getOrderById
);

router.patch(
  "/:orderId/status",
  requireAuth,
  param("orderId").isInt().toInt(),
  body("status").isIn(["CONFIRMED", "SHIPPING", "DELIVERED", "PAID"]),
  handleValidationErrors,
  orderController.updateOrderStatus
);

router.post(
  "/:orderId/cancel",
  requireAuth,
  param("orderId").isInt().toInt(),
  handleValidationErrors,
  orderController.cancelOrder
);

router.get(
  "/:orderId/details",
  requireAuth,
  param("orderId").isInt().toInt(),
  handleValidationErrors,
  orderController.getOrderDetails
);

module.exports = router;
