const prisma = require("../../models");
const ProductService = require("../products/product.service");

class CheckoutService {
  static async calculateTotal(products) {
    const subtotal = await products.reduce(async (sum, item) => {
      const product = await prisma.product.findUnique({
        where: { productId: item.productId },
      });
      return (await sum) + product.price * item.quantity;
    }, Promise.resolve(0));

    const shippingFee = 0;
    return { subtotal, total: subtotal + shippingFee };
  }

  static async createOrder({
    userId,
    products,
    shippingAddress,
    paymentMethod,
    status = "PENDING",
  }) {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const { total } = await this.calculateTotal(products);

    return await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { userId },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const order = await tx.order.create({
        data: {
          userId,
          totalAmount: total,
          paymentMethod,
          orderStatus: status,
          phoneNumber: shippingAddress.phoneNumber,
          country: shippingAddress.country,
          city: shippingAddress.city,
          district: shippingAddress.district,
          ward: shippingAddress.ward,
          addressDetail: shippingAddress.detailAddress,
          details: {
            create: await Promise.all(
              products.map(async (item) => {
                const product = await tx.product.findUnique({
                  where: { productId: item.productId },
                });
                if (!product) {
                  throw new Error(`Product ${item.productId} not found`);
                }
                return {
                  productId: item.productId,
                  quantity: item.quantity,
                  priceAtPurchase: product.price,
                };
              })
            ),
          },
        },
        include: {
          details: true,
        },
      });

      await Promise.all(
        products.map((item) =>
          tx.product.update({
            where: { productId: item.productId },
            data: {
              stock: { decrement: item.quantity },
            },
          })
        )
      );

      return order;
    });
  }

  static async updateOrderStatus(orderId, status) {
    return await prisma.order.update({
      where: { orderId },
      data: { orderStatus: status },
    });
  }

  static async getProductInfos(products) {
    const productInfos = await Promise.all(
      products.map((p) => ProductService.getProductById(p.productId))
    );
    return productInfos.map((product, i) => ({
      ...product,
      buyQuantity: products[i].quantity,
    }));
  }
}

module.exports = CheckoutService;
