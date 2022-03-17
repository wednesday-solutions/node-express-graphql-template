import db from '@database/models';

export const insertPurchasedProducts = args => db.purchasedProducts.create(args);

export const getCategoryById = async id => {
  const product = await db.products.findOne({ where: { id } });
  return product.category;
};

export const getEarliestCreatedDate = async () => {
  const earliestPurchasedProduct = await db.purchasedProducts.findOne({
    order: ['id']
  });
  return earliestPurchasedProduct.createdAt;
};
