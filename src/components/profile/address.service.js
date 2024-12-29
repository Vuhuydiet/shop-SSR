const prisma = require("../../models");

class AddressService {
  static async getUserAddresses(userId) {
    return await prisma.shippingAddress.findMany({
      where: { userId },
    });
  }

  static async getAddressById(addressId) {
    return await prisma.shippingAddress.findUnique({
      where: { addressId },
    });
  }

  static async getAddressByUserId(userId) {
    return await prisma.shippingAddress.findMany({
      where: { userId },
    });
  }

  static async addAddress(userId, addressData) {
    return await prisma.shippingAddress.create({
      data: {
        userId,
        ...addressData,
      },
    });
  }

  static async updateAddress(addressId, addressData) {
    return await prisma.shippingAddress.update({
      where: { addressId },
      data: addressData,
    });
  }

  static async deleteAddress(addressId) {
    return await prisma.shippingAddress.delete({
      where: { addressId },
    });
  }
}

module.exports = AddressService;
