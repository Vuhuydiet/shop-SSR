const prisma = require("./index");

// import { getHashedPassword } from '../utils/cryptoUtils.js';

async function main() {
  console.log("Start seeding ...");

  await prisma.product.createMany({
    data: [
      {
        name: "Table",
        initialPrice: 120,
        price: 100,
        stock: 884,
        category: "Furniture",
        brand: "Toyota",
        description:
          "A table is an item of furniture with a flat top and one or more legs, used as a surface for working at, eating from or on which to place things.",
        image: 'assets/images/products/product9.jpg',
        stars: 4,
        numReviews: 1203,
      },
      {
        name: "iOS 10.3.2, up to iPadOS 14.6",
        price: 9534.48,
        initialPrice: 1676.54,
        stock: 453,
        category: "Handmade",
        brand: "Nike",
        description: "pixaupwwkjfsiowancolhoiarishxdwtp",
        image: 'assets/images/products/product1.jpg',
        stars: 1.6,
        numReviews: 534,
      },
      {
        name: "Android 10, Magic UI 2",
        price: 2356.51,
        initialPrice: 5672.06,
        stock: 53,
        category: "Handmade",
        brand: "Adidas",
        description: "ihdvfhyosvsrfmmpcqiwiizslqxpjmjjj",
        image: 'assets/images/products/product2.jpg',
        stars: 2.1,
        numReviews: 939,
      },
      {
        name: "Feature phone",
        price: 8962.84,
        initialPrice: 6493.89,
        stock: 275,
        category: "Books",
        brand: "Samsung",
        description: "firrrfzsaeccliwthgaogqjdrbloxwxub",
        image: 'assets/images/products/product3.jpg',
        stars: 4.4,
        numReviews: 232,
      },
      {
        name: "Android 4.4.4, up to 6.0",
        price: 3725.63,
        initialPrice: 3327.88,
        stock: 626,
        category: "Clothing",
        brand: "Apple",
        description: "qmpinapsmoketikusqdzfkbjnwvyhnmug",
        image: 'assets/images/products/product4.jpg',
        stars: 2.9,
        numReviews: 750,
      },
      {
        name: "Feature phone",
        price: 8402.91,
        initialPrice: 900.13,
        stock: 683,
        category: "Books",
        brand: "Nike",
        description: "jmmghvtakphnpptlobeltkwupytyhsxgh",
        image: 'assets/images/products/product5.jpg',
        stars: 3.5,
        numReviews: 239,
      },
      {
        name: "Feature phone",
        price: 6263.92,
        initialPrice: 5093.37,
        stock: 665,
        category: "Electronics",
        brand: "Adidas",
        description: "qhyulqjkgikthsenvyutkkcyyrtsecsek",
        image: 'assets/images/products/product6.jpg',
        stars: 1.2,
        numReviews: 657,
      },
      {
        name: "Feature phone",
        price: 6431.85,
        initialPrice: 2542.44,
        stock: 742,
        category: "Books",
        brand: "Apple",
        description: "lkkogdhkrkbneyqsdmvyrktvzbhqzckcu",
        image: 'assets/images/products/product7.jpg',
        stars: 4.8,
        numReviews: 392,
      },
      {
        name: "Android 4.4.4, Timescape UI",
        price: 1443.46,
        initialPrice: 4006.83,
        stock: 758,
        category: "Handmade",
        brand: "Apple",
        description: "vxxpqibophkiwnrjrinwtpcewywkwhpwu",
        image: 'assets/images/products/product8.jpg',
        stars: 1.9,
        numReviews: 561,
      },
      {
        name: "Feature phone",
        price: 8953.57,
        initialPrice: 7424.71,
        stock: 487,
        category: "Clothing",
        brand: "Adidas",
        description: "hyklcghvyvexrlhzagabbfxxasxtkcskd",
        image: 'assets/images/products/product9.jpg',
        stars: 3.1,
        numReviews: 334,
      },
      {
        name: "Android 4.4.2",
        price: 330.71,
        initialPrice: 6950.98,
        stock: 162,
        category: "Clothing",
        brand: "Adidas",
        description: "dbqxvismedntkmwgglhujwuglrzzkpomn",
        image: 'assets/images/products/product10.jpg',
        stars: 1.2,
        numReviews: 2,
      },
      {
        name: "Feature phone",
        price: 7376.57,
        initialPrice: 3604.09,
        stock: 492,
        category: "Handmade",
        brand: "Toyota",
        description: "yznvbfbrzivmdkaxcqyrhczwkesmfzvqn",
        image: 'assets/images/products/product11.jpg',
        stars: 3.0,
        numReviews: 953,
      },
      {
        name: "Feature phone",
        price: 44.81,
        initialPrice: 3920.08,
        stock: 392,
        category: "Books",
        brand: "Honda",
        description: "xywalpogyofagrratnjyxfilbubhjtkho",
        image: 'assets/images/products/product12.jpg',
        stars: 3.2,
        numReviews: 89,
      },
    ],
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
