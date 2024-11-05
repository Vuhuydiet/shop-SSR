const express = require('express');
const router = express.Router();

const productController = require('./product.controller');

router.use('/products', productController.listAllProducts);

module.exports = router;