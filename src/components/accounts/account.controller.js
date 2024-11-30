const accountService = require("./account.service");
const { userSchema } = require("./account.validationSchema");
const {
  BadRequestError,
  InternalServerError,
} = require("../../core/ErrorResponse");
const { OKResponse } = require("../../core/SuccessResponse");

// Controller methods
const getRegisterPage = async (req, res) => {
  res.render("pages/register");
};

const getLoginPage = async (req, res) => {
  res.render("pages/login");
};

const updatePassword = async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  try {
    userSchema.shape.password.parse(newPassword);
  } catch (error) {
    throw new BadRequestError({
      message: error.errors[0].message,
    });
  }
  await accountService.updatePassword(email, currentPassword, newPassword);

  new OKResponse({ message: "Password updated successfully" }).send(res);
};

const getConfirmUser = async (req, res) => {
  const email = req.query.email;

  res.render("pages/confirmCode", { email: email });
};

const confirmUser = async (req, res) => {
  const { email, confirmationCode } = req.body;

  const confirmed = await accountService.confirmUser(email, confirmationCode);

  if (!confirmed) {
    throw new BadRequestError({ message: "Invalid confirmation code" });
  }

  const user = await accountService.findUserByEmail(email);

  req.logIn(user, (err) => {
    if (err) {
      throw new InternalServerError({ error: err });
    }

    req.session.save((err) => {
      if (err) {
        throw new InternalServerError({ error: err });
      }

      new OKResponse({
        message: "Account confirmed and logged in successfully",
        metadata: { redirectUrl: "/" },
      }).send(res);
    });
  });
};

const resetPassword = async (req, res) => {
  const { email } = req.body;
  await accountService.resetPassword(email);

  new OKResponse({ message: "Password reset email sent" }).send(res);
};

const updatePasswordWithToken = async (req, res) => {
  const { email, resetPasswordToken, newPassword } = req.body;

  const updated = await accountService.updatePassword(
    email,
    resetPasswordToken,
    newPassword
  );

  if (!updated) {
    throw new BadRequestError({ message: "Invalid reset token" });
  }

  new OKResponse({ message: "Password updated successfully" }).send(res);
};

const accountController = {
  getRegisterPage,
  getLoginPage,
  updatePassword,
  getConfirmUser,
  confirmUser,
  resetPassword,
  updatePasswordWithToken,
};

module.exports = {
  ...accountController,
};
