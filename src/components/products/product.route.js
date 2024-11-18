const express = require('express');
const router = express.Router();

const productController = require('./product.controller');
const { handleValidationErrors } = require('../../libraries/validator/validator');
const { body, query, param } = require('express-validator');


const productIdValidator = () => {
  return [
    param('productId').isNumeric().toInt(),
  ];
}

const productDataValidator = () => {
  return [
    body('productData')                                 .isJSON()   .customSanitizer(JSON.parse),
    body('productData.name')                .isString(),
    body('productData.price')               .isNumeric(),
    body('productData.quantity')            .optional().isNumeric(),
    body('productData.brand')               .optional() .isString(),
    body('productData.description')         .optional() .isString(),
    body('productData.imageUrl')            .optional() .isString(),
    body('productData.categories')          .optional() .isObject(),
    body('productData.categories.add')      .optional() .isArray(),
    body('productData.categories.add.*')    .optional() .isNumeric(),
    body('productData.categories.remove')   .optional() .isArray(),
    body('productData.categories.remove.*') .optional() .isNumeric(),
  ];
}

const queryValidator = () => {
  return [
    query('category')      .optional() .isNumeric().toInt(),
    query('brand')         .optional() .isString(),
    query('postedAfter')   .optional() .isISO8601().toDate(),
    query('postedBefore')  .optional() .isISO8601().toDate(),
    query('minPrice')      .optional() .isNumeric().toFloat(),
    query('maxPrice')      .optional() .isNumeric().toFloat(),
    query('minQuantity')   .optional() .isNumeric().toInt(),
    query('maxQuantity')   .optional() .isNumeric().toInt(),
    query('sortBy')        .optional() .isString(),
    query('order')         .optional() .isString(),
    query('offset')        .optional() .isNumeric().toInt(),
    query('limit')         .optional() .isNumeric().toInt(),
  ];
}

const keywordQueryValidator = () => {
  return [
    query('keyword').optional().isString(),
  ];
}

router.get(
  '/',
  keywordQueryValidator(),
  queryValidator(),
  handleValidationErrors,
  productController.getAllProducts
)

router.get(
  '/:productId',
  productIdValidator(),
  handleValidationErrors,
  productController.getProductById
)

module.exports = router;