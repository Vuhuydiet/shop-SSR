const prisma = require("../../models");

class ProfileService {
  static async getAdminProfile(adminId) {
    return await prisma.admin.findUnique({ where: { adminId } });
  }

  /**
   *
   * @param {number} adminId
   * @param {{fullname: string, dob: Date, gender: 'male' | 'female', email: string}} profileData
   * @returns Admin
   */
  static async updateAdminProfile(adminId, profileData) {
    return await prisma.admin.update({
      where: { adminId },
      data: profileData,
    });
  }
}

module.exports = ProfileService;
