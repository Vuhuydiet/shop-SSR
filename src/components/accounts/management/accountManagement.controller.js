const { matchedData } = require("express-validator");
const { OKResponse } = require("../../../core/SuccessResponse");
const accountService = require("../account.service");
const orderService = require("../../orders/order.service");

module.exports = {
  getUsers: async (req, res) => {
    const query = matchedData(req);

    if (query.admin) {
      const { count, admins } = await accountService.getAdmins(query);
      return new OKResponse({
        message: "Get admins successfully",
        metadata: { count, admins },
      }).send(res);
    }

    const { count, users } = await accountService.getUsers(query);

    console.log(users)
    new OKResponse({
      message: "Users fetched successfully",
      metadata: { count, users },
    }).send(res);
  },

  getUser: async (req, res) => {
    const { userId } = matchedData(req);

    const user = await accountService.findUserById(userId);

    new OKResponse({
      message: "User fetched successfully",
      metadata: { user },
    }).send(res);
  },

  updateUserStatus: async (req, res) => {
    const { userId, status } = matchedData(req);

    await accountService.updateAccountStatus(userId, status);

    new OKResponse({
      message: "User status updated successfully",
    }).send(res);
  },

  getUserStatistic: async (req, res) => {
    const {startDate, endDate, page = 1, pageSize = 10, sortBy = 'createdAt', order = 'desc', timeRange='day'} = req.query;
    const { newUserCount, userStatistic } = await accountService.getUserStatistic(startDate, endDate, page, pageSize, sortBy, order, timeRange);

    new OKResponse({
      message: "User fetched successfully",
      metadata: { newUserCount, userStatistic },
    }).send(res);
  },

};
