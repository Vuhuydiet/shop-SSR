const { matchedData } = require("express-validator");
const ProfileService = require("./profile.service");
const { OKResponse, CreatedResponse} = require("../../core/SuccessResponse");
const {accountSchema} = require("../accounts/account.validationSchema");
const {BadRequestError} = require("../../core/ErrorResponse");
const accountService = require("../accounts/account.service");
const {Logger} = require("winston");
const cloudService = require("../clouds/cloud.service");

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

  updateAvatar: async (req, res) => {
    const {avatar} = req.body;
    const user = req.user;
    const oldImgID= user.publicImgId;

    try {
      const result = await cloudService.uploadImage(avatar);
      await accountService.updateAvatar(user.email, result.publicId, result.url);
        if(oldImgID){
            await cloudService.deleteImage(oldImgID);
        }
    }
    catch(error){
        throw new BadRequestError("Failed to upload image to cloud");
    }
    new CreatedResponse({
      message: "Avatar updated successfully"
    }).send(res);
  },

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
