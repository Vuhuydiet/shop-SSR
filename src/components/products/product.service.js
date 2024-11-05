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

}