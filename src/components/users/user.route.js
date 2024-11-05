const express = require('express');
const router = express.Router();
const userController = require('./user.controller');

router.get('/register', userController.getRegisterPage);
router.post('/register', userController.postRegister);

module.exports = router;