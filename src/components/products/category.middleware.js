
const ProductService = require("./product.service")

module.exports = {
  getCategories: async (req, res, next) => {
    const categories = await ProductService.getAllCategories();
    res.locals.categories = categories;
    next();
  }

}
