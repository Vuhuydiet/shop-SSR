const { matchedData } = require("express-validator");
const { OKResponse } = require("../../../core/SuccessResponse");
const accountService = require("../account.service");

module.exports = {
  getUsers: async (req, res) => {
    const query = matchedData(req);

    const users = await accountService.getUsers(query);

    new OKResponse({
      message: "Users fetched successfully",
      metadata: { users },
    }).send(res);
  },

  getUser: async (req, res) => {
    const { userId } = matchedData(req);

    const user = await accountService.getUser(userId);

    new OKResponse({
      message: "User fetched successfully",
      metadata: { user },
    }).send(res);
  },

  updateUserStatus: async (req, res) => {
    const { userId, status } = matchedData(req);

    await accountService.updateUserStatus(userId, status);

    new OKResponse({
      message: "User status updated successfully",
    }).send(res);
  },
};
