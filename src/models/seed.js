const prisma = require("./index");


async function main() {
  console.log("Start seeding ...");

  const productCategories = [
    { categoryName: "Furniture" },
    { categoryName: "Electronics" },
    { categoryName: "Clothing" },
    { categoryName: "Automotive" },
    { categoryName: "Sports" },
    { categoryName: "Books" },
  ];

  await prisma.productCategory.deleteMany();
  await prisma.productCategory.createMany({
    data: productCategories,
  });

  const products =  [
    {
      productName: "Table",
      originalPrice: 120,
      currentPrice: 100,
      quantity: 884,
      brand: "Toyota",
      productDescription:
        "A table is an item of furniture with a flat top and one or more legs, used as a surface for working at, eating from or on which to place things.",
      productImageUrl: 'assets/images/products/product9.jpg',
      stars: 4,
      numReviews: 1203,
      categories: {
        connect: {
          categoryName: "Furniture",
        }
      }
    },
    {
      productName: "iOS 10.3.2, up to iPadOS 14.6",
      currentPrice: 9534.48,
      originalPrice: 1676.54,
      quantity: 453,
      brand: "Nike",
      productDescription: "pixaupwwkjfsiowancolhoiarishxdwtp",
      productImageUrl: 'assets/images/products/product1.jpg',
      stars: 1.6,
      numReviews: 534,
      categories: {
        connect: {
          categoryName: "Electronics",

        }
      }
    },
    {
      productName: "Android 10, Magic UI 2",
      currentPrice: 2356.51,
      originalPrice: 5672.06,
      quantity: 53,
      brand: "Adidas",
      productDescription: "ihdvfhyosvsrfmmpcqiwiizslqxpjmjjj",
      productImageUrl: 'assets/images/products/product2.jpg',
      stars: 2.1,
      numReviews: 939,
      categories: {
        connect: {
          categoryName: "Electronics",

        }
      }
    },
    {
      productName: "Feature phone",
      currentPrice: 8962.84,
      originalPrice: 6493.89,
      quantity: 275,
      brand: "Samsung",
      productDescription: "firrrfzsaeccliwthgaogqjdrbloxwxub",
      productImageUrl: 'assets/images/products/product3.jpg',
      stars: 4.4,
      numReviews: 232,
      categories: {
        connect: {
          categoryName: "Electronics",

        }
      }
    },
    {
      productName: "Android 4.4.4, up to 6.0",
      currentPrice: 3725.63,
      originalPrice: 3327.88,
      quantity: 626,
      brand: "Apple",
      productDescription: "qmpinapsmoketikusqdzfkbjnwvyhnmug",
      productImageUrl: 'assets/images/products/product4.jpg',
      stars: 2.9,
      numReviews: 750,
      categories: {
        connect: {
          categoryName: "Electronics",

        }
      }
    },
    {
      productName: "Feature phone",
      currentPrice: 8402.91,
      originalPrice: 900.13,
      quantity: 683,
      brand: "Nike",
      productDescription: "jmmghvtakphnpptlobeltkwupytyhsxgh",
      productImageUrl: 'assets/images/products/product5.jpg',
      stars: 3.5,
      numReviews: 239,
      categories: {
        connect: {
          categoryName: "Electronics",

        }
      }
    },
    {
      productName: "Feature phone",
      currentPrice: 6263.92,
      originalPrice: 5093.37,
      quantity: 665,
      brand: "Adidas",
      productDescription: "qhyulqjkgikthsenvyutkkcyyrtsecsek",
      productImageUrl: 'assets/images/products/product6.jpg',
      stars: 1.2,
      numReviews: 657,
      categories: {
        connect: {
          categoryName: "Electronics",

        }
      }
    },
    {
      productName: "Feature phone",
      currentPrice: 6431.85,
      originalPrice: 2542.44,
      quantity: 742,
      brand: "Apple",
      productDescription: "lkkogdhkrkbneyqsdmvyrktvzbhqzckcu",
      productImageUrl: 'assets/images/products/product7.jpg',
      stars: 4.8,
      numReviews: 392,
      categories: {
        connect: {
          categoryName: "Electronics",

        }
      }
    },
    {
      productName: "Android 4.4.4, Timescape UI",
      currentPrice: 1443.46,
      originalPrice: 4006.83,
      quantity: 758,
      brand: "Apple",
      productDescription: "vxxpqibophkiwnrjrinwtpcewywkwhpwu",
      productImageUrl: 'assets/images/products/product8.jpg',
      stars: 1.9,
      numReviews: 561,
      categories: {
        connect: {
          categoryName: "Electronics",
        }
      }
    },
    {
      productName: "Feature phone",
      currentPrice: 8953.57,
      originalPrice: 7424.71,
      quantity: 487,
      brand: "Adidas",
      productDescription: "hyklcghvyvexrlhzagabbfxxasxtkcskd",
      productImageUrl: 'assets/images/products/product9.jpg',
      stars: 3.1,
      numReviews: 334,
      categories: {
        connect: {
          categoryName: "Electronics",

        }
      }
    },
    {
      productName: "Android 4.4.2",
      currentPrice: 330.71,
      originalPrice: 6950.98,
      quantity: 162,
      brand: "Adidas",
      productDescription: "dbqxvismedntkmwgglhujwuglrzzkpomn",
      productImageUrl: 'assets/images/products/product10.jpg',
      stars: 1.2,
      numReviews: 2,
      categories: {
        connect: {
          categoryName: "Electronics",
        }
      }
    },
    {
      productName: "Feature phone",
      currentPrice: 7376.57,
      originalPrice: 3604.09,
      quantity: 492,
      brand: "Toyota",
      productDescription: "yznvbfbrzivmdkaxcqyrhczwkesmfzvqn",
      productImageUrl: 'assets/images/products/product11.jpg',
      stars: 3.0,
      numReviews: 953,
      categories: {
        connect: {
          categoryName: "Electronics",
        }
      }
    },
    {
      productName: "Feature phone",
      currentPrice: 44.81,
      originalPrice: 3920.08,
      quantity: 392,
      brand: "Honda",
      productDescription: "xywalpogyofagrratnjyxfilbubhjtkho",
      productImageUrl: 'assets/images/products/product12.jpg',
      stars: 3.2,
      numReviews: 89,
      categories: {
        connect: {
          categoryName: "Electronics",
        }
      }
    },
  ];

  await prisma.product.deleteMany();
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
