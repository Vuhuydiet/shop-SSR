const express = require('express');
const router = express.Router();
const userController = require('./profile.controller');
const { isAuthenticated } = require('../accounts/account.middleware');


router.get('/', isAuthenticated, userController.getUserProfile);

module.exports = router;
