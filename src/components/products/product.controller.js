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
    console.log("Before Entered JSON");
    if (req.xhr || req.headers.accept.includes('application/json')) {
      console.log("Entered JSON");
      return res.json({
        products,
        count,
        brands,
        totalPages,
        currentPage: page,
        query: queries,
      });
    }
    else{
        console.log("Entered HTML");
        res.render("pages/products", {
          products,
          count,
          brands,
          totalPages,
          currentPage: page,
          query: queries,
        });
    }
  },

  getProductById: async (req, res) => {
    const { productId } = matchedData(req);

    const product = await ProductService.getProductById(productId);

    const { count, products } = await ProductService.getAllProducts({
      brands: [product.brandId],
      categories: [product.categoryId],
    });

    res.render("pages/productDetail", {
      additionalStylesheets: ['https://unpkg.com/swiper/swiper-bundle.min.css'],
      additionalScripts: ['https://unpkg.com/swiper/swiper-bundle.min.js'],
      count,
      product,
      products,
    });
  },
};
