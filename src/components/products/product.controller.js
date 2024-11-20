const { matchedData } = require("express-validator");
const ProductService = require("./product.service");

module.exports = {
  getAllProducts: async (req, res) => {
    const queries = matchedData(req);

    const { products, count } = await ProductService.getAllProducts(queries);
    const brands = await ProductService.getAllBrands();
    
    res.render("pages/products", {
      products: products,
      count: count,
      brands: brands,
      query: queries,
    });
  },

  getProductById: async (req, res) => {
    const { productId } = matchedData(req);

    const categories = await ProductService.getAllCategories();
    const product = await ProductService.getProductById(productId);

    const query = req.query;
    //console.log('Query passed to frontend:', query);
    query.brands = [product.brand];
    const { count, products } = await ProductService.getAllProducts(query);
    //console.log('Query passed to frontend:', products.map(p => p.productImageUrl));
    res.render("pages/productDetail", {
      product,
      categories: categories,
      products: products,
    });
  },
};
