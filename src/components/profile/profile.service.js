const prisma = require("../../models");
const { format, startOfDay, startOfWeek, startOfMonth, endOfWeek, endOfMonth } = require('date-fns'); // Ensure you have date-fns imported
class ProfileService {
  static async getAdminProfile(adminId) {
    return await prisma.admin.findUnique({where: {adminId}});
  }

  /*
    static async getRevenueReport(startDate, endDate, page, pageSize, sortBy, order, timeRange) {
      const skip = (page - 1) * pageSize;
      console.log(startDate, endDate, page, pageSize, sortBy, order);
      const revenue = await prisma.order.findMany({
        where: {
          createdAt: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        },
        skip: skip,
        take: pageSize,
        orderBy: {
          [sortBy]: order,
        },
      });

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

  static async getStartOfWeek(date) {
    const day = date.getDay(),
        diff = date.getDate() - day + (day == 0 ? -6 : 1); // Adjust if it's Sunday (0)
    return new Date(date.setDate(diff)); // Start of the week (e.g., Monday)
  };

  static async getEndOfWeek(startOfWeek) {
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // End of the week (Sunday)
    return endOfWeek;
  };

  static async getStartOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1); // First day of the month
  };

  static async getEndOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0); // Last day of the month
  };

  static async getRevenueByPeriod(startDate, endDate, timeRange) {
    let periodStart, periodEnd;

    if (timeRange === 'week') {
      periodStart = getStartOfWeek(new Date(startDate));
      periodEnd = getEndOfWeek(periodStart);
    } else if (timeRange === 'month') {
      periodStart = getStartOfMonth(new Date(startDate));
      periodEnd = getEndOfMonth(periodStart);
    } else {
      periodStart = new Date(startDate);
      periodEnd = new Date(endDate);
    }

    // Now you can fetch and group the data based on `periodStart` and `periodEnd`
    // Return data formatted with start and end dates for the UI
    return {
      periodStart: periodStart.toISOString().split('T')[0], // Format as YYYY-MM-DD
      periodEnd: periodEnd.toISOString().split('T')[0],     // Format as YYYY-MM-DD
      revenue: [] // Example data, replace with your actual query
    };
  };
*/
/*
  static async getRevenueReport(startDate, endDate, page, pageSize, sortBy, order, timeRange) {
    const skip = (page - 1) * pageSize;
    console.log(startDate, endDate, page, pageSize, sortBy, order, timeRange);

    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
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
      if (timeRange === 'day') return format(startOfDay(parsedDate), 'yyyy-MM-dd');
      if (timeRange === 'week') return format(startOfWeek(parsedDate), 'yyyy-ww');
      if (timeRange === 'month') return format(startOfMonth(parsedDate), 'yyyy-MM');
      throw new Error('Invalid timeRange');
    };

    console.log('groupByTime', orders);
    // Gom nhóm dữ liệu
    const groupedData = orders.reduce((result, order) => {
      const timeGroup = groupByTime(order.createdAt);
      if (!result[timeGroup]) {
        result[timeGroup] = {totalAmount: 0, orderCount: 0};
      }
      result[timeGroup].totalAmount += order.totalAmount;
      result[timeGroup].orderCount += 1;
      return result;
    }, {});

    console.log('groupedData', groupedData);

    // Chuyển đổi dữ liệu thành mảng
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

    return {totalRevenue, totalCount, revenue};
  }


 */


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

  // Group the data by day, week, or month and return the start and end dates for weeks/months
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

  // Group the orders based on the selected time range
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

  // Convert grouped data into an array
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

/**
   *
   * @param {number} adminId
   * @param {{fullname: string, dob: Date, gender: 'male' | 'female', email: string}} profileData
   * @returns Admin
   */
  static async updateAdminProfile(adminId, profileData) {
    return await prisma.admin.update({
      where: {adminId},
      data: profileData,
    });
  }
}

module.exports = ProfileService;
