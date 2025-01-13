const prisma = require("../../models");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const logger = require("../../libraries/logger");
const { getHashedPassword, validatePassword} = require("./password");
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

  createUser: async (user) => {
    const { email, fullname, oauthId, oauthProvider, hashedPassword } = user;
    const newUser = await prisma.user.create({
      data: {
        email,
        fullname,
        oauthId,
        oauthProvider,
        hashedPassword,
      },
    });
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

  updateUser: async (email, fullName, numberPhone) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      await prisma.user.update({
        where: { email },
        data: { fullname: fullName, phoneNumber: numberPhone },
      });
      return true;
    }
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

  updateAvatar: async (email, publicImgId, avatarUrl) => {
    const user = await prisma.user.findUnique({where: {email}});
    if (user) {
      await prisma.user.update({
        where: {email},
        data: {publicImgId: publicImgId, avatarUrl: avatarUrl},
      });
      return true
    }
    return false;
  },

  changePassword: async (email, oldPassword, newPassword) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      if (validatePassword(oldPassword, user.hashedPassword)) {
        const hashedPassword = getHashedPassword(newPassword);
        await prisma.user.update({
          where: { email },
          data: { hashedPassword: hashedPassword },
        });
        return true;
      }
    }
    return false;
  },

  updatePassword: async (email, resetPasswordToken, newPassword) => {
    const user = await prisma.user.findUnique({ where: { email } });
    console.log(validatePassword("Thuong@123456", user.hashedPassword));
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
          data: { hashedPassword: hashedPassword },
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

  /**
   *
   * @param {{
   * key?: string,
   * fullname?: string,
   * email?: string,
   * confirmed?: boolean,
   * status?: 'ACTIVE' | 'BLOCK'
   * sortBy?: 'createdAt' | 'fullname' | 'email',
   * order?: 'asc' | 'desc',
   * limit?: number,
   * offset?: number
   * }} query
   */
  getUsers: async (query) => {
    const condition = {
      OR: query.key ? [
        { fullname: { contains: query.key } },
        { email: { contains: query.key } },
      ] : undefined,
      fullname: query.fullname ? { contains: query.fullname } : undefined,
      email: query.email ? { contains: query.email } : undefined,
      status: query.status,
      confirmed: query.confirmed,
    };
    console.log({
      where: condition,
      orderBy: query.sortBy ? { [query.sortBy]: query.order } : undefined,
      take: query.limit,
      skip: query.offset,
    });

    const [count, users] = await prisma.$transaction([
      prisma.user.count({ where: condition }),
      prisma.user.findMany({
        where: condition,
        orderBy: query.sortBy ? { [query.sortBy]: query.order } : undefined,
        take: query.limit,
        skip: query.offset,
      }),
    ]);

    return { count, users };
  },

  updateAccountStatus: async (userId, status) => {
    return await prisma.user.update({
      where: { userId },
      data: { status },
    });
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

  findAdminByAdminId: async (adminId) => {
    const admin = await prisma.admin.findUnique({ where: { adminId } });
    return admin;
  },

  findAdminByUsername: async (username) => {
    const admin = await prisma.admin.findUnique({ where: { username } });
    return admin;
  },

  /**
   *
   * @param {{
   * key?: string,
   * sortBy?: string,
   * order?: 'ASC' | 'DESC',
   * limit?: number,
   * offset?: number
   * }} query
   */
  getAdmins: async (query) => {
    const count = await prisma.admin.count({
      where: query.key ? {
        OR: [
          { fullname: { contains: query.key } },
          { email: { contains: query.key } },
        ],
      } : undefined
    });
    const admins = await prisma.admin.findMany({
      where: query.key ? {
        OR: [
          { fullname: { contains: query.key } },
          { email: { contains: query.key } },
        ],
      } : undefined,
      orderBy: query.sortBy ? { [query.sortBy]: query.order ?? 'ASC' } : undefined,
      take: query.limit,
      skip: query.offset,
    });
    return { count, admins };
  },
};

module.exports = accountService;
