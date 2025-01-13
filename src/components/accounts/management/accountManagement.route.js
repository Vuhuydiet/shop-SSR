const express = require("express");
const router = express.Router();
const { query, param, body } = require("express-validator");
const {
  handleValidationErrors,
} = require("../../../libraries/validator/validator");
const accountManagementController = require("./accountManagement.controller");

const passport = require("../passport");
const { authorize } = require("../account.middleware");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  authorize(["ADMIN"]),

  query("fullname").optional().isString(),
  query("email").optional().isEmail(),
  query("confirmed").optional().isBoolean().toBoolean(),
  query("status").optional().isIn(["ACTIVE", "BLOCK"]),
  query("sortBy").optional().isIn(["createdAt", "fullname", "email"]),
  query("order").optional().isIn(["asc", "desc"]),
  query("limit").optional().isInt().toInt(),
  query("offset").optional().isInt().toInt(),
  query("admin").optional().isBoolean().toBoolean(),
  query("key").optional().isString(),
  handleValidationErrors,

  accountManagementController.getUsers
);

router.get(
  "/:userId",
  passport.authenticate("jwt", { session: false }),
  authorize(["ADMIN"]),

  param("userId").isInt().toInt(),
  handleValidationErrors,

  accountManagementController.getUser
);

router.patch(
  "/:userId",
  passport.authenticate("jwt", { session: false }),
  authorize(["ADMIN"]),

  param("userId").isInt().toInt(),
  body("status").isIn(["ACTIVE", "BLOCK"]),
  handleValidationErrors,

  accountManagementController.updateUserStatus
);

module.exports = router;
