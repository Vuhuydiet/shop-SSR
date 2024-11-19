const productService = require("./product.service")
const { matchedData } = require('express-validator');
const ProductService = require('./product.service');

module.exports = {

  getAllProducts: async (req, res) => {
    const query = req.query;
  
    //console.log('Query received:', query);

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

   
    
    //console.log('Processed Query:', query);
    const categories= await ProductService.getAllCategories();
    const brands = await ProductService.getAllBrands();
    const { count, products } = await ProductService.getAllProducts(query);
    //console.log('Query passed to frontend:', query);
    res.render('pages/products', { products: products, count: count, categories: categories, brands: brands, query: query });
  },

  getProductById : async (req, res) => {
    const { productId } = matchedData(req);

    const categories= await ProductService.getAllCategories();
    const product = await ProductService.getProductById(productId);

    const query=req.query;
    //console.log('Query passed to frontend:', query);
    query.brands = [product.brand];
    const {count, products} = await ProductService.getAllProducts(query);
    //console.log('Query passed to frontend:', products.map(p => p.productImageUrl));
    res.render('pages/productDetail', { product, categories: categories, products: products});
  },

}
