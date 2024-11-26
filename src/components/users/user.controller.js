const userService = require("./user.service");
const productService = require("../products/product.service");
const { z } = require("zod");

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

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  res.redirect("/login");
};

// Middleware to check if user is NOT authenticated (for login/register pages)
const isNotAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return res.redirect("/");
  }
  next();
};

const userController = {
  getRegisterPage: async (req, res) => {
    const categories = await productService.getAllCategories();
    res.render("pages/register", { categories: categories });
  },

  postRegister: async (req, res) => {
    const { username, password } = req.body;

    try {
      const validatedData = userSchema.parse({ username, password });

      if (await userService.userExists(validatedData.username)) {
        return res.status(400).json({
          message: "Username already exists",
          ok: false,
        });
      }
      await userService.registerUser(
        validatedData.username,
        validatedData.password
      );

      res.status(201).json({
        ok: true,
        message: "Registration successful",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          ok: false,
          message: error.errors[0].message,
        });
      }
      res.status(400).json({
        ok: false,
        message: error.message,
      });
    }
  },

  getLoginPage: async (req, res) => {
    const categories = await productService.getAllCategories();
    res.render("pages/login", { categories: categories });
  },

  postLogin: async (req, res) => {
    try {
      const { username, password } = req.body;
      const validatedData = userSchema.parse({ username, password });

      const user = await userService.login(
        validatedData.username,
        validatedData.password
      );

      req.session.user = user;
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).json({ message: "Internal server error" });
        }
        res.status(200).json({ ok: true, message: "Login successful" });
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          ok: false,
          message: error.errors[0].message,
        });
      }
      res.status(401).json({ ok: false, message: error.message });
    }
  },

  logout: async (req, res) => {
    req.session.destroy();
    res.redirect("/login");
  },

  updatePassword: async (req, res) => {
    const { username, currentPassword, newPassword } = req.body;

    try {
      userSchema.shape.password.parse(newPassword);

      await userService.updatePassword(username, currentPassword, newPassword);

      res.status(200).json({
        ok: true,
        message: "Password updated successfully",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          ok: false,
          message: error.errors[0].message,
        });
      }
      res.status(400).json({
        ok: false,
        message: error.message,
      });
    }
  },
};

module.exports = {
  ...userController,
  isAuthenticated,
  isNotAuthenticated,
};
