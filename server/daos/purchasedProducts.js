import db from '@database/models';

export const insertPurchasedProducts = async args => db.purchasedProducts.create(args);
