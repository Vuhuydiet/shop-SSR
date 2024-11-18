const productService = require("./product.service")
const { matchedData } = require('express-validator');
const ProductService = require('./product.service');

module.exports = {

  getAllProducts: async (req, res) => {
    const query = req.query;
  
    console.log('Query received:', query);

    if (query.categories) {
      query.categories = Array.isArray(query.categories) ? query.categories : [query.categories];
    }
    if (query.brands) {
      query.brands = Array.isArray(query.brands) ? query.brands : [query.brands];
    }
    
    

    if (query.sortBy){
      const [field, order] = query.sortBy.split('-');
      query.sortBy=field || undefined;
      query.order=order || 'asc';
    } 

   
    
    console.log('Processed Query:', query);
    const categories= await ProductService.getAllCategories();
    const brands = await ProductService.getAllBrands();
    const { count, products } = await ProductService.getAllProducts(query);
    console.log('Query passed to frontend:', query);
    res.render('pages/products', { products: products, count: count, categories: categories, brands: brands, query: query });
  },

  getProductById : async (req, res) => {
    const { productId } = matchedData(req);

    const product = await ProductService.getProductById(productId);

    const products = await ProductService.getAllProducts();

    res.render('pages/productDetail', { products: product, relative: products });
  },

}
