import { GraphQLObjectType } from 'graphql';
import { PurchasedProductSubscription } from './subscriptions/purchasedProductSubscription';
export const SubscriptionRoot = new GraphQLObjectType({
  name: 'Subscription',
  fields: {
    newPurchasedProduct: {
      ...PurchasedProductSubscription
    }
  }
});
