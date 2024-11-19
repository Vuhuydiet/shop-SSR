const ProductService = require("../products/product.service");

module.exports = {
  getHomePage: async (req, res) => {
    const newArrivalProducts = await ProductService.getAllProducts({
      limit: 8,
      sortedBy: "publishedAt",
    });

    const recommendedProducts = await ProductService.getAllProducts({
      limit: 4,
      sortedBy: "stars",
    });

    res.render("pages/home", { newArrivalProducts: newArrivalProducts.products, recommendedProducts: recommendedProducts.products });
  },
};
