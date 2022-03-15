import { pubsub } from '@server/utils/pubsub';

export function getAsyncInterator(topicName) {
  return () => pubsub.asyncIterator(topicName);
}

export function getFilteredSubscription(payload, variables) {
  return Number(payload.notifications.storeId) === variables.storeId;
}
