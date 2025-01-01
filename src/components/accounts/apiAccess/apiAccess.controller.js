const { BadRequestError } = require("../../../core/ErrorResponse");
const { OKResponse } = require("../../../core/SuccessResponse");
const accountService = require("../account.service");
const { default: JWT } = require("./JWT");
const { validatePassword } = require("../password");



module.exports = {
  postLoginAdmin: async (req, res) => {
    const {username, password} = req.body;
    const admin = await accountService.findAdminByUsername(username);
    if (!admin) {
      throw new BadRequestError({message: "Invalid username or password"});
    }
    const passwordMatch = validatePassword(password, admin.password);
    if (!passwordMatch) {
      throw new BadRequestError({message: "Invalid username or password"});
    }

    const token =  JWT.generateToken(admin.adminId, 'ADMIN');
    new OKResponse({message: 'Login successful', metadata: {token} }).send(res);

  }
}