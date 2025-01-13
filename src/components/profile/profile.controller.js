const { matchedData } = require("express-validator");
const multer = require("multer");
const path = require("path");
const ProfileService = require("./profile.service");
const { OKResponse, CreatedResponse} = require("../../core/SuccessResponse");
const {accountSchema} = require("../accounts/account.validationSchema");
const {BadRequestError} = require("../../core/ErrorResponse");
const accountService = require("../accounts/account.service");
const {Logger} = require("winston");
const cloudService = require("../clouds/cloud.service");

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new BadRequestError({ message: "Invalid file type. Only JPEG, PNG, and GIF are allowed." }));
    }
  },
}).single("avatar");

module.exports = {
  getUserProfile: (req, res) => {
    res.render("pages/profile", {
      user: req.user,
    });
  },

  getUserProfileChangePassword: (req, res) => {
    res.render("pages/profileChangePassword", {
      user: req.user
    })
  },

  getUserProfileInformation: async (req, res) => {
    res.render("pages/profileUpdate", {
      user: req.user
    })
  },

  updateProfile: async (req, res) => {
    const { fullName, numberPhone } = req.body;

    await accountService.updateUser(req.user.email, fullName, numberPhone);

    new CreatedResponse({
      message:
          "Update profile successful.",
    }).send(res);

  },

  getUserReviews: async (req, res) => {
    res.render("pages/profileReviews", {
        user: req.user
    })
  },

  updateAvatar: async (req, res) => {
    const user=req.user;
    const oldImgID = user.publicImgId;
    console.log(oldImgID);
    upload(req, res, async (err) => {
      if (err) {
        return new BadRequestError({ message: err.message || "File upload failed." }).send(res);
      }
      if (!req.file) {
        return new BadRequestError({ message: "No file uploaded." }).send(res);
      }

      try {
        const uploadedFile = await cloudService.uploadImage(req.file);
        console.log("uploadedFile", uploadedFile);
        await accountService.updateAvatar(req.user.email, uploadedFile.publicId, uploadedFile.url);

        if (oldImgID) {
          await cloudService.deleteImage(oldImgID);
        }

        new OKResponse({
          message: "Avatar uploaded successfully!",
        }).send(res);
      } catch (uploadError) {
        console.error("Error uploading avatar:", uploadError);
        new BadRequestError({ message: "Failed to upload avatar." }).send(res);
      }
    });
  },
/*
  updateAvatar: async (req, res) => {
    const form = req.body;
    console.log(req.body);
    /*
    const user = req.user;
    const oldImgID = user.publicImgId;

    if (!avatar) {
      throw new BadRequestError("No file uploaded");
    }

    try {
      const result = await cloudService.uploadImage(avatar.path);
      await accountService.updateAvatar(user.email, result.publicId, result.url);
      if (oldImgID) {
        await cloudService.deleteImage(oldImgID);
      }
    } catch (error) {
      throw new BadRequestError("Failed to upload image to cloud");
    }

    new CreatedResponse({
      message: "Avatar updated successfully"
    }).send(res);
  },
    */

  changePassword: async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    let isCompleted = await accountService.changePassword(req.user.email, oldPassword, newPassword);
    if (!isCompleted) {
      throw new BadRequestError({ message: "Invalid password" });
    }
    else {
        new OKResponse({ message: "Password updated successfully" }).send(res);
    }
  },

  getAdminProfile: async (req, res) => {
    const { adminId } = matchedData(req);

    const profile = await ProfileService.getAdminProfile(adminId);

    new OKResponse({
      message: "Admin profile retrieved",
      metadata: { profile },
    }).send(res);
  },

  updateAdminProfile: async (req, res) => {
    const { userId } = req.user;
    const data = matchedData(req);

    const updatedProfile = await ProfileService.updateAdminProfile(
      userId,
      data
    );

    new OKResponse({
      message: "Admin profile updated",
      metadata: { profile: updatedProfile },
    }).send(res);
  },
};
