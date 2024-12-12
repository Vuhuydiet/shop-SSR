const { NotFoundError } = require("../../core/ErrorResponse");
const prisma = require("../../models");
const ShopService = "../shop/shop.service";

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
  brand?: number;
  category?: number;

  imageUrl?: Express.Multer.File;
}

type ProductQueryParams = {
  category?: number;
  brand?: number;
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
    OR: (queryParams.categories || queryParams.brands)  && [
      {
        categoryId: queryParams.categories && { in: queryParams.categories },
      },
      {
        brandId: queryParams.brands && { in: queryParams.brands },
      }
    ],
    stock: {
      gte: queryParams?.minQuantity,
      lte: queryParams?.maxQuantity,
    },
    currentPrice: {
      gte: queryParams?.minPrice || undefined,
      lte: queryParams?.maxPrice || undefined,
    },
    rating: {
      gte: queryParams?.minRating || undefined,
      lte: queryParams?.maxRating || undefined,
    },
    publishedAt: {
      gte: queryParams?.postedAfter,
      lte: queryParams?.postedBefore,
    },
  };
}

class ProductService {
  static async getBrandById(brandId) {
    return await prisma.brand.findUnique({
      where: {
        brandId: brandId,
      },
    });
  }

  static async getAllBrands() {
    return await prisma.brand.findMany();
  }

  static async getCategoryById(categoryId) {
    return await prisma.category.findUnique({
      where: {
        categoryId: categoryId,
      },
    });
  }

  static async getAllCategories() {
    return await prisma.category.findMany();
  }

  static async getProductById(productId) {
    const product = await prisma.product.findUnique({
      where: {
        productId: productId,
      },
      include: {
        category: true,
        brand: true,
        productImages: true
      },
    });

    if (!product) throw new NotFoundError({ message: "Product not found" });

    return product;
  }

  static async getAllProducts(queryParams = {}) {
    const condition = getCondition(queryParams);

    const [count, products] = await Promise.all([
      prisma.product.count({
        where: condition,
      }),
      prisma.product.findMany({
        where: condition,
        skip: queryParams?.offset || 0,
        take: queryParams?.limit || 9,
        orderBy: queryParams?.sortBy
          ? {
              [queryParams?.sortBy]: queryParams?.order || "asc",
            }
          : undefined,

        include: {
          category: true,
          brand: true,
          productImages: true
        },
      }),
    ]);
    return { count, products };
  }
}

module.exports = ProductService;
