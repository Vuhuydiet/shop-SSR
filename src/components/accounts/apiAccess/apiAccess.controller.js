const { BadRequestError } = require("../../../core/ErrorResponse");
const { OKResponse } = require("../../../core/SuccessResponse");
const accountService = require("../account.service");
const JWT = require("./JWT");
const { validatePassword } = require("../password");
const ProfileService = require("../../profile/profile.service");

module.exports = {
  postLoginAdmin: async (req, res) => {
    const { username, password } = req.body;
    const admin = await accountService.findAdminByUsername(username);
    if (!admin) {
      throw new BadRequestError({ message: "Invalid username or password" });
    }
    const passwordMatch = validatePassword(password, admin.hashedPassword);
    if (!passwordMatch) {
      throw new BadRequestError({ message: "Invalid username or password" });
    }

    const token = JWT.generateToken(admin.adminId, "ADMIN"); 
    const profile = await ProfileService.getAdminProfile(admin.adminId);
    new OKResponse({ message: "Login successful", metadata: { token, profile } }).send(
      res
    );
  },
};
