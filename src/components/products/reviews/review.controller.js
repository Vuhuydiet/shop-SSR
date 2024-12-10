const { CreatedResponse, OKResponse } = require("../../../core/SuccessResponse");

const { matchedData } = require("express-validator");
const ReviewService = require("./review.service");

module.exports = {
  postReview: async (req, res) => {
    const userId = req.user.userId;
    const { productId, rating, reviewContent } = matchedData(req);

    const review = await ReviewService.createReview(userId, {
      productId,
      rating,
      reviewContent,
    });

    new CreatedResponse({ message: "Review created", metadata: { review } }).send(res);
  },

  getReview: async (req, res) => {
    const { reviewId } = matchedData(req);

    const review = await ReviewService.getReviewById(reviewId);

    new OKResponse({ message: "Review found", metadata: { review } }).send(res);
  },

  getReviews: async (req, res) => {
    const { productId, limit, page, rating, sortBy, order } = matchedData(req);

    const { count, reviews } = await ReviewService.getReviewsByProductId(productId, {
      offset: (page - 1) * limit,
      limit,
      rating,
      sortBy,
      order,
    });
    new OKResponse({ message: "Reviews found", metadata: { count, reviews } }).send(res);
  },

  deleteReview: async (req, res) => {
    const userId = req.user.userId;
    const reviewId = matchedData(req);

    await ReviewService.deleteReivew(userId, reviewId);

    new OKResponse({ message: "Review deleted" }).send(res);
  },
};
