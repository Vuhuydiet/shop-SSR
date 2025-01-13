const revenueController = require("./revenueManagement.controller");
const express = require("express");
const {query} = require("express-validator");
const router = express.Router();

router.get(
    "/api/revenueReport",
    query("page").optional().isInt().toInt(),
    query("pageSize").optional().isInt().toInt(),
    revenueController.getRevenueReport
)

module.exports = router;