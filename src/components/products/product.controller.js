const productService = require("./product.service")
const { matchedData } = require('express-validator');
const ProductService = require('./product.service');

module.exports = {

  getAllProducts: async (req, res) => {
    const query = matchedData(req);
  
    const brands = await ProductService.getAllBrands();
    const { count, products } = await ProductService.getAllProducts(query);

    res.render('pages/products', { products, count, brands });
  },

  getProductById : async (req, res) => {
    const productId = parseInt(req.params.id); 

    const product = await ProductService.getProductById(productId);

    const products = await ProductService.getAllProducts();

    res.render('pages/productDetail', { products: product, relative: products });
  },

}
