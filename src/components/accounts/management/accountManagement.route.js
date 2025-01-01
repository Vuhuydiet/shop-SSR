const express = require('express');
const { query, param } = require('express-validator');
const { handleValidationErrors } = require('../../../libraries/validator/validator');
const accountManagementController = require('./accountManagement.controller');
const { isAuthenicatedReturnsErrror, authorize } = require('../account.middleware');
const router = express.Router();

router.get(
  '/api',
  isAuthenicatedReturnsErrror,
  authorize(['ADMIN']),

  query('fullname').optional().isString(),
  query('email').optional().isEmail(),
  query('confirmed').optional().isBoolean().toBoolean(),
  query('status').optional().isIn(['ACTIVE', 'BLOCK']),
  query('orderBy').optional().isIn(['createdAt', 'fullname', 'email']),
  query('order').optional().isIn(['asc', 'desc']),
  query('limit').optional().isInt().toInt(),
  query('offset').optional().isInt().toInt(),
  handleValidationErrors,

  accountManagementController.getUsers
);

router.get(
  '/api/:userId',
  isAuthenicatedReturnsErrror,
  authorize(['ADMIN']),

  param('userId').isInt().toInt(),
  handleValidationErrors,


  accountManagementController.getUser
)

router.patch(
  '/api/:userId',
  isAuthenicatedReturnsErrror,
  authorize(['ADMIN']),

  query('status').isIn(['ACTIVE', 'BLOCK']),
  handleValidationErrors,

  accountManagementController.updateUserStatus
)

module.exports = router;