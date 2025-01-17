/*

type ReviewData = {
  productId: number;

}

*/

const { use } = require("express/lib/router");
const { NotFoundError, UnauthorizedError } = require("../../../core/ErrorResponse");
const prisma = require("../../../models");

class ReviewService {
  static async createReview(userId, { productId, rating, reviewContent }) {
    if (!(await prisma.user.findUnique({ where: { userId: userId } }))) {
      throw new NotFoundError("User does not exist");
    }

    if (!(await prisma.product.findUnique({ where: { productId: productId } }))) {
      throw new NotFoundError("Product does not exist");
    }

    return await prisma.review.create({
      data: {
        userId,
        productId,
        rating,
        reviewContent,
      },
    });
  }

  static async getReviewCountByProductId(productId) {
    return await prisma.review.count({ where: { productId } });
  }

  static async getReviewById(reviewId) {
    return await prisma.review.findUnique({ 
      where: { reviewId },
      include: {
        user: {
          select: { 
            avatarUrl: true,
            email: true,
            fullname: true
          }
        }
      } 
    });
  }

  static async getReviewsByProductId(productId, { limit, offset, rating, sortBy, order }) {
    const [count, reviews] = await Promise.all([
      prisma.review.count({ 
        where: { productId } 
      }),
      prisma.review.findMany({ 
        where: { 
          productId,
          rating: rating
        },
        take: limit,
        skip: offset,
        orderBy: sortBy && {
          [sortBy]: order,
        },
        include: {
          user: {
            select: { 
              avatarUrl: true,
              email: true,
              fullname: true
            }
          }
        }
      })
    ]);
    return { count, reviews };
  }

  static async getReviewsByUserId(userId, { limit, offset, rating, sortBy, order }) {
    const [count, reviews] = await Promise.all([
      prisma.review.count({
        where: { userId }
      }),
      prisma.review.findMany({
        where: {
          userId,
          rating: rating
        },
        take: limit,
        skip: offset,
        orderBy: sortBy && {
          [sortBy]: order,
        },
        include: {
          user: {
            select: {
              avatarUrl: true,
              email: true,
              fullname: true
            }
          },
          /*
          product: {
            select: {
              productName: true
            }
          }
           */
        }
      })
    ]);
    return { count, reviews };
  }

  static async getProductById(productId) {
    const product = await prisma.product.findUnique({
      where: { productId },
    });

    if (!product) {
      throw new NotFoundError("Product does not exist");
    }

    return product;
  }

  static async deleteReivew(userId, reviewId) {
    const review = await prisma.review.findUnique({ where: { reviewId } });

    if (!review) {
      throw new NotFoundError("Review does not exist");
    }

    if (review.userId !== userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    return await prisma.review.delete({ where: { reviewId } });
  }
}


module.exports = ReviewService;