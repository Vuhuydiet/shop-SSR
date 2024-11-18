import ProductService from "./product.service";

export default async (req, res, next) => {
  const categories = await ProductService.getAllCategories();
  res.locals.categories = categories;

  next();
};
