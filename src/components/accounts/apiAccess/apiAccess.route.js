const express = require('express');
const { body } = require('express-validator');
const apiAccessController = require('./apiAccess.controller');
const router = express.Router();


router.post(
  '/api/admin/login', 
  body('username').isString().isLength({ min: 3, max: 20 }),
  body('password').isString().isLength({ min: 6, max: 20 }),
  apiAccessController.postLoginAdmin
);


module.exports = router;