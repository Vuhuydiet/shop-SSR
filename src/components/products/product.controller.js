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
      const products = await productService.listAllProducts();
      const categories = await productService.getAllCategories();
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      //res.status(200).json(product);
      res.render('pages/productDetail', { categories: categories, products: product, relative: products });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

}
