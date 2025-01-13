const express = require("express");
const router = express.Router();

const categoryMiddleware = require("./products/category.middleware");
const homeRouter = require("./home/home.route");
const userRouter = require("./accounts/account.route");
const productRouter = require("./products/product.route");
const reviewRouter = require("./products/reviews/review.route");
const profileRouter = require("./profile/profile.route");
const cartRouter = require("./cart/cart.route");
const checkoutRouter = require("./payments/checkout.route");
const orderRouter = require("./orders/order.route");

const apiAccessRouter = require("./accounts/apiAccess/apiAccess.route");
const accountManagementRouter = require("./accounts/management/accountManagement.route");
const productManagementRouter = require("./products/management/productManagement.route");
const orderManagementRouter = require("./orders/management/orderManagement.route");
const revenueManagementRouter = require("./revenue/revenueManagement.route");

router.use("/users", accountManagementRouter);
router.use("/access", apiAccessRouter);
router.use("/products", productManagementRouter);
router.use("/orders", orderManagementRouter);

router.use("/", categoryMiddleware.getCategories);

router.use("/", homeRouter);
router.use("/users", userRouter);
router.use("/products", productRouter);
router.use("/reviews", reviewRouter);
router.use("/profile", profileRouter);
router.use("/revenue", revenueManagementRouter);
router.use("/cart", cartRouter);
router.use("/checkout", checkoutRouter);
router.use("/orders", orderRouter);

module.exports = router;
