const express = require('express');
const router = express.Router();

const cartController = require('./cart.controller');
const { isAuthenticated } = require('../accounts/account.middleware');
const { body, param, query } = require('express-validator');
const { handleValidationErrors } = require('../../libraries/validator/validator');

router.get(
  '/',
  // query('productIds').optional().isArray(),
  // query('productIds.*').optional().isInt().toInt(),
  // query('quantity').optional().isArray(),
  // query('quantity.*').optional().isInt().toInt(),
  // handleValidationErrors,

  cartController.getCartPage
);

router.post(
  '/',
  isAuthenticated,

  body('productId').isInt().toInt(),
  body('quantity').optional().isInt().toInt(),
  handleValidationErrors,

  cartController.addCartItem
);

router.patch(
  '/:productId',
  isAuthenticated,

  param('productId').isInt().toInt(),
  body('quantity').isInt().toInt(),
  handleValidationErrors,

  cartController.updateCartItemQuantity
)

router.delete(
  '/:productId',
  isAuthenticated,

  param('productId').isInt().toInt(),
  handleValidationErrors,

  cartController.deleteCartItem
)

module.exports = router;