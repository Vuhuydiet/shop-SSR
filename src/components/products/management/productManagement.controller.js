const { matchedData } = require("express-validator");
const { OKResponse } = require("../../../core/SuccessResponse");
const productService = require("./productManagement.service");

module.exports = {
  getProducts: async (req, res) => {
    const query = matchedData(req);
    const { count, products } = await productService.getAllProducts(query);

    new OKResponse({
      message: "Products fetched successfully",
      metadata: { count, products },
    }).send(res);
  },

  getProduct: async (req, res) => {
    const { productId } = matchedData(req);
    const product = await productService.getProductById(productId);

    new OKResponse({
      message: "Product fetched successfully",
      metadata: { product },
    }).send(res);
  },

  createProduct: async (req, res) => {
    const productData = matchedData(req);
    const product = await productService.createProduct(productData);

    new OKResponse({
      message: "Product created successfully",
      metadata: { product },
    }).send(res);
  },

  updateProduct: async (req, res) => {
    const { productId, ...updateData } = matchedData(req);
    const product = await productService.updateProduct(productId, updateData);

    new OKResponse({
      message: "Product updated successfully",
      metadata: { product },
    }).send(res);
  },

  deleteProduct: async (req, res) => {
    const { productId } = matchedData(req);
    await productService.deleteProduct(productId);

    new OKResponse({
      message: "Product deleted successfully",
    }).send(res);
  },
};
