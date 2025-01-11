const OrderService = require("./order.service");
const { SuccessResponse } = require("../../core/SuccessResponse");
const { ErrorResponse } = require("../../core/ErrorResponse");

class OrderController {
  static async getUserOrders(req, res, next) {
    try {
      const { userId } = req.session;
      const { page = 1, limit = 10, ...filters } = req.query;

      const offset = (page - 1) * limit;
      const { count, orders } = await OrderService.getUserOrders(userId, {
        ...filters,
        offset,
        limit: parseInt(limit),
      });

      return new SuccessResponse({
        message: "Orders retrieved successfully",
        metadata: {
          orders,
          pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
          },
        },
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async createOrder(req, res, next) {
    try {
      const { userId } = req.session;
      const orderData = req.body;

      const order = await OrderService.createOrder(userId, orderData);

      return new SuccessResponse({
        message: "Order created successfully",
        metadata: order,
        statusCode: 201,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async getOrderById(req, res, next) {
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

  static async cancelOrder(req, res, next) {
    try {
      const { userId } = req.session;
      const { orderId } = req.params;

      const order = await OrderService.cancelOrder(parseInt(orderId), userId);

      return new SuccessResponse({
        message: "Order cancelled successfully",
        metadata: order,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async getOrderDetails(req, res, next) {
    try {
      const { userId } = req.session;
      const { orderId } = req.params;

      const order = await OrderService.getOrderById(parseInt(orderId), userId);

      return new SuccessResponse({
        message: "Order details retrieved successfully",
        metadata: order.details,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = OrderController;
