const { matchedData } = require("express-validator");
const ProductService = require("./product.service");

module.exports = {
  getAllProducts: async (req, res) => {
    const queries = matchedData(req);

    const brands = await ProductService.getAllBrands();

    const limit = queries.limit || 9;
    const page = Math.max(1, queries.page || 1);
    const offset = (page - 1) * limit;

    queries.limit = limit;
    queries.offset = offset;

    const { products, count } = await ProductService.getAllProducts(queries);
    const totalPages = Math.ceil(count / limit);

    //console.log('Query passed to frontend:', products);

    res.render("pages/products", {
      brands: brands,
    });
  },

  getAllProductsJSON: async (req, res) => {
    const queries = matchedData(req);

    const brands = await ProductService.getAllBrands();

    const limit = queries.limit || 9;
    const page = Math.max(1, queries.page || 1);
    const offset = (page - 1) * limit;

    queries.limit = limit;
    queries.offset = offset;


    const {products, count} = await ProductService.getAllProducts(queries);
    const totalPages = Math.ceil(count / limit);

    return res.json({
      products,
      count,
      brands,
      totalPages,
      currentPage: page,
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
    //query.categories.map(Number)=[query.categories];

    const { count, products } = await ProductService.getAllProducts(query);
    //console.log('Query passed to frontend:', products.map(p => p.productImageUrl));
    res.render("pages/productDetail", {
      additionalStylesheets: ['https://unpkg.com/swiper/swiper-bundle.min.css'],
      additionalScripts: ['https://unpkg.com/swiper/swiper-bundle.min.js'],
      count,
      product,
      categories: categories,
      products: products,
    });
  },
};
