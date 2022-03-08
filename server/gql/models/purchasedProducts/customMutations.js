import { pubsub } from '@utils/pubsub';
import db from '@database/models';
import { SUBSCRIPTION_TOPICS } from '@utils/constants';
import { getSingleSupplierId } from '@utils/rawQueries';
import { insertPurchasedProducts } from '@daos/purchasedProducts';

export const customCreateResolver = () => ({
  createResolver: async (model, args, context) => {
    const res = await insertPurchasedProducts(args);
    const supplierProduct = await getSingleSupplierId(db.supplierProducts, args);
    pubsub.publish(SUBSCRIPTION_TOPICS.NOTIFICATIONS, {
      notifications: {
        productId: res.productId,
        deliveryDate: res.deliveryDate,
        price: res.price,
        supplierId: supplierProduct.supplierId
      }
    });
    return res;
  }
});
