const prisma = require("../../models");
const { hash, compare } = require("bcrypt");
const { z } = require("zod");
const logger = require("../../libraries/logger");

// Input validation schemas
const userSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be less than 50 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, underscores, and hyphens"
    ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
});

class AuthenticationError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "AuthenticationError";
    this.code = code;
  }
}

const SALT_ROUNDS = 12;

const authService = {
  /**
   * Register a new user
   * @param {string} username
   * @param {string} password
   * @returns {Promise<Object>} The created user object (without password)
   * @throws {AuthenticationError} If validation fails or user already exists
   */
  registerUser: async (username, password) => {
    try {
      // Validate input
      const validatedData = userSchema.parse({ username, password });

      // Check if user already exists
      const existingUser = await authService.userExists(validatedData.username);
      if (existingUser) {
        throw new AuthenticationError("Username already taken", "USER_EXISTS");
      }

      // Hash password
      const hashedPassword = await hash(validatedData.password, SALT_ROUNDS);

      // Create user
      const user = await prisma.user.create({
        data: {
          username: validatedData.username,
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
      if (error instanceof z.ZodError) {
        throw new AuthenticationError(
          error.errors[0].message,
          "VALIDATION_ERROR"
        );
      }
      logger.error(`Error registering user: ${error.message}`);
      throw error;
    }
  },

  /**
   * Check if a username already exists
   * @param {string} username
   * @returns {Promise<boolean>}
   */
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

  /**
   * Authenticate a user
   * @param {string} username
   * @param {string} password
   * @returns {Promise<Object>} User object if authentication successful
   * @throws {AuthenticationError} If authentication fails
   */
  login: async (username, password) => {
    try {
      // Find user
      const user = await prisma.user.findUnique({
        where: { username },
      });

      if (!user) {
        throw new AuthenticationError(
          "Invalid username or password",
          "INVALID_CREDENTIALS"
        );
      }

      // Compare passwords
      const isValidPassword = await compare(password, user.password);
      if (!isValidPassword) {
        throw new AuthenticationError(
          "Invalid username or password",
          "INVALID_CREDENTIALS"
        );
      }

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
      });

      // Return user data (excluding password)
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

  /**
   * Update user password
   * @param {string} username
   * @param {string} currentPassword
   * @param {string} newPassword
   * @returns {Promise<void>}
   * @throws {AuthenticationError} If validation fails or current password is incorrect
   */
  updatePassword: async (username, currentPassword, newPassword) => {
    try {
      // Validate new password
      userSchema.shape.password.parse(newPassword);

      // Verify current password
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

      // Hash and update new password
      const hashedPassword = await hash(newPassword, SALT_ROUNDS);
      await prisma.user.update({
        where: { username },
        data: { password: hashedPassword },
      });

      logger.info(`Password updated successfully for user: ${username}`);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new AuthenticationError(
          error.errors[0].message,
          "VALIDATION_ERROR"
        );
      }
      logger.error(`Error updating password: ${error.message}`);
      throw error;
    }
  },
};

module.exports = authService;
