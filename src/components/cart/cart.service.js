const { NotFoundError } = require("../../core/ErrorResponse");
const prisma = require("../../models");
const ProductService = require("../products/product.service");

class CartService {
  static async addCartItem(userId, { productId, quantity }) {
    await ProductService.getProductById(productId);

    quantity = quantity || 1;

    try {
      return await prisma.cartItem.update({
        where: {
          userId_productId: {
            userId: userId,
            productId: productId,
          },
        },
        data: {
          quantity: { increment: quantity },
        },
      });
    } catch (err) {
      return await prisma.cartItem.create({
        data: {
          userId: userId,
          productId: productId,
          quantity: quantity,
        },
      });
    }
  }

  static async updateCartItemQuantity(userId, { productId, quantity }) {
    if (
      !(await prisma.cartItem.findUnique({
        where: { userId_productId: { userId, productId } },
      }))
    ) {
      throw new NotFoundError("Product not found in cart");
    }

    return await prisma.cartItem.update({
      where: {
        userId_productId: {
          userId: userId,
          productId: productId,
        },
      },
      data: {
        quantity: quantity,
      },
    });
  }

  static async getCartItems(userId) {
    if (!(await prisma.user.findUnique({ where: { id: userId } }))) {
      throw new NotFoundError("Product not found");
    }

    return await prisma.cartItem.findMany({
      where: {
        userId: userId,
      },
      include: {
        product: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  static async deleteCartItem(userId, productId) {
    if (
      !(await prisma.product.findUnique({ where: { productId: productId } }))
    ) {
      throw new NotFoundError("Product not found");
    }

    if (
      !(await prisma.cartItem.findUnique({
        where: { userId_productId: { userId, productId } },
      }))
    ) {
      throw new NotFoundError("Product not found in cart");
    }

    return await prisma.cartItem.delete({
      where: {
        userId_productId: {
          userId: userId,
          productId: productId,
        },
      },
    });
  }
}

module.exports = CartService;
