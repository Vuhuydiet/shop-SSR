const express = require('express');
const router = express.Router();
const authenticate = require('./profile.middleware');
const { getUserProfile } = require('./profile.controller');


router.get('/', authenticate, getUserProfile);

module.exports = router;
