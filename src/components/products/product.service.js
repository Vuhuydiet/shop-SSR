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
      return await prisma.product.findUnique({
        where: { id: productId },
      });
    } catch (error) {
      console.log('productId: %d',productId);
      throw new Error("Could not fetch product");
    }
  },

  
}