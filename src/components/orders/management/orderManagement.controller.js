const { matchedData } = require("express-validator");
const { OKResponse } = require("../../../core/SuccessResponse");
const OrderService = require("./../order.service");

module.exports = {
  getOrders: async (req, res, next) => {
    try {
      const query = matchedData(req);
      const { limit = 10, offset,  status, startDate, endDate } = query;

      const orders = await OrderService.getUserOrders(undefined, {
        offset,
        limit,
        status,
        startDate,
        endDate,
      });

      new OKResponse({
        message: "Orders fetched successfully",
        metadata: orders,
      }).send(res);
    } catch (error) {
      next(error);
    }
  },

  getOrderDetail: async (req, res, next) => {
    try {
      const { orderId } = matchedData(req);
      const order = await OrderService.getOrderById(parseInt(orderId));

      new OKResponse({
        message: "Order retrieved successfully",
        metadata: { order },
      }).send(res);
    } catch (error) {
      next(error);
    }
  },

  updateOrderStatus: async (req, res, next) => {
    try {
      const { orderId, status } = matchedData(req);

      const order = await OrderService.updateOrderStatus(
        parseInt(orderId),
        undefined,
        status
      );

      new OKResponse({
        message: "Order status updated successfully",
        metadata: { order },
      }).send(res);
    } catch (error) {
      next(error);
    }
  },
};
