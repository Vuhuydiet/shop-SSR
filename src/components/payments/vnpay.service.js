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
    const formattedAmount = Math.round(parseFloat(amount) * 100).toString();
    const formattedTxnRef = orderId.toString();

    const vnpParams = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: tmnCode,
      vnp_Locale: "vn",
      vnp_CurrCode: "VND",
      vnp_TxnRef: formattedTxnRef,
      vnp_OrderInfo: this.formatOrderInfo(orderInfo),
      vnp_OrderType: "other",
      vnp_Amount: formattedAmount,
      vnp_ReturnUrl: returnUrl,
      vnp_CreateDate: createDate,
      vnp_IpAddr: "127.0.0.1",
    };

    const sortedParams = {};
    Object.keys(vnpParams)
      .sort()
      .forEach((key) => {
        if (vnpParams[key] && vnpParams[key].length > 0) {
          sortedParams[key] = vnpParams[key];
        }
      });

    const signData = querystring.stringify(sortedParams, { encode: true });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    vnpParams.vnp_SecureHash = signed;

    const paymentUrl = `${vnpUrl}?${querystring.stringify(vnpParams, {
      encode: false,
    })}`;

    console.log(paymentUrl);

    return paymentUrl;
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

  static formatOrderInfo(orderInfo) {
    if (!orderInfo) return "";

    const sanitized = orderInfo
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .trim()
      .replace(/\s+/g, "_")
      .slice(0, 255);

    return sanitized;
  }
}

module.exports = VNPayService;
