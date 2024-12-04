const ProductService = require("../products/product.service");


class CheckoutService {

  static async getProductInfos(products) {
    const productInfos = await Promise.all(products.map(p => ProductService.getProductById(p.productId)));
    return productInfos.map((product, i) => ({
      ...product,
      buyQuantity: products[i].quantity,
    }));
  }

  static calculateTotal(products) {
    const subtotal = products.reduce((acc, p) => acc + p.currentPrice * p.buyQuantity, 0);

    const shippingFee = 0;

    return { subtotal, total: subtotal + shippingFee };
  }
    
}

module.exports = CheckoutService;