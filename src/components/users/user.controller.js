const userService = require('./user.service');

const productService = require('../products/product.service');

module.exports = {
  
  getRegisterPage: async (req, res) => {
    const categories = await productService.getAllCategories();
    res.render('pages/register', { categories: categories });
  },

  postRegister: async (req, res) => {
    const categories = await productService.getAllCategories();
    const { username, password } = req.body;
    if (await userService.userExists(username)) {
      res.status(400).json({ msg: 'User already exists' });
      return;
    }
    await userService.registerUser(username, password);
    res.status(201).json({ msg: 'User registered successfully' });
  },
}