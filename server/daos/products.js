import db from '@database/models';
import Sequelize from 'sequelize';
import { redis } from '@services/redis';
import { transformDbArrayResponseToRawResponse } from '@server/utils/transformerUtils';

export const getCategoryById = async id => {
  const product = await db.products.findOne({ where: { id } });
  return product.category;
};

export const getAllCategories = async () => {
  const categoriesFromRedis = await redis.get('categories');
  // add mutation to add category to redis for create product mutation
  if (!categoriesFromRedis) {
    const allCategories = await db.products.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('category')), 'category']]
    });
    const response = transformDbArrayResponseToRawResponse(allCategories);
    const categories = response.map(item => item.category);
    redis.set('categories', JSON.stringify(categories));
    return categories;
  } else {
    return JSON.parse(categoriesFromRedis);
  }
};
