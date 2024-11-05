const productService = require("./product.service")


module.exports = {

  listAllProducts: async (req, res) => {
    const categories = await productService.getAllCategories();
    const brands = await productService.getAllBranches();
    const products = await productService.listAllProducts();
    res.render('pages/productList', { categories, brands, products });
  },

  getProductById : async (req, res) => {
    try {
      const productId = parseInt(req.params.id); 
      const product = await productService.getProductById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

}
