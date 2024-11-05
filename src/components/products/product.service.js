const prisma = require("../../models")


module.exports = {

  getAllCategories: async () => {
    return ['Electronics', 'Books', 'Clothing', 'Shoes', 'Handmade'];
  },

  getAllBranches: async () => {
    return ['Toyota', 'Honda', 'Samsung', 'Apple', 'Nike', 'Adidas'];
  },

  listAllProducts: async () => {
    return await prisma.product.findMany();
  },

  getProductById: async (productId) => {
    try {
      const product = await prisma.product.findUnique({
        where: { id: parseInt(productId) },
      });
      return product;
    } catch (error) {
      throw new Error("Could not fetch product");
    }
  }
}