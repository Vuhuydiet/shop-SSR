const { connect } = require("../components");
const prisma = require("./index");


async function main() {
  console.log("Start seeding ...");
  
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();

  const productcategory = [
    { categoryName: "Furniture" },
    { categoryName: "Electronics" },
    { categoryName: "Clothing" },
    { categoryName: "Automotive" },
    { categoryName: "Sports" },
    { categoryName: "Books" },
  ];

  await prisma.category.createMany({
    data: productcategory,
  });

  const productBrands = [
    { brandName: "Toyota" },
    { brandName: "Nike" },
    { brandName: "Adidas" },
    { brandName: "Samsung" },
    { brandName: "Apple" },
    { brandName: "Honda" },
  ];

  await prisma.brand.createMany({
    data: productBrands,
  });

  const products =  [
    {
      productName: "Table",
      originalPrice: 120,
      currentPrice: 100,
      stock: 884,
      brand: { connect: { brandName: "Toyota" } },
      productDescription:
        "A table is an item of furniture with a flat top and one or more legs, used as a surface for working at, eating from or on which to place things.",
      // productImageUrl: 'assets/images/products/product7.jpg',
      rating: 4,
      numReviews: 1203,
      category: { connect: { categoryName: "Furniture" } },
      productImages: {
        create: [
          {
            publicId: "a",
            url: "/assets/images/products/product1.jpg"
          }
        ]
      }
    },
    {
      productName: "iOS 10.3.2, up to iPadOS 14.6",
      currentPrice: 9534.48,
      originalPrice: 1676.54,
      stock: 453,
      brand: { connect: { brandName: "Nike" } },
      productDescription: "pixaupwwkjfsiowancolhoiarishxdwtp",
      // productImageUrl: 'assets/images/products/product1.jpg',
      rating: 1.6,
      numReviews: 534,
      category: { connect: { categoryName: "Electronics" } }
    },
    {
      productName: "Android 10, Magic UI 2",
      currentPrice: 2356.51,
      originalPrice: 5672.06,
      stock: 53,
      brand: { connect: { brandName: "Adidas" } },
      productDescription: "ihdvfhyosvsrfmmpcqiwiizslqxpjmjjj",
      // productImageUrl: 'assets/images/products/product2.jpg',
      rating: 2.1,
      numReviews: 939,
      category: {
        connect: {
          categoryName: "Electronics",
        }
      },
      productImages: {
        create: [
          {
            publicId: "a",
            url: "/assets/images/products/product2.jpg"
          }
        ]
      }
    },
    {
      productName: "Feature phone",
      currentPrice: 8962.84,
      originalPrice: 6493.89,
      stock: 275,
      brand: { connect: { brandName: "Samsung" } },
      productDescription: "firrrfzsaeccliwthgaogqjdrbloxwxub",
      // productImageUrl: 'assets/images/products/product3.jpg',
      rating: 4.4,
      numReviews: 232,
      category: {
        connect: {
          categoryName: "Electronics",
        }
      },
      productImages: {
        create: [
          {
            publicId: "a",
            url: "/assets/images/products/product3.jpg"
          }
        ]
      }
    },
    {
      productName: "Android 4.4.4, up to 6.0",
      currentPrice: 3725.63,
      originalPrice: 3327.88,
      stock: 626,
      brand: { connect: { brandName: "Apple" } },
      productDescription: "qmpinapsmoketikusqdzfkbjnwvyhnmug",
      // productImageUrl: 'assets/images/products/product4.jpg',
      rating: 2.9,
      numReviews: 750,
      category: {
        connect: {
          categoryName: "Electronics",

        }
      },
      productImages: {
        create: [
          {
            publicId: "a",
            url: "/assets/images/products/product4.jpg"
          }
        ]
      }
    },
    {
      productName: "Feature phone",
      currentPrice: 8402.91,
      originalPrice: 900.13,
      stock: 683,
      brand: { connect: { brandName: "Nike" } },
      productDescription: "jmmghvtakphnpptlobeltkwupytyhsxgh",
      // productImageUrl: 'assets/images/products/product5.jpg',
      rating: 3.5,
      numReviews: 239,
      category: {
        connect: {
          categoryName: "Electronics",
        }
      }
      ,
      productImages: {
        create: [
          {
            publicId: "a",
            url: "/assets/images/products/product6.jpg"
          }
        ]
      }
    },
    {
      productName: "Feature phone",
      currentPrice: 6263.92,
      originalPrice: 5093.37,
      stock: 665,
      brand: { connect: { brandName: "Adidas" } },
      productDescription: "qhyulqjkgikthsenvyutkkcyyrtsecsek",
      // productImageUrl: 'assets/images/products/product6.jpg',
      rating: 1.2,
      numReviews: 657,
      category: {
        connect: {
          categoryName: "Electronics",

        }
      },
      productImages: {
        create: [
          {
            publicId: "a",
            url: "/assets/images/products/product7.jpg"
          }
        ]
      }
    },
    {
      productName: "Feature phone",
      currentPrice: 6431.85,
      originalPrice: 2542.44,
      stock: 742,
      brand: { connect: { brandName: "Apple" } },
      productDescription: "lkkogdhkrkbneyqsdmvyrktvzbhqzckcu",
      // productImageUrl: 'assets/images/products/product7.jpg',
      rating: 4.8,
      numReviews: 392,
      category: {
        connect: {
          categoryName: "Electronics",
        }
      },
      productImages: {
        create: [
          {
            publicId: "a",
            url: "/assets/images/products/product8.jpg"
          }
        ]
      }
    },
    {
      productName: "Android 4.4.4, Timescape UI",
      currentPrice: 1443.46,
      originalPrice: 4006.83,
      stock: 758,
      brand: { connect: { brandName: "Apple" } },
      productDescription: "vxxpqibophkiwnrjrinwtpcewywkwhpwu",
      // productImageUrl: 'assets/images/products/product8.jpg',
      rating: 1.9,
      numReviews: 561,
      category: {
        connect: {
          categoryName: "Electronics",
        }
      },
      productImages: {
        create: [
          {
            publicId: "a",
            url: "/assets/images/products/product9.jpg"
          }
        ]
      }
    },
    {
      productName: "Feature phone",
      currentPrice: 8953.57,
      originalPrice: 7424.71,
      stock: 487,
      brand: { connect: { brandName: "Adidas" } },
      productDescription: "hyklcghvyvexrlhzagabbfxxasxtkcskd",
      // productImageUrl: 'assets/images/products/product9.jpg',
      rating: 3.1,
      numReviews: 334,
      category: {
        connect: {
          categoryName: "Electronics",
        }
      },
      productImages: {
        create: [
          {
            publicId: "a",
            url: "/assets/images/products/product10.jpg"
          }
        ]
      }
    },
    {
      productName: "Android 4.4.2",
      currentPrice: 330.71,
      originalPrice: 6950.98,
      stock: 162,
      brand: { connect: { brandName: "Adidas" } },
      productDescription: "dbqxvismedntkmwgglhujwuglrzzkpomn",
      // productImageUrl: 'assets/images/products/product10.jpg',
      rating: 1.2,
      numReviews: 2,
      category: {
        connect: {
          categoryName: "Electronics",
        }
      },
      productImages: {
        create: [
          {
            publicId: "a",
            url: "/assets/images/products/product11.jpg"
          }
        ]
      }
    },
    {
      productName: "Feature phone",
      currentPrice: 7376.57,
      originalPrice: 3604.09,
      stock: 492,
      brand: { connect: { brandName: "Toyota" } },
      productDescription: "yznvbfbrzivmdkaxcqyrhczwkesmfzvqn",
      // productImageUrl: 'assets/images/products/product11.jpg',
      rating: 3.0,
      numReviews: 953,
      category: {
        connect: {
          categoryName: "Electronics",
        }
      },
      productImages: {
        create: [
          {
            publicId: "a",
            url: "/assets/images/products/product12.jpg"
          }
        ]
      }
    },
    {
      productName: "Feature phone",
      currentPrice: 44.81,
      originalPrice: 3920.08,
      stock: 392,
      brand: { connect: { brandName: "Honda" } },
      productDescription: "xywalpogyofagrratnjyxfilbubhjtkho",
      // productImageUrl: 'assets/images/products/product12.jpg',
      rating: 3.2,
      numReviews: 89,
      category: {
        connect: {
          categoryName: "Electronics",
        }
      },
      productImages: {
        create: [
          {
            publicId: "a",
            url: "/assets/images/products/product6.jpg"
          }
        ]
      }
    },
  ];

  products.forEach(async (product) => {
    await prisma.product.create({
      data: product,
    });
  });
}

main()
  .then(() => {
    console.log("Database has been seeded!");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
