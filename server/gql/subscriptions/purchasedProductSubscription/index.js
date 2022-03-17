import { getAsyncInterator } from '@utils/iterator';
import { SUBSCRIPTION_TOPICS } from '@server/utils/constants';
import { GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { withFilter } from 'graphql-subscriptions';
import { checkFilterCondition } from '../purchasedProductSubscription/purchasedProductSubsUtil';

export const PurchasedProductSubscription = {
  type: new GraphQLObjectType({
    name: SUBSCRIPTION_TOPICS.NEW_PURCHASED_PRODUCT,
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
      storeId: {
        type: GraphQLNonNull(GraphQLInt)
      }
    })
  }),
  args: {
    storeId: {
      type: GraphQLNonNull(GraphQLInt)
    }
  },
  subscribe: withFilter(getAsyncInterator(SUBSCRIPTION_TOPICS.NEW_PURCHASED_PRODUCT), checkFilterCondition)
};
