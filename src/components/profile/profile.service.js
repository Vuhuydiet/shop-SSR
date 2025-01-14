const prisma = require("../../models");
const { format, startOfDay, startOfWeek, startOfMonth, endOfWeek, endOfMonth } = require('date-fns'); // Ensure you have date-fns imported
class ProfileService {
  static async getAdminProfile(adminId) {
    return await prisma.admin.findUnique({where: {adminId}});
  }

/**
   *
   * @param {number} adminId
   * @param {{fullname: string, dob: Date, gender: 'male' | 'female', email: string}} profileData
   * @returns Admin
   */
  static async updateAdminProfile(adminId, profileData) {
    return await prisma.admin.update({
      where: {adminId},
      data: profileData,
    });
  }
}

module.exports = ProfileService;
