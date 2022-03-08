import db from '@database/models';

export const insertPurchasedProducts = args => db.purchasedProducts.create(args);
