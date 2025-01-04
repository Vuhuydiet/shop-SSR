const { matchedData } = require("express-validator");
const ProfileService = require("./profile.service");
const { OKResponse } = require("../../core/SuccessResponse");

module.exports = {
  getUserProfile: (req, res) => {
    res.render("pages/profile", {
      user: req.user,
    });
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
