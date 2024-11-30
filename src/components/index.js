const express = require('express');
const router = express.Router();

const categoryMiddleware = require('./products/category.middleware');
const homeRouter = require('./home/home.route');
const userRouter = require('./users/user.route');
const productRouter = require('./products/product.route');
const profileRouter=require('./profile/profile.route');
router.use('/', categoryMiddleware.getCategory);

router.use('/', homeRouter);
router.use('/users', userRouter);
router.use('/products', productRouter);
router.use('/profile', profileRouter);

module.exports = router;