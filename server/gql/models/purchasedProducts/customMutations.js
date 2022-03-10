import moment from 'moment';
import { insertPurchasedProducts } from '@daos/purchasedProducts';
import { transformSQLError } from '@utils';
import { redis } from '@services/redis';
import { getCategoryById } from '@utils/queries';

export const customCreateResolver = () => ({
  createResolver: async (model, args, context) => {
    const currentDate = moment().format('YYYY-MM-DD');
    try {
      const res = await insertPurchasedProducts(args);
      const category = await getCategoryById(res.productId);
      const redisAggregate = JSON.parse(await redis.get(`${currentDate}_total`));
      const redisAggregateCategory = JSON.parse(await redis.get(`${currentDate}_${category}`));
      redis.set(
        `${currentDate}_${category}`,
        JSON.stringify({
          total: redisAggregateCategory?.total + args.price || args.price,
          count: redisAggregateCategory?.count + 1 || 1
        })
      );
      redis.set(
        `${currentDate}_total`,
        JSON.stringify({
          total: redisAggregate?.total + args.price || args.price,
          count: redisAggregate?.count + 1 || 1
        })
      );
      return res;
    } catch (err) {
      throw transformSQLError(err);
    }
  }
});
