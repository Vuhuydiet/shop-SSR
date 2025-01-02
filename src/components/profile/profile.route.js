const express = require("express");
const router = express.Router();
const addressController = require("./address.controller");
const userController = require("./profile.controller");
const { isAuthenticated } = require("../accounts/account.middleware");
const { z } = require("zod");
const profileController = require("./profile.controller");
const { param, body } = require("express-validator");
const { handleValidationErrors } = require("../../libraries/validator/validator");

const addressSchema = z.object({
  recipientName: z
    .string()
    .min(3, "Recipient name must be at least 3 characters"),
  phoneNumber: z.string().regex(/^[+]*\d{10,11}$/, "Invalid phone number"),
  country: z.string().min(3, "Country must be at least 3 characters"),
  city: z.string().min(3, "City must be at least 3 characters"),
  district: z.string().min(2, "District must be at least 2 characters"),
  ward: z.string().min(2, "Ward must be at least 2 characters"),
  detailAddress: z
    .string()
    .min(3, "Detail address must be at least 3 characters"),
});

const paramSchema = z.object({
  addressId: z.string().regex(/^\d+$/, "Address ID must be numeric"),
});

const validateAddress = async (req, res, next) => {
  try {
    await addressSchema.parseAsync(req.body);
    next();
  } catch (error) {
    res.status(400).json({
      status: "error",
      errors: error.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }
};

const validateAddressId = async (req, res, next) => {
  try {
    await paramSchema.parseAsync(req.params);
    next();
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Invalid address ID",
    });
  }
};

router.get("/", isAuthenticated, userController.getUserProfile);
router.get("/address", isAuthenticated, addressController.renderAddressPage);
router.get(
  "/api/address/:addressId",
  isAuthenticated,
  addressController.getAddressById
);
router.get("/api/address", isAuthenticated, addressController.getUserAddresses);
router.get(
  "/address/add",
  isAuthenticated,
  addressController.getAddAddressPage
);
router.get(
  "/address/:addressId",
  isAuthenticated,
  addressController.getUpdateAddressPage
);

router.post(
  "/api/address/add",
  isAuthenticated,
  validateAddress,
  addressController.postAddAddress
);

router.put(
  "/address/edit/:addressId",
  isAuthenticated,
  validateAddressId,
  validateAddress,
  addressController.updateAddress
);

router.delete(
  "/api/address/:addressId",
  isAuthenticated,
  validateAddressId,
  addressController.deleteAddress
);

router.get(
  '/api/:adminId',

  param('adminId').isNumeric().withMessage('Admin ID must be numeric').toInt(),
  handleValidationErrors,

  profileController.getAdminProfile
);

router.patch(
  '/api/admin',
  body('dob').optional().isISO8601().toDate(),
  body('email').optional().isEmail(),
  body('fullname').optional().isString(),
  body('gender').optional().isIn(['male', 'female']),
  handleValidationErrors,

  profileController.updateAdminProfile
);

module.exports = router;
