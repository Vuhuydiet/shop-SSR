const jwt = require("jsonwebtoken");
const userService = require("./user.service");
const productService = require("../products/product.service");

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
    const categories = await productService.getAllCategories();

    const { username, password } = req.body;

    try {
      if (await userService.userExists(username)) {
        return res.status(400).json({
          message: "Username already exists",
          ok: false,
        });
      }
      await userService.registerUser(username, password);
      res.status(201).json({
        ok: true,
        message: "Registration successful",
      });
    } catch (error) {
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
      const user = await userService.login(username, password);

      const token = jwt.sign(
        { id: user.id, username: user.username }, 
        "SECRET_KEY", 
        { expiresIn: "1h" } 
      );

      req.session.user = user;
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).json({ message: "Internal server error" });
        }

        res.cookie("token", token, {
          httpOnly: true, 
          secure: process.env.NODE_ENV === "production", 
          maxAge: 60 * 60 * 1000, 
        });

        res.status(200).json({ ok: true, message: "Login successful" });
      });
    } catch (error) {
      res.status(401).json({ ok: false, message: error.message });
    }
  },

  logout: async (req, res) => {
    req.session.destroy();
    res.clearCookie("token"); 
    res.redirect("/");
  },
};

module.exports = {
  ...userController,
  isAuthenticated,
  isNotAuthenticated,
};
