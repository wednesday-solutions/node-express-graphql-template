import { SUBSCRIPTION_TOPICS } from '@server/utils/constants';
import { GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { withFilter } from 'graphql-subscriptions';
import { getAsyncInterator, getFilteredSubscription } from '../purchasedProductSubscription/purchasedProductSubsUtil';

export const PurchasedProductSubscription = {
  type: new GraphQLObjectType({
    name: 'PurchasedOrderSubscription',
    fields: () => ({
      productId: {
        type: GraphQLNonNull(GraphQLInt)
      },
      deliveryDate: {
        type: GraphQLNonNull(GraphQLDateTime)
      },
      price: {
        type: GraphQLNonNull(GraphQLInt)
      },
      supplierId: {
        type: GraphQLNonNull(GraphQLInt)
      }
    })
  }),
  args: {
    supplierId: {
      type: GraphQLNonNull(GraphQLInt)
    }
  },
  subscribe: withFilter(getAsyncInterator(SUBSCRIPTION_TOPICS.NOTIFICATIONS), getFilteredSubscription)
};
