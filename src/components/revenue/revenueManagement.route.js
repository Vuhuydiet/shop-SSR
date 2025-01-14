const revenueController = require("./revenueManagement.controller");
const express = require("express");
const {query} = require("express-validator");
const passport = require("../accounts/passport");
const {authorize} = require("../accounts/account.middleware");
const {handleValidationErrors} = require("../../libraries/validator/validator");
const accountManagementController = require("../accounts/management/accountManagement.controller");
const router = express.Router();

router.get(
    "/api/revenueReport",
    query("page").optional().isInt().toInt(),
    query("pageSize").optional().isInt().toInt(),
    revenueController.getRevenueReport
)

router.get(
    "/api/topRevenueReportByProduct",
    query("page").optional().isInt().toInt(),
    query("pageSize").optional().isInt().toInt(),
    revenueController.getTopRevenueReportByProduct
)

router.get(
    "/api/user-statistic",
    passport.authenticate("jwt", { session: false }),
    authorize(["ADMIN"]),

    query("page").optional().isInt().toInt(),
    query("pageSize").optional().isInt().toInt(),
    handleValidationErrors,
    accountManagementController.getUserStatistic
)

module.exports = router;