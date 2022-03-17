import db from '@database/models';
import { Op } from 'sequelize';

export const insertPurchasedProducts = args => db.purchasedProducts.create(args);

export const getEarliestCreatedDate = async () => {
  const earliestPurchasedProduct = await db.purchasedProducts.findOne({
    order: ['id']
  });
  const date = earliestPurchasedProduct.createdAt.toISOString().split('T')[0];
  return date;
};

export const getTotalByDate = async date => {
  const total = await db.purchasedProducts.sum('price', {
    where: { createdAt: { [Op.lt]: `${date}T23:59:59.000Z`, [Op.gt]: `${date}T00:00:00.000Z` } }
  });
  return total || 0;
};
export const getTotalByDateForCategory = async (date, category) => {
  const total = await db.purchasedProducts.sum('price', {
    where: { createdAt: { [Op.lt]: `${date}T23:59:59.000Z`, [Op.gt]: `${date}T00:00:00.000Z` } },
    include: [
      {
        model: db.products,
        as: 'product',
        where: {
          category: category
        },
        required: true
      }
    ],
    group: ['product.id']
  });
  return total || 0;
};

export const getCountByDate = async date => {
  const total = await db.purchasedProducts.count({
    where: { createdAt: { [Op.lt]: `${date}T23:59:59.000Z`, [Op.gt]: `${date}T00:00:00.000Z` } }
  });
  return total;
};

export const getCountByDateForCategory = async (date, category) => {
  const total = await db.purchasedProducts.count({
    where: { createdAt: { [Op.lt]: `${date}T23:59:59.000Z`, [Op.gt]: `${date}T00:00:00.000Z` } },
    include: [
      {
        model: db.products,
        as: 'product',
        where: {
          category: category
        },
        required: true
      }
    ],
    group: ['product.id']
  });
  return total[0] ? Number(total[0].count) : 0;
};
