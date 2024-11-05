const express = require('express');
const router = express.Router();

const productController = require('./product.controller');

router.get('/', productController.listAllProducts);
//router.get('/a', productController.getProductById);


module.exports = router;