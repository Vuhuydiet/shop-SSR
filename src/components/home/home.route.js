const express = require('express');
const router = express.Router();

const controller = require('./home.controller');

router.get('/', controller.getHomePage);


module.exports = router;