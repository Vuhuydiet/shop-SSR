const prisma = require("../../models");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const logger = require("../../libraries/logger");
const { getHashedPassword } = require("./password");
const env = require("../../config/env");
const { InternalServerError } = require("../../core/ErrorResponse");

// const SALT_ROUNDS = 12;

// class AuthenticationError extends Error {
//   constructor(message, code) {
//     super(message);
//     this.name = "AuthenticationError";
//     this.code = code;
//   }
// }

const generateToken = () => {
  // return crypto.randomBytes(20).toString("hex");
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

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        confirmationCode,
      },
    });

    await sendEmail(
      email,
      "Account Confirmation",
      `Please confirm your account using the following code: ${confirmationCode}`
    );
    return user;
  },

  confirmUser: async (email, confirmationCode) => {
    const user = await prisma.user.findUnique({ where: { email } });

    if (user && user.confirmationCode === confirmationCode) {
      await prisma.user.update({
        where: { email },
        data: { confirmedAt: new Date().toISOString(), confirmationCode: null },
      });
      return true;
    }
    return false;
  },

  resetPassword: async (email) => {
    const resetPasswordToken = generateToken();
    await prisma.user.update({
      where: { email },
      data: { resetPasswordToken },
    });

    await sendEmail(
      email,
      "Password Reset",
      `Please reset your password using the following token: ${resetPasswordToken}`
    );
  },

  updatePassword: async (email, resetPasswordToken, newPassword) => {
    const user = await prisma.user.findUnique({ where: { email } });

    if (user && user.resetPasswordToken === resetPasswordToken) {
      const hashedPassword = getHashedPassword(newPassword);
      await prisma.user.update({
        where: { email },
        data: { password: hashedPassword, resetPasswordToken: null },
      });
      return true;
    }
    return false;
  },

  userExists: async (email) => {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });
      return user !== null;
    } catch (error) {
      logger.error(`Error checking user existence: ${error.message}`);
      throw new InternalServerError({ error: err });
    }
  },

  findUserByEmail: async (email) => {
    try {
      return await prisma.user.findUnique({ where: { email } });
    } catch (error) {
      logger.error(`Error getting user by email: ${error.message}`);
      throw new InternalServerError({ error: err });
    }
  },

  findUserById: async (userId) => {
    try {
      return await prisma.user.findUnique({ where: { id: userId } });
    } catch (error) {
      logger.error(`Error getting user by id: ${error.message}`);
      throw new InternalServerError({ error: err });
    }
  },
};

module.exports = accountService;
