const express = require("express");
const router = express.Router();
const { query, body, param } = require("express-validator");
const {
  handleValidationErrors,
} = require("../../libraries/validator/validator");
const orderController = require("./order.controller");

const isAuth = (req, res, next) => {
  if (!req.user) {
    return res.redirect(
      `/users/login?returnUrl=${encodeURIComponent(req.originalUrl)}`
    );
  }
  next();
};

router.use(isAuth);

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

router.get(
  "/",
  queryValidator(),
  handleValidationErrors,
  orderController.getUserOrders
);

router.get(
  "/:orderId",
  param("orderId").isInt().toInt(),
  handleValidationErrors,
  orderController.getOrderDetails
);

router.post(
  "/:orderId/cancel",
  param("orderId").isInt().toInt(),
  handleValidationErrors,
  orderController.cancelOrder
);

router.get("/:orderId/success", orderController.getSuccessPage);

module.exports = router;
