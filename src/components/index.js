const express = require('express');
const router = express.Router();

const userRouter = require('./users/user.route');
const productRouter = require('./products/product.route');
const categoryMiddleware = require('./products/category.middleware');

router.use('/', categoryMiddleware.getCategory);

router.use('/users', userRouter);
router.use('/products', productRouter);

module.exports = router;