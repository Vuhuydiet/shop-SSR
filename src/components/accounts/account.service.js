const prisma = require("../../models");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const logger = require("../../libraries/logger");
const { getHashedPassword } = require("./password");
const env = require("../../config/env");
const { InternalServerError } = require("../../core/ErrorResponse");

const otpMap = new Map();

const generateToken = () => {
  const randomBytes = crypto.randomBytes(3);
  const randomInt = randomBytes.readUIntBE(0, 3);
  const token = randomInt.toString(16).padStart(6, "0");

  return token;
};

const sendEmail = async (email, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: env.EMAIL_USER,
    to: email,
    subject: subject,
    text: text,
  };

  await transporter.sendMail(mailOptions);
};

const accountService = {
  registerUser: async (email, password) => {
    const hashedPassword = getHashedPassword(password);
    const confirmationCode = generateToken();
    const confirmationCodeExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    const user = await prisma.user.create({
      data: {
        email,
        hashedPassword,
      },
    });

    otpMap.set(user.userId, {
      otp: confirmationCode,
      expiresAt: confirmationCodeExpires,
    });

    await sendEmail(
      email,
      "Account Confirmation",
      `Please confirm your account using the following code: ${confirmationCode}\nThe code will expire in 1 hour.`
    );
    return user;
  },

  confirmUser: async (email, confirmationCode) => {
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      const otpData = otpMap.get(user.userId);
      if (
        otpData &&
        otpData.otp === confirmationCode &&
        otpData.expiresAt > new Date()
      ) {
        await prisma.user.update({
          where: { email },
          data: { confirmed: true },
        });
        otpMap.delete(user.userId);
        return true;
      }
    }
    return false;
  },

  resetPassword: async (email) => {
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      const resetPasswordToken = generateToken();
      const resetPasswordTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      otpMap.set(user.userId, {
        otp: resetPasswordToken,
        expiresAt: resetPasswordTokenExpires,
      });

      await sendEmail(
        email,
        "Password Reset",
        `Please reset your password using the following token: ${resetPasswordToken}`
      );
    }
  },

  updatePassword: async (email, resetPasswordToken, newPassword) => {
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      const otpData = otpMap.get(user.userId);
      if (
        otpData &&
        otpData.otp === resetPasswordToken &&
        otpData.expiresAt > new Date()
      ) {
        const hashedPassword = getHashedPassword(newPassword);
        await prisma.user.update({
          where: { email },
          data: { password: hashedPassword },
        });
        otpMap.delete(user.userId);
        return true;
      }
    }
    return false;
  },

  userExists: async (email) => {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        select: { userId: true },
      });
      return user !== null;
    } catch (error) {
      logger.error(`Error checking user existence: ${error.message}`);
      throw new InternalServerError({ error: error });
    }
  },

  findUserByEmail: async (email) => {
    try {
      return await prisma.user.findUnique({ where: { email } });
    } catch (error) {
      logger.error(`Error getting user by email: ${error.message}`);
      throw new InternalServerError({ error: error });
    }
  },

  findUserById: async (userId) => {
    try {
      return await prisma.user.findUnique({ where: { userId } });
    } catch (error) {
      logger.error(`Error getting user by id: ${error.message}`);
      throw new InternalServerError({ error: error });
    }
  },

  updateLastLogin: async (userId) => {
    try {
      return await prisma.user.update({
        where: { userId },
        data: { lastLogin: new Date() },
      });
    } catch (error) {
      logger.error(`Error updating last login: ${error.message}`);
      throw new InternalServerError({ error: error });
    }
  },
};

module.exports = accountService;
