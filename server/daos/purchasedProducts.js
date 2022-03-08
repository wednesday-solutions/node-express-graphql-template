import db from '@database/models';

export const insertPurchasedProducts = async args =>
  db.purchasedProducts.create(args).catch(() => 'Error while adding purchased products');
