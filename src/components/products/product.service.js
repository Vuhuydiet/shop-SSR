const { NotFoundError } = require('../../core/ErrorResponse');
const prisma = require("../../models");
const ShopService = ('../shop/shop.service');


/*

type ProductCategoryData = {
  name: string;
  description?: string;
}

type ProductData = {
  name: string;
  description?: string;
  quantity?: number;
  price: number;
  brand?: string;
  imageUrl?: string;
  categories?: {
    add?: number[],
    remove?: number[]
  }
}

type ProductQueryParams = {
  shopId?: number;
  category?: number;
  brand?: string;
  postedAfter?: Date;
  postedBefore?: Date;
  minPrice?: number;
  maxPrice?: number;
  minQuantity?: number;
  maxQuantity?: number;
  sortBy?: 'currentPrice' | 'quantity' | 'publishedAt';
  order?: 'asc' | 'desc';

  offset?: number;
  limit?: number;
}


*/

function getCondition(queryParams) {
  return {
    categories: queryParams?.category ? {
      some: {
        categoryId: queryParams?.category
      }
    } : undefined,
    brand: queryParams?.brand,
    quantity: {
      gte: queryParams?.minQuantity,
      lte: queryParams?.maxQuantity
    },
    currentPrice: {
      gte: queryParams?.minPrice || undefined,
      lte: queryParams?.maxPrice || undefined,
    },
    publishedAt: {
      gte: queryParams?.postedAfter,
      lte: queryParams?.postedBefore,
    },
  };
}

class ProductService {

  static async getAllBrands() {
    return (await prisma.product.findMany({
      select: {
        brand: true
      },
      distinct: ['brand']
    })).map(product => product.brand);
  }

  static async createCategory({ name, description }) {
    return await prisma.productCategory.create({
      data: {
        categoryName: name,
        description: description
      }
    });
  }

  static async getCategoryById(categoryId) {
    return await prisma.productCategory.findUnique({
      where: {
        categoryId: categoryId
      }
    });
  }

  static async getAllCategories() {
    return await prisma.productCategory.findMany();
  }

  static async updateCategory(categoryId, { name, description }) {
    return await prisma.productCategory.update({
      where: {
        categoryId: categoryId
      },
      data: {
        categoryName: name,
        description: description
      }
    });
  }

  static async deleteCategory(categoryId) {
    await prisma.productCategory.delete({
      where: {
        categoryId: categoryId
      }
    });
  }

  static async createProduct(shopId, productData) {
    await ShopService.checkShopExists(shopId);

    return await tx.product.create({
      data: {
        productName: productData.name,
        productDescription: productData.description,
        quantity: productData.quantity,
        currentPrice: productData.price,
        originalPrice: productData.price,
        brand: productData.brand,
        productImageUrl: productData.productImageUrl,
        categories: {
          connect: productData.categories?.add?.map(category => ({ categoryId: category }))
        },
      },
      include: {
        categories: true
      }
    });
  }

  static async getProductById(productId) {
    const product = await prisma.product.findUnique({
      where: {
        productId: productId,
      },
      include: {
        categories: true,
      }
    });

    if (!product)
      throw new NotFoundError('Product not found');

    return product;
  }

  static async getAllProducts(queryParams = {}) {

    const condition = {
      categories: queryParams.categories
        ? { some: { categoryId: { in: queryParams.categories.map(Number) } } }
        : undefined,
      brand: queryParams.brands ? { in: queryParams.brands } : undefined,
      currentPrice: {
        ...(queryParams.minPrice ? {gte: Number(queryParams.minPrice)} : {}),
        ...(queryParams.maxPrice ? {lte: Number(queryParams.maxPrice)} : {}),
      },
    };

    //console.log('Filter condition:', condition);

    const [count, products] = await Promise.all([
      prisma.product.count({
        where: condition
      }),

      prisma.product.findMany({
        where: condition,
        skip: queryParams?.offset || 0,
        take: queryParams?.limit || 10,
        orderBy: queryParams?.sortBy ? {
          [queryParams?.sortBy]: queryParams?.order || 'asc'
        } : undefined,

        include: {
          categories: true
        }
      })
    ]);
    
    return { count, products };
  }

  static async updateProduct(productId, { name, description, quantity, price, brand, categories, imageUrl }) {
    await this.getProductById(productId);

    return await tx.product.update({
      where: {
        productId: productId,
      },
      data: {
        productName: name,
        productDescription: description,
        quantity: quantity,
        currentPrice: price,
        brand: brand,
        productImageUrl: imageUrl,

        categories: {
          connect: categories?.add?.map(category => ({ categoryId: category })),
          disconnect: categories?.remove?.map(category => ({ categoryId: category }))
        },
      }
    });
  }

  static async deleteProduct(productId) {
    await this.getProductById(productId);

    await tx.product.delete({
      where: {
        productId: productId
      }
    });
  }
}

module.exports = ProductService;