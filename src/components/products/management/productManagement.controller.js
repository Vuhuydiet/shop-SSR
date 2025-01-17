const { matchedData } = require("express-validator");
const { OKResponse } = require("../../../core/SuccessResponse");
const productService = require("./../product.service");
const CloudService = require("../../clouds/cloud.service");

module.exports = {
  getBrands: async (req, res) => {
    const brands = await productService.getAllBrands();
    new OKResponse({
      message: "Brands fetched successfully",
      metadata: { brands },
    }).send(res);
  },

  getCategories: async (req, res) => {
    const categories = await productService.getAllCategories();
    new OKResponse({
      message: "Categories fetched successfully",
      metadata: { categories },
    }).send(res);
  },

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

  createProduct: async (req, res, next) => {
    try {
      const productData = matchedData(req);
      const files = req.files || [];

      const productImages = await Promise.all(
        files.map(async (file) => {
          const imageData = await CloudService.uploadImage(file);
          return {
            publicId: imageData.publicId,
            url: imageData.url,
          };
        })
      );

      const product = await productService.createProduct({
        ...productData,
        productImages,
      });

      new OKResponse({
        message: "Product created successfully",
        metadata: { product },
      }).send(res);
    } catch (error) {
      next(error);
    }
  },

  updateProduct: async (req, res, next) => {
    try {
      const { productId, ...updateData } = matchedData(req);

      console.log(updateData.productImages)
      /**
       * @type {Array<Express.Multer.File>} files
       */
      if (updateData.productImages) {
        await Promise.all(
          updateData.productImages.filter(image => image.publicId.length > 5).map((img) =>
            CloudService.deleteImage(img.publicId)
          )
        );
        updateData.deletingImages = updateData.productImages.map((img) => img.imageId);
        updateData.productImages = undefined;
      }
      const files = req.files || [];
      if (files.length > 0) {
        const productImages = await Promise.all(
          files.map(async (file) => {
            const imageData = await CloudService.uploadImage(file);
            return {
              publicId: imageData.publicId,
              url: imageData.url,
            };
          })
        );
        updateData.productImages = productImages;
      }
      console.log(updateData)

      const product = await productService.updateProduct(productId, updateData);

      new OKResponse({
        message: "Product updated successfully",
        metadata: { product },
      }).send(res);
    } catch (error) {
      next(error);
    }
  },

  deleteProduct: async (req, res, next) => {
    try {
      const { productId } = matchedData(req);
      const product = await productService.getProductById(productId);

      if (product.image?.publicId) {
        await CloudService.deleteImage(product.image.publicId);
      }

      await productService.deleteProduct(productId);

      new OKResponse({
        message: "Product deleted successfully",
      }).send(res);
    } catch (error) {
      next(error);
    }
  },
};
