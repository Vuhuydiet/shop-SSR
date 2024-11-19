const { handle } = require("express/lib/router");
const ProductService = require("./product.service")

module.exports = {
  getCategory: async (req, res, next) => {
    const categories = await ProductService.getAllCategories();
    res.locals.categories = categories;
    next();
  }

}