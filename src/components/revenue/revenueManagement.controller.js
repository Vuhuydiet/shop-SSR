const { matchedData } = require("express-validator");
const { OKResponse } = require("../../core/SuccessResponse");
const productService = require("../products/product.service");
const orderService = require("../orders/order.service");
const CloudService = require("../clouds/cloud.service");

module.exports={
    getRevenueReport: async (req, res) => {
        const {startDate, endDate, page = 1, pageSize = 10, sortBy = 'createdAt', order = 'desc', timeRange='day'} = req.query;
        const { totalRevenue, totalCount, revenue } = await orderService.getRevenueReport(startDate, endDate, page, pageSize, sortBy, order, timeRange);

        new OKResponse({
            message: "Revenue fetched successfully",
            metadata: { totalRevenue, totalCount, revenue },
        }).send(res);
    },

    getTopRevenueReportByProduct: async (req, res) => {
        const {startDate, endDate, page = 1, pageSize = 10, sortBy = 'createdAt', order = 'desc', timeRange='day'} = req.query;
        const { totalRevenue, totalCount, revenue } = await orderService.getTopRevenueReportByProduct(startDate, endDate, page, pageSize, sortBy, order, timeRange);

        new OKResponse({
            message: "Revenue fetched successfully",
            metadata: { totalRevenue, totalCount, revenue },
        }).send(res);
    }
}