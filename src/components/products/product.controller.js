const productService = require("./product.service")


module.exports = {

  listAllProducts: async (req, res) => {
    const categories = await productService.getAllCategories();
    const brands = await productService.getAllBranches();
    const products = await productService.listAllProducts();
    res.render('productList', { categories, brands, products });
  },


}
