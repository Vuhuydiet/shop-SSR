const prisma = require("../../models");
const { hash, compare } = require("bcryptjs");
const logger = require("../../libraries/logger");

class AuthenticationError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "AuthenticationError";
    this.code = code;
  }
}

const SALT_ROUNDS = 12;

const authService = {
  registerUser: async (username, password) => {
    try {
      const hashedPassword = await hash(password, SALT_ROUNDS);

      const user = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
          lastLogin: new Date(),
        },
        select: {
          id: true,
          username: true,
          createdAt: true,
        },
      });

      logger.info(`User registered successfully: ${username}`);
      return user;
    } catch (error) {
      logger.error(`Error registering user: ${error.message}`);
      throw error;
    }
  },

  userExists: async (username) => {
    try {
      const user = await prisma.user.findUnique({
        where: { username },
        select: { id: true },
      });
      return user !== null;
    } catch (error) {
      logger.error(`Error checking user existence: ${error.message}`);
      throw error;
    }
  },

  login: async (username, password) => {
    try {
      const user = await prisma.user.findUnique({
        where: { username },
      });

      if (!user) {
        throw new AuthenticationError(
          "Invalid username or password",
          "INVALID_CREDENTIALS"
        );
      }

      const isValidPassword = await compare(password, user.password);
      if (!isValidPassword) {
        throw new AuthenticationError(
          "Invalid username or password",
          "INVALID_CREDENTIALS"
        );
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
      });

      const { password: _, ...userData } = user;
      logger.info(`User logged in successfully: ${username}`);
      return userData;
    } catch (error) {
      if (error instanceof AuthenticationError) {
        logger.warn(`Failed login attempt for user ${username}`);
        throw error;
      }
      logger.error(`Error during login: ${error.message}`);
      throw new AuthenticationError("Authentication failed", "AUTH_ERROR");
    }
  },

  updatePassword: async (username, currentPassword, newPassword) => {
    try {
      const user = await prisma.user.findUnique({
        where: { username },
      });

      if (!user) {
        throw new AuthenticationError("User not found", "USER_NOT_FOUND");
      }

      const isValidPassword = await compare(currentPassword, user.password);
      if (!isValidPassword) {
        throw new AuthenticationError(
          "Current password is incorrect",
          "INVALID_PASSWORD"
        );
      }

      const hashedPassword = await hash(newPassword, SALT_ROUNDS);
      await prisma.user.update({
        where: { username },
        data: { password: hashedPassword },
      });

      logger.info(`Password updated successfully for user: ${username}`);
    } catch (error) {
      logger.error(`Error updating password: ${error.message}`);
      throw error;
    }
  },
};

module.exports = authService;
