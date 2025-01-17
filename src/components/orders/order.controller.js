const OrderService = require("./order.service");
const { SuccessResponse } = require("../../core/SuccessResponse");

class OrderController {
  static async getUserOrders(req, res, next) {
    try {
      const { userId } = req.user;

      const { page = 1, limit = 10, status, startDate, endDate } = req.query;

      const offset = (page - 1) * limit;
      const { count, orders } = await OrderService.getUserOrders(userId, {
        status,
        startDate,
        endDate,
        offset,
        limit: parseInt(limit),
      });

      const totalPages = Math.ceil(count / limit);
      const currentPage = parseInt(page);

      res.render("pages/orderList", {
        orders,
        currentPage,
        totalPages,
        totalItems: count,
        itemsPerPage: limit,
        filters: {
          status,
          startDate,
          endDate,
        },
        user: userId,
      });
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

  // static async getOrderDetails(req, res, next) {
  //   try {
  //     const { userId } = req.session;
  //     const { orderId } = req.params;

  //     const order = await OrderService.getOrderById(parseInt(orderId), userId);

  //     return new SuccessResponse({
  //       message: "Order details retrieved successfully",
  //       metadata: order.details,
  //     }).send(res);
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  static async getOrderDetails(req, res) {
    try {
      const { orderId } = req.params;
      const order = await OrderService.getOrderById(
        parseInt(orderId),
        req.user.userId
      );

      if (!order) {
        return res.redirect("/orders?error=not_found");
      }

      res.render("pages/orderDetails", { order });
    } catch (error) {
      console.error("Error fetching order:", error);
      res.redirect("/orders?error=fetch_failed");
    }
  }

  static async getSuccessPage(req, res) {
    const { orderId } = req.params;
    res.render("pages/orderSuccess", { orderId });
  }
}

module.exports = OrderController;
