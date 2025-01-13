const { NotFoundError, BadRequestError } = require("../../core/ErrorResponse");
const prisma = require("../../models");
const { format, startOfDay, startOfWeek, startOfMonth, endOfWeek, endOfMonth } = require('date-fns');
function getOrderConditions(queryParams, userId) {
  return {
    userId,
    orderStatus: queryParams.status || undefined,
    createdAt: {
      gte: queryParams?.startDate || undefined,
      lte: queryParams?.endDate || undefined,
    },
  };
}

class OrderService {
  static async getUserOrders(userId, queryParams = {}) {
    const condition = getOrderConditions(queryParams, userId);

    const [count, orders] = await Promise.all([
      prisma.order.count({
        where: condition,
      }),
      prisma.order.findMany({
        where: condition,
        skip: queryParams?.offset || 0,
        take: queryParams?.limit || 10,
        orderBy: queryParams?.sortBy
          ? { [queryParams.sortBy]: queryParams?.order || "desc" }
          : { createdAt: "desc" },
        include: {
          details: {
            include: {
              product: {
                include: {
                  productImages: true,
                },
              },
            },
          },
        },
      }),
    ]);

    return { count, orders };
  }

  static async getRevenueReport(startDate, endDate, page, pageSize, sortBy, order, timeRange) {
    const skip = (page - 1) * pageSize;
    console.log(startDate, endDate, page, pageSize, sortBy, order, timeRange);

    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
        //condition order status is paid
        orderStatus: {
          equals: 'PAID'
        }
      },
      skip: skip,
      take: pageSize,
      orderBy: {
        [sortBy]: order,
      },
    });

    const groupByTime = (date) => {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate)) {
        throw new Error(`Invalid date format: ${date}`);
      }

      let startPeriod, endPeriod;
      if (timeRange === 'day') {
        startPeriod = format(startOfDay(parsedDate), 'yyyy-MM-dd');
        endPeriod = startPeriod; // For a day, start and end are the same
      } else if (timeRange === 'week') {
        startPeriod = format(startOfWeek(parsedDate), 'yyyy-MM-dd');
        endPeriod = format(endOfWeek(parsedDate), 'yyyy-MM-dd');
      } else if (timeRange === 'month') {
        startPeriod = format(startOfMonth(parsedDate), 'yyyy-MM-dd');
        endPeriod = format(endOfMonth(parsedDate), 'yyyy-MM-dd');
      } else {
        throw new Error('Invalid timeRange');
      }

      return { startPeriod, endPeriod };
    };

    const groupedData = orders.reduce((result, order) => {
      const { startPeriod, endPeriod } = groupByTime(order.createdAt);

      const timeGroup = `${startPeriod} to ${endPeriod}`; // Combine the start and end date as a range

      if (!result[timeGroup]) {
        result[timeGroup] = { totalAmount: 0, orderCount: 0 };
      }

      result[timeGroup].totalAmount += order.totalAmount;
      result[timeGroup].orderCount += 1;

      return result;
    }, {});

    console.log('groupedData', groupedData);

    const revenue = Object.keys(groupedData).map((key) => ({
      timeGroup: key,
      totalAmount: groupedData[key].totalAmount,
      orderCount: groupedData[key].orderCount,
    }));

    console.log('revenue', revenue);

    const totalRevenue = revenue.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalCount = await prisma.order.count({
      where: {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
    });

    return { totalRevenue, totalCount, revenue };
  }

  static async getOrderById(orderId, userId) {
    const order = await prisma.order.findFirst({
      where: {
        orderId,
        userId,
      },
      include: {
        details: {
          include: {
            product: {
              include: {
                productImages: true,
              },
            },
          },
        },
      },
    });

    if (!order) throw new NotFoundError({ message: "Order not found" });
    return order;
  }

  static async createOrder(userId, orderData) {
    const { details, ...orderInfo } = orderData;

    return await prisma.$transaction(async (tx) => {
      // 1. Check product availability
      for (const item of details) {
        const product = await tx.product.findUnique({
          where: { productId: item.productId },
        });

        if (!product)
          throw new NotFoundError({
            message: `Product ${item.productId} not found`,
          });
        if (product.stock < item.quantity) {
          throw new BadRequestError({
            message: `Insufficient stock for product ${product.name}`,
          });
        }
      }

      // 2. Calculate total amount
      let totalAmount = 0;
      const orderDetails = [];

      for (const item of details) {
        const product = await tx.product.findUnique({
          where: { productId: item.productId },
        });

        totalAmount += product.currentPrice * item.quantity;
        orderDetails.push({
          productId: item.productId,
          quantity: item.quantity,
          priceAtPurchase: product.currentPrice,
        });

        // Update stock
        await tx.product.update({
          where: { productId: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // 3. Create order
      return tx.order.create({
        data: {
          ...orderInfo,
          userId,
          totalAmount,
          details: {
            create: orderDetails,
          },
        },
        include: {
          details: {
            include: {
              product: true,
            },
          },
        },
      });
    });
  }

  static async updateOrderStatus(orderId, userId, newStatus) {
    const order = await prisma.order.findFirst({
      where: { orderId, userId },
    });

    if (!order) throw new NotFoundError({ message: "Order not found" });

    const validTransitions = {
      PENDING: ["CONFIRMED", "CANCELLED"],
      CONFIRMED: ["SHIPPING"],
      SHIPPING: ["DELIVERED"],
      DELIVERED: ["PAID"],
    };

    if (!validTransitions[order.orderStatus]?.includes(newStatus)) {
      throw new BadRequestError({ message: "Invalid status transition" });
    }

    return prisma.order.update({
      where: { orderId },
      data: { orderStatus: newStatus },
      include: {
        details: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  static async cancelOrder(orderId, userId) {
    return await prisma.$transaction(async (tx) => {
      const order = await tx.order.findFirst({
        where: { orderId, userId },
        include: { details: true },
      });

      if (!order) throw new NotFoundError({ message: "Order not found" });
      if (order.orderStatus !== "PENDING") {
        throw new BadRequestError({
          message: "Can only cancel pending orders",
        });
      }

      // Restore stock
      for (const detail of order.details) {
        await tx.product.update({
          where: { productId: detail.productId },
          data: { stock: { increment: detail.quantity } },
        });
      }

      return tx.order.update({
        where: { orderId },
        data: { orderStatus: "CANCELLED" },
        include: {
          details: {
            include: {
              product: true,
            },
          },
        },
      });
    });
  }
}

module.exports = OrderService;
