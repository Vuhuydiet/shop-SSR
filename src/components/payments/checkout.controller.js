const { matchedData } = require("express-validator");
const CheckoutService = require("./checkout.service");

module.exports = {
  submitOrder: async (req, res) => {
    const { products } = matchedData(req);

    req.session.products = products;

    res.redirect(`/checkout`);
  },

  getCheckoutPage: async (req, res) => {
    const { products } = req.session;

    const productInfos = await CheckoutService.getProductInfos(products);

    const { total, subtotal } = CheckoutService.calculateTotal(productInfos);

    res.render("pages/checkout", { products: productInfos, total, subtotal });
  },
};
