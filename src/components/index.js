const express = require("express");
const router = express.Router();

const categoryMiddleware = require("./products/category.middleware");
const homeRouter = require("./home/home.route");
const userRouter = require("./accounts/account.route");
const productRouter = require("./products/product.route");
const profileRouter = require("./profile/profile.route");
const cartRouter = require("./cart/cart.route");
const checkoutRouter = require("./payments/checkout.route");

router.use("/", categoryMiddleware.getCategory);

router.use("/", homeRouter);
router.use("/users", userRouter);
router.use("/products", productRouter);
router.use("/profile", profileRouter);
router.use("/cart", cartRouter);
router.use("/checkout", checkoutRouter);

module.exports = router;
