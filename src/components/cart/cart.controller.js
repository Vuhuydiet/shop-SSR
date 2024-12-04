const { matchedData } = require("express-validator");
const CartService = require("./cart.service");
const { OKResponse } = require("../../core/SuccessResponse");
const ProductService = require("../products/product.service");

module.exports = {

  getCartPage: async (req, res) => {
    let cartItems = [];
    if (req.isAuthenticated()) {
      const { id } = req.user;
      cartItems = await CartService.getCartItems(id);
    }
    else {
      const { productIds, quantity } = matchedData(req);
      const products = await Promise.all(productIds.map(id => ProductService.getProductById(id)));
      cartItems = products.map((product, i) => ({
        product,
        quantity: quantity[i],
      }));
      console.log(productIds, quantity);
    }
    res.render('pages/cart', { cartItems });
  },

  addCartItem: async (req, res) => {
    const { id } = req.user;
    const { productId, quantity } = matchedData(req);

    const cartItem = await CartService.addCartItem(id, { productId, quantity });
    new OKResponse("Cart item added", { cartItem }).send(res);
  },

  updateCartItemQuantity: async (req, res) => {
    const { id } = req.user;
    const { productId, quantity } = matchedData(req);

    const cartItem = await CartService.updateCartItemQuantity(id, { productId, quantity });
    new OKResponse("Cart item updated", { cartItem }).send(res);
  },
  
  deleteCartItem: async (req, res) => {
    const { id } = req.user;
    const { productId } = req.params;

    await CartService.deleteCartItem(id, productId);
    new OKResponse("Cart item deleted").send(res);
  },

}
