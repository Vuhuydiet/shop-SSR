const crypto = require("crypto");
const querystring = require("qs");
const moment = require("moment");

class VNPayService {
  static generatePaymentUrl(orderId, amount, orderInfo) {
    const vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    const tmnCode = process.env.VNPAY_TMN_CODE;
    const secretKey = process.env.VNPAY_HASH_SECRET;
    const returnUrl = process.env.VNPAY_RETURN_URL;

    const date = new Date();
    const createDate = moment(date).format("YYYYMMDDHHmmss");

    const vnpParams = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: tmnCode,
      vnp_Locale: "vn",
      vnp_CurrCode: "VND",
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: "order",
      vnp_Amount: amount * 100,
      vnp_ReturnUrl: returnUrl,
      vnp_CreateDate: createDate,
      vnp_IpAddr: "127.0.0.1",
    };

    const sortedParams = this.sortObject(vnpParams);

    const signData = querystring.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    vnpParams.vnp_SecureHash = signed;

    const paymentUrl = `${vnpUrl}?${querystring.stringify(vnpParams, {
      encode: false,
    })}`;

    return paymentUrl;
  }

  static sortObject(obj) {
    const sorted = {};
    const keys = Object.keys(obj).sort();

    keys.forEach((key) => {
      if (obj[key]) {
        sorted[key] = obj[key];
      }
    });

    return sorted;
  }

  static verifyReturnUrl(vnpParams) {
    const secretKey = process.env.VNPAY_HASH_SECRET;
    const secureHash = vnpParams.vnp_SecureHash;

    delete vnpParams.vnp_SecureHash;
    delete vnpParams.vnp_SecureHashType;

    const sortedParams = this.sortObject(vnpParams);
    const signData = querystring.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    return secureHash === signed;
  }
}

module.exports = VNPayService;
