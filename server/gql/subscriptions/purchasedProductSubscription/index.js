import { GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { withFilter } from 'graphql-subscriptions';
import { filter, iterator } from '../purchasedProductSubscription/purchasedProductSubsUtil';

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
  subscribe: withFilter(iterator, filter)
};
