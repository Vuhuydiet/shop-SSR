const productService = require("./product.service")


module.exports = {

  getAllProducts: async (req, res) => {
    const query = matchedData(req);
  
    const { count, products } = await ProductService.getAllProducts(query);

    res.render('pages/products', { products, count });
  },

  getProductById : async (req, res) => {
    const productId = parseInt(req.params.id); 

    const product = await productService.getProductById(productId);

    const products = await productService.getAllProducts();

    res.render('pages/productDetail', { products: product, relative: products });
  },

}
