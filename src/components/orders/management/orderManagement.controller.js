const OrderService = require("./order.service");
const { SuccessResponse } = require("../../core/SuccessResponse");
const { ErrorResponse } = require("../../core/ErrorResponse");

class OrderManagementController {
  static async getOrderDetail(req, res, next) {
    try {
      const { userId } = req.session;
      const { orderId } = req.params;

      const order = await OrderService.getOrderById(parseInt(orderId), userId);

      return new SuccessResponse({
        message: "Order retrieved successfully",
        metadata: order,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async updateOrderStatus(req, res, next) {
    try {
      const { userId } = req.session;
      const { orderId } = req.params;
      const { status } = req.body;

      const order = await OrderService.updateOrderStatus(
        parseInt(orderId),
        userId,
        status
      );

      return new SuccessResponse({
        message: "Order status updated successfully",
        metadata: order,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async updateOrderStatus(req, res, next) {
    try {
      const { userId } = req.session;
      const { orderId } = req.params;
      const { status } = req.body;

      const order = await OrderService.updateOrderStatus(
        parseInt(orderId),
        userId,
        status
      );

      return new SuccessResponse({
        message: "Order status updated successfully",
        metadata: order,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = OrderManagementController;
