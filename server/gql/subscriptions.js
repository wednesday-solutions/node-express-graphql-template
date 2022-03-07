import { GraphQLNonNull, GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql';
import { pubsub } from '@utils/pubsub';
import { SUBSCRIPTION_TOPICS } from '@utils/constants';
export const SubscriptionRoot = new GraphQLObjectType({
  name: 'Subscription',
  fields: {
    notifications: {
      type: new GraphQLObjectType({
        name: 'ScheduleJobSubscription',
        fields: () => ({
          message: {
            type: GraphQLNonNull(GraphQLString)
          },
          scheduleIn: {
            type: GraphQLNonNull(GraphQLInt)
          }
        })
      }),
      subscribe: (_, args) => pubsub.asyncIterator(SUBSCRIPTION_TOPICS.NOTIFICATIONS)
    }
  }
});
