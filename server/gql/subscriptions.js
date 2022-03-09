import { GraphQLNonNull, GraphQLObjectType, GraphQLInt } from 'graphql';
import { pubsub } from '@utils/pubsub';
import { withFilter } from 'graphql-subscriptions';
import { SUBSCRIPTION_TOPICS } from '@utils/constants';
import { GraphQLDateTime } from 'graphql-iso-date';
export const SubscriptionRoot = new GraphQLObjectType({
  name: 'Subscription',
  fields: {
    notifications: {
      type: new GraphQLObjectType({
        name: 'ScheduleJobSubscription',
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
      subscribe: withFilter(
        () => pubsub.asyncIterator(SUBSCRIPTION_TOPICS.NOTIFICATIONS),
        (payload, variables) => {
          console.log('here');
          return payload.notifications.supplierId === variables.supplierId;
        }
      )
    }
  }
});
