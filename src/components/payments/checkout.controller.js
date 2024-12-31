const { matchedData } = require("express-validator");
const CheckoutService = require("./checkout.service");
const AddressService = require("./../profile/address.service");
const VNPayService = require("./vnpay.service");

module.exports = {
  submitOrder: async (req, res) => {
    const { products } = matchedData(req);

    const productDetails = await CheckoutService.getProductInfos(products);
    req.session.checkoutProducts = productDetails;

    res.redirect(`/checkout`);
  },

  createOrder: async (req, res) => {
    try {
      const { products, shippingAddress, paymentMethod } = matchedData(req);

      console.log(products);

      const order = await CheckoutService.createOrder({
        userId: req.user.userId,
        products,
        shippingAddress,
        paymentMethod,
        status: "PENDING",
      });

      console.log(order);

      if (paymentMethod === "VNPAY") {
        const paymentUrl = await VNPayService.generatePaymentUrl({
          orderId: order.orderId,
          amount: order.totalAmount,
          orderInfo: `Payment for order #${order.orderId}`,
        });
        return res.json({ success: true, paymentUrl });
      }

      await CheckoutService.updateOrderStatus(order.orderId, "CONFIRMED");
      return res.json({
        success: true,
        redirectUrl: `/orders/${order.orderId}/success`,
      });
    } catch (error) {
      console.error("Order submission error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to process order",
      });
    }
  },

  getCheckoutPage: async (req, res) => {
    const products = req.session.checkoutProducts;
    if (!products || !products.length) {
      return res.redirect("/cart");
    }
    const productInfos = await CheckoutService.getProductInfos(products);

    const { total, subtotal } = CheckoutService.calculateTotal(productInfos);

    const addresses = await AddressService.getAddressByUserId(req.user.id);
    console.log(addresses);

    req.session.products = products;

    res.render("pages/checkout", {
      products: productInfos,
      total,
      subtotal,
      addresses,
    });
  },

  processPayment: async (req, res) => {
    const { paymentMethod, amount, orderId } = req.body;

    if (paymentMethod === "VNPAY") {
      const paymentUrl = VNPayService.generatePaymentUrl(
        orderId,
        amount,
        `Payment for order #${orderId}`
      );
      res.json({ paymentUrl });
    } else {
      res.json({ success: true });
    }
  },

  vnpayReturn: async (req, res) => {
    const vnpParams = req.query;

    const isValidSignature = VNPayService.verifyReturnUrl(vnpParams);

    if (isValidSignature) {
      const orderId = vnpParams.vnp_TxnRef;
      const responseCode = vnpParams.vnp_ResponseCode;

      if (responseCode === "00") {
        res.render("pages/paymentSuccess", {
          orderId,
          amount: vnpParams.vnp_Amount / 100,
        });
      } else {
        res.render("pages/paymentFailed", {
          orderId,
          message: "Payment failed or was cancelled",
        });
      }
    } else {
      res.render("pages/paymentFailed", {
        message: "Invalid signature",
      });
    }
  },
};
