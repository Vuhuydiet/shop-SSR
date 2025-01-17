const ProductService = require("../products/product.service");

module.exports = {
  getHomePage: async (req, res) => {
    const newArrivalProducts = await ProductService.getAllProducts({
      limit: 8,
      sortedBy: "publishedAt",
    });

    const recommendedProducts = await ProductService.getAllProducts({
      limit: 4,
      sortedBy: "rating",
      order: "desc",
    });

    res.render("pages/home", {
      newArrivalProducts: newArrivalProducts.products,
      recommendedProducts: recommendedProducts.products,
    });
  },

  getAboutPage: async (req, res) => {
    res.render("pages/about", {
      user: req.user || null,
    });
  },
};
